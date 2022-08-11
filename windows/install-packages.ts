import yargs from "https://deno.land/x/yargs@v17.5.1-deno/deno.ts";
import { Arguments } from "https://deno.land/x/yargs@v17.5.1-deno/deno-types.ts";
import { YargsInstance } from "https://deno.land/x/yargs@v17.5.1-deno/build/lib/yargs-factory.js";

import {
  parse as yamlParse,
} from "https://deno.land/std@0.150.0/encoding/yaml.ts";

import Execute from "../libraries/windows/execute.ts";

type ConfigFile = {
  scoop: {
    buckets: string[],
    packages: string[],
  },
  winget: string[],
  appx: {
    remove: string[]
  }
};

await yargs(["do", ...Deno.args])
  .scriptName("install-packages")
  .command(
    "do <config-filename>",
    "Install packages on Windows from a YAML config file",
    (yargs: YargsInstance) => {
      yargs.option("config-filename", {
        default: false,
        type: "string",
      });
    },
    async (argv: Arguments) => {
      let content: string;
      const configFilename: string = argv["config-filename"];
      if (configFilename.startsWith("http")) {
        content = await (await fetch(configFilename)).text();
      } else {
        content = await Deno.readTextFile(configFilename);
      }

      const parsedConfig = yamlParse(content) as ConfigFile;

      // Scoop
      for (const bucket of parsedConfig.scoop.buckets) {
       console.log(await new Execute().execute("scoop", ["bucket", "add", bucket]))
      }

      for (const application of parsedConfig.scoop.packages) {
        console.log(await new Execute().execute("scoop", ["install", application]))
      }

      // Win get
      for (const application of parsedConfig.winget) {
        console.log(await new Execute().execute("winget", ["install", "--id", application]))
      }

      for (const application of parsedConfig.appx.remove) {
        const command1 = `Get-AppxPackage "${application}" -AllUsers | Remove-AppxPackage`
        try {
            console.log(await new Execute().execute("", command1.split(" ")))
        } catch (error) {
            if (!String(error).match("Package was not found")) {
                throw error
            }
        }

        const command2 = `Get-AppXProvisionedPackage -Online | Where-Object DisplayNam -like "${application}" | Remove-AppxProvisionedPackage -Online`
        try {
            console.log(await new Execute().execute("", command2.split(" ")))
        } catch (error) {
            if (!String(error).match("Package was not found")) {
                throw error
            }
        }
      }

      return true;
    },
  )
  .strictCommands()
  .demandCommand(1)
  .parse();
