import { existsSync, readFileSync } from "fs";
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

  public getAgent(): string|undefined {
    if(process.env.SSH_AUTH_SOCK) {
      return process.env.SSH_AUTH_SOCK;
    }
    return undefined
  }

  public readPrivateKey(filepath?: string, passphrase?: string) {
    if (!filepath) {
      filepath = PrivateKeyLocator.locate()
    }
    this.privateKey = this.loadPrivateKeyBuffer(filepath)
    this.passphrase = passphrase;
  }

  private loadPrivateKeyBuffer(filepath?: string): Buffer|undefined {
    if(filepath && existsSync(filepath)) {
      const fileContent =  readFileSync(filepath);
      return Buffer.from(fileContent);
    }
    return undefined
  }
}

export class PrivateKeyLocator 
{
    private static readonly KEY_FILES = [ 
        "id_dsa",
        "id_ecdsa",
        "id_ecdsa_sk",
        "id_ed25519",
        "id_ed25519_sk",
        "id_rsa",
    ]

    public static locate(): string|undefined 
    {
        const homedir = os.homedir();
        const sshdir = path.resolve(homedir, ".ssh")
        return PrivateKeyLocator.locateIn(sshdir)
    }

    public static locateIn(directory: string): string|undefined 
    {
      const existingFiles = PrivateKeyLocator.KEY_FILES
        .map((file) => path.resolve(directory, file))
        .filter((filepath) => existsSync(filepath))

      if(existingFiles.length > 0) {
          return existingFiles[0]
      }
      return undefined
    }
}