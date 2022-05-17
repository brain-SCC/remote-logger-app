
import { ConsoleLogger } from './ConsoleLogger';
import { Renderer } from './Renderer';
import { AppConfig } from "./config/AppConfig";

import { SshRemoteForwardConnection } from "./ssh/SshRemoteForwardConnection";
import { Webserver } from "./webserver/Webserver";

export class App {
  constructor(
    private readonly appConf: AppConfig,
    private readonly renderer: Renderer,
    private readonly logger: ConsoleLogger
  ) {}

  public run(fnOnSshConnectionChange: any) {
    this.startWebserver();
    this.openSshConnection(fnOnSshConnectionChange);
    this.showBanner();
  }

  private startWebserver(): void {

    const fnPostHandler = (data: any) => {
      this.renderer.renderItem(data);
      this.renderer.cleanOverflow();
    };

    /* starts local webserver on 127.0.0.1:290980 */
    const webServer: Webserver = new Webserver(this.appConf);
    webServer.registerRoutes(fnPostHandler);
    webServer.start();
  }

  private openSshConnection(fnOnSshConnectionChange: any): void {
    /* opens ssh remote forward connection to remote host */
    const openSshRemoteForwardConnection = async () => {
      const con: SshRemoteForwardConnection =
        await SshRemoteForwardConnection.create(this.appConf.sshConf, this.logger, fnOnSshConnectionChange);
      /* forward to local 127.0.0.1:290980 */
      con.forwardIn(this.appConf.localConf.host, this.appConf.localConf.port);
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
