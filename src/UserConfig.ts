import { readFileSync, existsSync } from "fs";
import os from "os";
import path from "path";

export interface UserConfigInterface {
    remoteHost: string;
    remotePort: number;
    username: string;
    password: string | undefined;
    privateKey: string | undefined;
    passphrase: string | undefined;
}

interface ReadConfig {
    remoteHost?: string | undefined;
    remotePort?: string | number | undefined;
    username?: string | undefined;
    password?: string | undefined;
    privateKey?: string | undefined;
    passphrase?: string | undefined;
}

export class UserConfig implements UserConfigInterface {
    remoteHost: string;
    remotePort: number;
    username: string;
    password: string | undefined;
    privateKey: string | undefined;
    passphrase: string | undefined;

    constructor() {
        this.remoteHost = "127.0.0.1";
        this.remotePort = 22;
        this.username = os.userInfo().username;
        this.privateKey = path.resolve(os.homedir(), ".ssh", "id_rsa");
        this.read();
    }

    private read(): void {
        const userConf:ReadConfig = this.readUserConfigFile();

        if(userConf.remoteHost) {
            this.remoteHost = userConf.remoteHost;
        }
        if(userConf.remotePort) {
            this.remotePort = (typeof userConf.remotePort === "string")? parseInt(userConf.remotePort) : userConf.remotePort;
        }
        if(userConf.username) {
            this.username = userConf.username;
        }
    }

    private readUserConfigFile(): ReadConfig {
        let userConf:ReadConfig = {};
        const filepath = this.getUserConfigFile();
        if(existsSync(filepath)) {
            userConf = JSON.parse(readFileSync(filepath, "utf8"));
        }
        return userConf;
    }

    private getUserConfigFile(): string {
        return path.resolve(os.homedir(), "remote-logger.json");
    }
}