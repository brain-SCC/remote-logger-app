
import { ConsoleLogger } from './ConsoleLogger';
import { Renderer } from './Renderer';
import { AppConfig } from "./config/AppConfig";
import { SshRemoteForwardConnection } from "./ssh/SshRemoteForwardConnection";
import { Webserver } from "./webserver/Webserver";

export class App {
  private webServer?: Webserver
  private sshCon?: SshRemoteForwardConnection
  private fnOnSshConnectionChange?: any
  
  constructor(
    private readonly appConf: AppConfig,
    private readonly renderer: Renderer,
    private readonly logger: ConsoleLogger,
    fnOnSshConnectionChange: any
  ) {
    this.fnOnSshConnectionChange = fnOnSshConnectionChange;
  }

  public start() {
    this.startWebserver();
    this.openSshConnection(this.fnOnSshConnectionChange);
    this.showBanner();
  }

  public async stop(): Promise<void> {
    if(this.webServer) {
      this.logger.debug("Webserver defined, stopping")
      this.webServer.stop().then(() => {
        this.webServer = undefined
        this.logger.debug("Webserver now stopped")
      })
    }
    else {
      this.logger.debug("no Webserver defined")
    }

    if(this.sshCon) {
      this.logger.debug("SSH connection open, closing")
      this.sshCon
        .unforwardIn(this.appConf.localConf.host, this.appConf.localConf.port)
        .then(() => {
          this.sshCon?.disconnect()
          this.sshCon = undefined;
          this.logger.debug("SSH connection closed")
        });
    }
    else {
      this.logger.debug("no SSH connection open")
    }
    this.fnOnSshConnectionChange('close')
  }

  public async reconnect(): Promise<void>  {
    if(this.sshCon || this.webServer) {
      await this.stop().then(() => {
        this.start()
      })
    }
    else {
      this.start()
    }
  }

  private startWebserver(): void {
    const fnPostHandler = (data: any) => {
      this.renderer.renderItem(data);
      this.renderer.cleanOverflow();
    };

    /* starts local webserver on 127.0.0.1:290980 */
    this.webServer = new Webserver(this.appConf);
    this.webServer.registerRoutes(fnPostHandler);
    this.webServer.start();
  }

  private openSshConnection(fnOnSshConnectionChange: any): void {
    /* opens ssh remote forward connection to remote host */
    const openSshRemoteForwardConnection = async () => {
      this.sshCon = await SshRemoteForwardConnection.create(this.appConf.sshConf, this.logger, fnOnSshConnectionChange);
      /* forward to local 127.0.0.1:290980 */
      this.sshCon.forwardIn(this.appConf.localConf.host, this.appConf.localConf.port);
    };
    openSshRemoteForwardConnection();
  }

  private showBanner(): void {
    this.logger.log(`                             
  _____               _          __                        
  | __  |___ _____ ___| |_ ___   |  |   ___ ___ ___ ___ ___ 
  |    -| -_|     | . |  _| -_|  |  |__| . | . | . | -_|  _|
  |__|__|___|_|_|_|___|_| |___|  |_____|___|_  |_  |___|_|  
                                            |___|___|        
`);
  }
}
