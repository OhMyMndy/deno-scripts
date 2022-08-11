export class WindowsRegistry {
  async execute(command: string, args: string[]): Promise<string> {
    const finalCommand = [
      "powershell",
      "-Command",
      command,
      ...args,
    ].map((arg, _index) => {
      if (typeof arg !== "string") {
        arg = arg + "";
      }
      if (arg.includes(" ")) {
        arg = `"${arg}"`;
      }
      return arg;
    });

    const p = Deno.run({
      cmd: finalCommand,
      quoteArgs: true,
      stderr: "piped",
      stdout: "piped",
    });

    const output = await p.output();
    const err = await p.stderrOutput();
    p.close();
    if (err.length) {
      throw new TextDecoder().decode(err);
    }

    return new TextDecoder().decode(output);
  }

  async write(path: string, name: string, value: string): Promise<void> {
    try {
      await this.execute("Set-ItemProperty", [path, name, value]);
    } catch (err) {
      if (String(err).match("registry access is not allowed")) {
        console.warn(`Skipping, registry access is not allowed for ${path} with name ${name} and value ${value}`);
      }
    }
  }

  async createFolder(path: string): Promise<void> {
    if (await this.execute("Test-Path", [path]) == "False") {
      await this.execute("New-Item", ["-Path", path, "-type", "Folder"]);
    }
  }
}
