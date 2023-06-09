
import net from "net";
import { Client } from "ssh2";
import { SshConfig } from "../config/SshConfig";
import { ConsoleLogger } from './../ConsoleLogger';
export class SshRemoteForwardConnection {
  
  private isSshSocketOpen:boolean;

  constructor(private readonly client: Client, private readonly conf: SshConfig, private readonly logger: ConsoleLogger) {
    this.isSshSocketOpen = true;
  }

  public static async create(
    conf: SshConfig, 
    logger: ConsoleLogger, 
    fnOnSshConnectionChange: any
  ): Promise<SshRemoteForwardConnection> {
    const theClient: Client = await new Promise((resolve) => {
      const conn = new Client();
      conn
        .on("ready", () => {
          fnOnSshConnectionChange('ready')
          resolve(conn)
        })
        .on("continue", () => {
          fnOnSshConnectionChange('continue')
        })
        .on("close", () => {
          fnOnSshConnectionChange('close')
        })
        .on("error", () => {
          fnOnSshConnectionChange('error')
        })
        .on("tcp connection", (details, accept) => {
          logger.debug('TCP :: INCOMING CONNECTION:')
          logger.dir(details);
          const stream = accept();

          stream.on('close', () => {
            logger.log('TCP :: CLOSED')
          }).on('data', (data: any) => {
            logger.log('TCP :: DATA: ' + data);
          }).stderr.on('data', (data: any) => {
            logger.error('STDERR: ' + data);
          });

          stream.pause();
          const serverSocket = net.connect(details.destPort, details.destIP, () => {
            stream.pipe(serverSocket);
            serverSocket.pipe(stream);
            stream.resume();
          });
          serverSocket.addListener("close", () => {
            logger.debug("Socket closed")
          })
          serverSocket.addListener("ready", () => {
            logger.debug("Socket ready")
          })
        }).connect(conf)
    });
    return new SshRemoteForwardConnection(theClient, conf, logger);
  }

  public async forwardIn(
    remoteHost: string,
    remotePort: number
  ): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.client.forwardIn(remoteHost, remotePort, (error) => {
        if (error) {
          this.logger.error(error);
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  public isConnectionOpen(): boolean {
    return this.isSshSocketOpen;
  }

  public reconnect(): void {
    this.client.connect(this.conf)
    this.isSshSocketOpen = true
  }

  public disconnect(): void {
    this.client.end();
    this.client.destroy();
    this.isSshSocketOpen = false;
  }
}
