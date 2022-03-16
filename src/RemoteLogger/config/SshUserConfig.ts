import { readFileSync, existsSync } from "fs";
import os from "os";
import path from "path";

export interface SshUserConfigInterface {
    remoteHost: string
    remotePort: number
    username: string
    password?: string
    privateKey?: string
    passphrase?: string
}

interface ReadConfig {
    host?: string
    port?: string | number
    username?: string
    password?: string
    privateKey?: string
    passphrase?: string
}

export class SshUserConfig implements SshUserConfigInterface {
    private static USER_CONF = "remote-logger.json";
    remoteHost: string
    remotePort: number
    username: string;
    password?: string
    privateKey?: string
    passphrase?: string

    constructor() {
        this.remoteHost = "127.0.0.1"
        this.remotePort = 22
        this.username = os.userInfo().username
        this.privateKey = path.resolve(os.homedir(), ".ssh", "id_rsa")
        this.read();
    }

    private read(): void {
        const userConf:ReadConfig = this.readUserConfigFile()

        if(userConf.host) {
            this.remoteHost = userConf.host
        }
        if(userConf.port) {
            this.remotePort = (typeof userConf.port !== "number")? parseInt(userConf.port) : userConf.port
        }
        if(userConf.username) {
            this.username = userConf.username
        }
        if(userConf.password) {
            this.password = userConf.password
        }
    }

    private readUserConfigFile(): ReadConfig {
        let userConf:ReadConfig = {}
        const filepath = this.getUserConfigFile()
        if(existsSync(filepath)) {
            userConf = JSON.parse(readFileSync(filepath, "utf8"))
        }
        return userConf
    }

    private getUserConfigFile(): string {
        return path.resolve(os.homedir(), SshUserConfig.USER_CONF)
    }
}