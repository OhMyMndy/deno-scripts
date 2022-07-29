import yargs from "https://deno.land/x/yargs@v17.5.1-deno/deno.ts";
import { Arguments } from "https://deno.land/x/yargs@v17.5.1-deno/deno-types.ts";
import { YargsInstance } from "https://deno.land/x/yargs@v17.5.1-deno/build/lib/yargs-factory.js";

import {
  parse as yamlParse,
  parseAll as yamlParseAll,
  stringify as yamlStringify,
} from "https://deno.land/std@0.150.0/encoding/yaml.ts";

import { Dconf } from "../libraries/dconf/dconf.ts";
import { parse } from "https://deno.land/std@0.150.0/path/win32.ts";

const dconf = new Dconf();

type ConfigFile = {
  values: Map<string, string>;
};

await yargs(["do", ...Deno.args])
  .scriptName("dconf-from-yaml")
  .command(
    "do <config-filename>",
    "Set dconf values from yaml",
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

      for (const [key, value] of Object.entries(parsedConfig.values)) {
        dconf.write(key, value);
      }

      return true;
    },
  )
  .strictCommands()
  .demandCommand(1)
  .parse();
