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
  maxLogEntries?:number
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
  maxLogEntries?:number
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
  maxLogEntries?:number

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
      const remotePort = this.getIntegerConfigValue(userConfFileValues.port)
      if(remotePort > 0 && remotePort <= 65535) {
        this.remotePort = remotePort; 
      }
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
    if (userConfFileValues.maxLogEntries) {
      const maxLogEntries = this.getIntegerConfigValue(userConfFileValues.maxLogEntries)
      if(maxLogEntries > 0 && maxLogEntries < Number.MAX_SAFE_INTEGER) {
        this.maxLogEntries = maxLogEntries; 
      }
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

  private getIntegerConfigValue(value:string|number) {
    return typeof value !== "number"
              ? parseInt(value)
              : value
  }

  private getUserConfigFile(): string {
    return path.resolve(os.homedir(), UserConfig.USER_CONF)
  }
}
