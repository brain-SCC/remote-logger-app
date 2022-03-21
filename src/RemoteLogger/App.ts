import { AppConfig } from "./config/AppConfig";
import { ItemPrinter } from "./printer/ItemPrinter";
import { SshRemoteForwardConnection } from "./ssh/SshRemoteForwardConnection";
import { Webserver } from "./webserver/Webserver";

export class App {
  private static MAX_LOG_ENTIES = 1000;
  private itemPrinter: ItemPrinter;

  constructor(
    private readonly output: HTMLElement,
    private readonly appConf: AppConfig,
    private readonly logger?: any
  ) {
    this.itemPrinter = new ItemPrinter();
  }

  public run() {
    this.startWebserver();
    this.openSshConnection();
    this.showBanner();
  }

  private startWebserver(): void {
    const fnClean = async (output: HTMLElement) => {
      while (output.childNodes.length > App.MAX_LOG_ENTIES) {
        output.removeChild(output.lastChild);
      }
    };
    const fnPostHandler = (data: any) => {
      const item: HTMLDivElement = document.createElement("div");
      item.innerHTML = this.itemPrinter.toHtml(data);
      this.output.prepend(item);
      fnClean(this.output);
    };

    /* starts local webserver on 127.0.0.1:290980 */
    const webServer: Webserver = new Webserver(this.appConf);
    webServer.registerRoutes(fnPostHandler);
    webServer.start();
  }

  private openSshConnection(): void {
    /* opens ssh remote forward connection to remote host */
    const openSshRemoteForwardConnection = async () => {
      const con: SshRemoteForwardConnection =
        await SshRemoteForwardConnection.create(this.appConf.sshConf);
      /* forward to local 127.0.0.1:290980 */
      con.forwardIn(this.appConf.localConf.host, this.appConf.localConf.port);
    };
    openSshRemoteForwardConnection();
  }

  private showBanner(): void {
    this.logger?.log(`                             
  _____               _          __                        
  | __  |___ _____ ___| |_ ___   |  |   ___ ___ ___ ___ ___ 
  |    -| -_|     | . |  _| -_|  |  |__| . | . | . | -_|  _|
  |__|__|___|_|_|_|___|_| |___|  |_____|___|_  |_  |___|_|  
                                            |___|___|        
`);
  }
}
