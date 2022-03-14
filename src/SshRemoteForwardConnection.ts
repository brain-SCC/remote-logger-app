import net from "net";
import { Client } from "ssh2";
import { SshConfig } from "./SshConfig";

export class SshRemoteForwardConnection {
    logger;
    constructor(private readonly client: Client, private readonly config: SshConfig) {
        this.logger = console;
        this.displayBanner();
    }

    public static async create(conf: SshConfig): Promise<SshRemoteForwardConnection> {
        const theClient: Client = await new Promise((resolve) => {
            const conn = new Client();
            conn.on("ready", () => resolve(conn))
                .on("tcp connection", (details, accept) => {
                    const stream = accept();
                    stream.pause();
                    const socket = net.connect(details.destPort, details.destIP, () => {
                        stream.pipe(socket);
                        socket.pipe(stream);
                        stream.resume();
                    });
                })
                .connect(conf);

        });
        return new SshRemoteForwardConnection(theClient, conf);
    } 

    public async forwardIn(remoteHost: string, remotePort: number): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.client.forwardIn(remoteHost, remotePort, (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }

    public async unforwardIn(remoteHost: string, remotePort: number): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.client.unforwardIn(remoteHost, remotePort, (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }


    private displayBanner() {

        this.logger.log(`                             
            _____               _          __                        
            | __  |___ _____ ___| |_ ___   |  |   ___ ___ ___ ___ ___ 
            |    -| -_|     | . |  _| -_|  |  |__| . | . | . | -_|  _|
            |__|__|___|_|_|_|___|_| |___|  |_____|___|_  |_  |___|_|  
                                                     |___|___|        
`,
        );

    this.logger.log(`open ssh remote forward connection on ${this.config.host}:${this.config.port}`);
}
}
