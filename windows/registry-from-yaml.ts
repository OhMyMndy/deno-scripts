import yargs from "https://deno.land/x/yargs@v17.5.1-deno/deno.ts";
import { Arguments } from "https://deno.land/x/yargs@v17.5.1-deno/deno-types.ts";
import { YargsInstance } from "https://deno.land/x/yargs@v17.5.1-deno/build/lib/yargs-factory.js";

import {
  parse as yamlParse,
} from "https://deno.land/std@0.150.0/encoding/yaml.ts";

import { WindowsRegistry } from "../libraries/windows_registry/windows_registry.ts";

const registry = new WindowsRegistry();

type ConfigFile = {
  folders: string[],
  itemProperties: Array<{
    path: string,
    name: string,
    value: string,
  }>
};

await yargs(["do", ...Deno.args])
  .scriptName("registry-from-yaml")
  .command(
    "do <config-filename>",
    "Configure Windows registry from a YAML config file",
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

      for (const folder of parsedConfig.folders) {
        registry.createFolder(folder)
      }

      for (const itemProperty of parsedConfig.itemProperties) {
        registry.write(itemProperty.path, itemProperty.name, itemProperty.value);
      }

      return true;
    },
  )
  .strictCommands()
  .demandCommand(1)
  .parse();
