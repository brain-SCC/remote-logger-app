import { readFileSync, existsSync } from "fs";
import os from "os";
import path from "path";

export interface UserConfigInterface {
  remoteHost: string
  remotePort: number
  username: string
  password?: string
  privateKey?: string
  passphrase?: string
  agent?: boolean
  isDebugEnabled: boolean
}

interface ReadConfig {
  host?: string
  port?: string | number
  username?: string
  password?: string
  privateKey?: string
  passphrase?: string
  agent?:boolean
  debug?: boolean
}

export class UserConfig implements UserConfigInterface {
  private static USER_CONF = "remote-logger.json"
  remoteHost: string
  remotePort: number
  username: string
  password?: string
  privateKey?: string
  passphrase?: string
  agent?:boolean
  isDebugEnabled: boolean

  constructor() {
    this.remoteHost = "127.0.0.1"
    this.remotePort = 22
    this.username = os.userInfo().username
    this.privateKey = path.resolve(os.homedir(), ".ssh", "id_rsa")
    this.isDebugEnabled = false
    this.read()
  }

  private read(): void {
    const userConfFileValues: ReadConfig = this.readUserConfigFile()

    if (userConfFileValues.host) {
      this.remoteHost = userConfFileValues.host
    }
    if (userConfFileValues.port) {
      this.remotePort =
        typeof userConfFileValues.port !== "number"
          ? parseInt(userConfFileValues.port)
          : userConfFileValues.port
    }
    if (userConfFileValues.username) {
      this.username = userConfFileValues.username
    }
    if (userConfFileValues.password) {
      this.password = userConfFileValues.password
    }
    if (userConfFileValues.privateKey) {
      this.privateKey = userConfFileValues.privateKey
    }
    if (userConfFileValues.passphrase) {
      this.passphrase = userConfFileValues.passphrase
    }
    if (userConfFileValues.agent) {
      this.agent = userConfFileValues.agent
    }
    if (userConfFileValues.debug) {
      this.isDebugEnabled = userConfFileValues.debug
    }
  }

  private readUserConfigFile(): ReadConfig {
    let userConf: ReadConfig = {}
    const filepath = this.getUserConfigFile()
    if (existsSync(filepath)) {
      userConf = JSON.parse(readFileSync(filepath, "utf8"))
    }
    return userConf;
  }

  private getUserConfigFile(): string {
    return path.resolve(os.homedir(), UserConfig.USER_CONF)
  }
}
