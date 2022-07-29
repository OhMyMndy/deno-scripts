import { Dconf } from "./dconf.ts"

import { assertEquals } from "https://deno.land/std@0.150.0/testing/asserts.ts";


Deno.test("Test list", async () => {
    const dconf = new Dconf()

    assertEquals(["io/", "org/"], await dconf.list("/"))
})



Deno.test("Test dump", async () => {
    const dconf = new Dconf()

    await dconf.dump("/")
})

Deno.test("Test write", async () => {
    const dconf = new Dconf()

    await dconf.write("/org/gnome/shell/extensions/pop-cosmic/clock-alignment", "'RIGHT'")
})

Deno.test("Test read", async () => {
    const dconf = new Dconf()

    await dconf.read("/org/gnome/shell/extensions/pop-cosmic/clock-alignment")
})