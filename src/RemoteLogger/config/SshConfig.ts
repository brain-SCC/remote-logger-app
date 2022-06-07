import { readFileSync } from "fs";
import path from "path";
import { ConnectConfig, BaseAgent } from "ssh2";
import os from "os";

export class SshConfig implements ConnectConfig {
  password?: string
  privateKey?: Buffer | string
  passphrase?: string
  agent?: BaseAgent | string | undefined

  constructor(
    public readonly host: string,
    public readonly port: number,
    public readonly username: string
  ) {}

  public setUserpassword(password?: string) {
    this.password = password;
  }

  public readPrivateKey(filepath?: string, passphrase?: string) {
    if (!filepath) {
      const homedir = os.homedir();
      filepath = path.resolve(homedir, ".ssh", "id_rsa");
    }
    const fileContent = readFileSync(filepath);
    this.privateKey = Buffer.from(fileContent);
    this.passphrase = passphrase;
  }

  public getAgent(): string|undefined {
    if(process.env.SSH_AUTH_SOCK) {
      return process.env.SSH_AUTH_SOCK;
    }
    return undefined
  }
}
