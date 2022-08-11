// - Remove all unnecessary programs
// - Install Scoop
// - Install Chocolatey
// - Install win get

import Execute from "../libraries/windows/execute.ts";

console.log(await new Execute().execute("irm", ["get.scoop.sh", "|", "iex"]))

console.log(await new Execute().execute("irm", ["https://community.chocolatey.org/install.ps1", "|", "iex"]))