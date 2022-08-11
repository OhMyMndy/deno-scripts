export default class Execute {
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
  
  }
  