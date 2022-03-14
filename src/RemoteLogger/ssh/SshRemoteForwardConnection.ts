import net from "net";
import { Client } from "ssh2";
import { SshConfig } from "../config/SshConfig";

export class SshRemoteForwardConnection {
    constructor(private readonly client: Client) {}

    public static async create(conf: SshConfig): Promise<SshRemoteForwardConnection> {
        const theClient: Client = await new Promise((resolve) => {
            const conn = new Client()
            conn.on("ready", () => resolve(conn))
                .on("tcp connection", (details, accept) => {
                    const stream = accept()
                    stream.pause()
                    const socket = net.connect(details.destPort, details.destIP, () => {
                        stream.pipe(socket)
                        socket.pipe(stream)
                        stream.resume()
                    })
                })
                .connect(conf)
        })
        return new SshRemoteForwardConnection(theClient)
    } 

    public async forwardIn(remoteHost: string, remotePort: number): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.client.forwardIn(remoteHost, remotePort, (error) => {
                if (error) {
                    reject(error)
                    return
                }
                resolve()
            })
        })
    }

    public async unforwardIn(remoteHost: string, remotePort: number): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.client.unforwardIn(remoteHost, remotePort, (error) => {
                if (error) {
                    reject(error)
                    return
                }
                resolve()
            })
        })
    }
}
