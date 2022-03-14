import { LocalConfig } from './LocalConfig';
import { SshConfig } from './SshConfig';
import { UserConfig } from './UserConfig';

export class AppConfig {
    private _userConf: UserConfig;
    private _localConf: LocalConfig;
    private _sshConf: SshConfig;

    constructor() {
        this._localConf = new LocalConfig();
        this._userConf = new UserConfig();
    }

    get userConf() {
        return this._userConf;
    }

    get localConf() {
        return this._localConf;
    }

    get sshConf() {
        if (!this._sshConf) {
            this._sshConf = new SshConfig(this.userConf.remoteHost, this.userConf.remotePort, this.userConf.username);
        }
        if (this.userConf.password) {
            this._sshConf.setUserpassword(this.userConf.password);
        }
        else {
            this._sshConf.readPrivateKey(this.userConf.privateKey, this.userConf.passphrase);
        }
        return this._sshConf;
    }
}