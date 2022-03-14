import {describe, it} from "mocha";
import {expect} from "chai";
import {SshConfig} from "../src/SshConfig";

describe("SshConfig", () => {
    it("should can create SshConfig", () => {
        const conf = new SshConfig("test-host.net", 1337, "neo");
        expect(conf).not.to.be.null;

        expect(conf).to.be.an("object").and.to.have.property("host");
        expect(conf.host).to.be.eq("test-host.net");

        expect(conf).to.be.an("object").and.to.have.property("port");
        expect(conf.port).to.be.eq(1337);

        expect(conf).to.be.an("object").and.to.have.property("username");
        expect(conf.username).to.be.eq("neo");
    });
});