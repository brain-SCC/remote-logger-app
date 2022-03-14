import Fastify from 'fastify'
import { AppConfig } from './AppConfig';

export class Webserver {
    fastify;
    logger;
    constructor(private readonly config:AppConfig) {
        this.fastify = Fastify({
            logger: true
        });
        this.logger = console;
    }

    public registerRoutes(postCallback:any): void {

        // Declare a route
        this.fastify.get('/', (request, reply) => {
            reply.send({ hello: 'world' })
        });

        this.fastify.post('/', (request, reply) => {
            reply.send('OK');
            this.logger.log(request.body);
            postCallback(request.body);
        });
    }

    private displayBanner() {
        this.logger.log(`Webserver running on ${this.config.localConf.host}:${this.config.localConf.port}`);
    }


    async start() {
        this.displayBanner();
        try {

            // Run the server!
            await this.fastify.listen(this.config.localConf.port, (err, address) => {
                if (err) throw err
                // Server is now listening on ${address}

                console.log(`${address}`)
            });
        } catch (err) {
            this.fastify.log.error(err);
            this.exit(1);
        }
    }

    public exit(errCode = 0) {
        process.exit(errCode);
    }

}