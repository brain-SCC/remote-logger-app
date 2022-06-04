import { WebserverConfig } from "./WebserverConfig";
import { SshConfig } from "./SshConfig";
import { UserConfig } from "./SshUserConfig";

export class AppConfig {
  private _localConf: WebserverConfig
  private _sshConf: SshConfig
  private _isDebugEnabled: boolean
  
  constructor() {
    this._localConf = new WebserverConfig()
    const userConf = new UserConfig()
    this._sshConf = new SshConfig(
      userConf.remoteHost,
      userConf.remotePort,
      userConf.username
    )
    if (userConf.password) {
      this._sshConf.setUserpassword(userConf.password)
    } else if(userConf.agent) {
      this._sshConf.agent = this._sshConf.getAgent();
    } else {
      this._sshConf.readPrivateKey(
        userConf.privateKey,
        userConf.passphrase
      )
    }
    this._isDebugEnabled = userConf.isDebugEnabled
  }

  get localConf(): WebserverConfig {
    return this._localConf
  }

  get sshConf(): SshConfig {
    return this._sshConf
  }

  get isDebugEnabled(): boolean {
    return this._isDebugEnabled
  }
}
