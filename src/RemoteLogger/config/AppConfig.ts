import { WebserverConfig } from './WebserverConfig'
import { SshConfig } from './SshConfig'
import { SshUserConfig } from './SshUserConfig'

export class AppConfig {
    private _localConf: WebserverConfig
    private _sshConf: SshConfig

    constructor() {
        this._localConf = new WebserverConfig()
        const sshUserConf = new SshUserConfig()
        this._sshConf = new SshConfig(sshUserConf.remoteHost, sshUserConf.remotePort, sshUserConf.username)
        if (sshUserConf.password) {
            this._sshConf.setUserpassword(sshUserConf.password)
        }
        else {
            this._sshConf.readPrivateKey(sshUserConf.privateKey, sshUserConf.passphrase)
        }
    }

    get localConf() {
        return this._localConf
    }

    get sshConf() {
        return this._sshConf
    }
}