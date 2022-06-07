
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

  public run() {
    this.startWebserver();
    this.start();
  }

  public reconnect(): void  {
    if(this.isConnected()) {
      this.stop()
    }
    this.start()
  }

  private startWebserver(): void {
    const fnPostHandler = (data: any) => {
      this.renderer.renderItem(data);
      this.renderer.cleanOverflow();
    };

    /* starts local webserver on 127.0.0.1:290980 */
    this.webServer = new Webserver(this.appConf)
    this.webServer.registerRoutes(fnPostHandler)
    this.webServer.start()
  }

  private openSshConnection(): void {
    /* opens ssh remote forward connection to remote host */
    const openSshRemoteForwardConnection = async () => {
      this.sshCon = await SshRemoteForwardConnection.create(this.appConf.sshConf, this.logger, this.fnOnSshConnectionChange);
      /* forward to local 127.0.0.1:290980 */
      this.sshCon.forwardIn(this.appConf.localConf.host, this.appConf.localConf.port);
    };
    openSshRemoteForwardConnection();
  }

  private isConnected(): boolean {
    if(this.sshCon?.isConnectionOpen()) {
      return true;
    }
    return false;
  }

  private start() {
    this.openSshConnection();
    this.showBanner();
  }

  private stop(): void {
    this.sshCon?.disconnect();
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
