export class WindowsRegistry {

    async execute(command: string, args: string[]): Promise<string> {
      const finalCommand = [
        "powershell",
        "-Command",
        command,
        ...args,
      ];
        finalCommand.forEach((arg, index) => {
            if (typeof arg !== "string") {
                arg = arg + ""
                finalCommand[index] = arg
            }
            if (arg.includes(" ")) {
                finalCommand[index] = `"${arg}"`;
            }
        })

      const p = Deno.run({
        cmd: finalCommand,
        quoteArgs: true,
        stderr: "piped",
        stdout: "piped",
      });
      let output;
      try {
        const status = await p.status();
        if (status.code !== 0) {
          console.error(`${status.code}}`);
        }
        output = await p.output();
        const err = await p.stderrOutput();
        if (err) {
            throw new TextDecoder().decode(err);
        }
      } catch (error) {
        console.error(error);
      } finally {
        p.close();
      }
  
      return new TextDecoder().decode(output);
    }
  
  
    async write(path: string, name: string, value: string): Promise<void> {
      await this.execute("Set-ItemProperty", [path, name, value])
    }

    async createFolder(path: string): Promise<void> {
        if (await this.execute("Test-Path", [path]) == "False") {
            await this.execute("New-Item", ["-Path", path, "-type", "Folder"]);
        }
    }
  
  }
  