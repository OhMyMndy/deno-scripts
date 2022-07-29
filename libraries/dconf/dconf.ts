export class Dconf {

  async execute(command: string, args: string[]): Promise<string> {
    const finalCommand = [
      "dconf",
      command,
      ...args,
    ];
    const p = Deno.run({
      cmd: finalCommand,
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
    } catch (error) {
      console.error(error);
    } finally {
      p.close();
    }

    return new TextDecoder().decode(output);
  }

  async read(path: string) {
    const result = await this.execute("list", [path]);

    return result.trim().split(`\n`);
  }

  async list(path: string): Promise<string[]> {
    const result = await this.execute("list", [path]);

    return result.trim().split(`\n`);
  }

  async write(path: string, value: string): Promise<void> {
    await this.execute("write", [path, value])
  }

  async dump(path: string): Promise<string> {
    return await this.execute("dump", [path])
  }

}
