# Windows


## Prepare Windows installation

By installing Scoop and Chocolatey

```bash
deno run --allow-all https://raw.githubusercontent.com/OhMyMndy/deno-scripts/main/windows/prepare-windows.ts
```

## Install packages

```bash
deno run --allow-all https://raw.githubusercontent.com/OhMyMndy/deno-scripts/main/windows/install-packages.ts https://raw.githubusercontent.com/OhMyMndy/deno-scripts/main/windows/install-packages.yml
```

## Configure registry

```bash
deno run --allow-all https://raw.githubusercontent.com/OhMyMndy/deno-scripts/main/windows/registry-from-yaml.ts https://raw.githubusercontent.com/OhMyMndy/deno-scripts/main/windows/registry-from-yaml.yml
```