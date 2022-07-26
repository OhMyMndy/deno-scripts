// @see https://openwrt.github.io/luci/jsapi/LuCI.fs.html

import { decode } from "https://deno.land/std@0.149.0/encoding/base64.ts";

type LuciRpcApiOptions = {
  https: boolean;
  port: number;
  rpcPath: string;
};

export enum LuciRpcApiMethod {
  Auth = "auth",
  Fs = "fs"
}

export class LuciRpc {
  hostname: string;
  username: string;
  password: string;
  options: LuciRpcApiOptions | null;
  authToken: string | null;
  constructor(
    hostname: string,
    username: string,
    password: string,
    options: LuciRpcApiOptions | null = null,
  ) {
    this.hostname = hostname;
    this.username = username;
    this.password = password;
    this.options = options;
    this.authToken = null;
  }

  getBaseUrl() {
    const protocol: string = this.options?.https ? "https" : "http";
    const rpcPath: string = this.options?.rpcPath ?? "cgi-bin/luci/rpc/";
    return `${protocol}://${this.hostname}/${rpcPath}`;
  }
  async call(method: string, payload: {}): Promise<Response> {
    let url = this.getBaseUrl() + method
    if (this.authToken) {
        url += `?auth=${this.authToken}`
    }
    return await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async login(): Promise<boolean> {
    const response = await this.call(LuciRpcApiMethod.Auth, {
      id: 1,
      method: "login",
      params: [
        this.username,
        this.password,
      ],
    });
    const json = await response.json();
    if (json.error === null) {
      this.authToken = json.result;
      return true;
    } else {
      console.error(json.error);
      return false;
    }
  }

  async readFile(fileName: string): Promise<string> {
    const response = await this.call(LuciRpcApiMethod.Fs, {
        id: 1,
        method: "readfile",
        params: [
            fileName
        ],
      });
      const json = await response.json();

      if (json.error !== null) {
        throw new Error(json.error)
      }
    return new TextDecoder().decode(decode(json.result))
  }
}
