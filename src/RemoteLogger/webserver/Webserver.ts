import Fastify from "fastify";
import { AppConfig } from "../config/AppConfig";

export class Webserver {
  private fastify;

  constructor(private readonly config: AppConfig) {
    this.fastify = Fastify({
      logger: false,
    });
  }

  public registerRoutes(postCallback: any): void {
    this.fastify.get("/", (request, reply) => {
      reply.send("OK");
    });
    this.fastify.post("/", (request, reply) => {
      reply.send("OK");
      postCallback(request.body);
    });
  }

  async start() {
    try {
      this.fastify.listen(this.config.localConf.port, (err) => {
        if (err) throw err;
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
