import {describe, it} from "mocha";
import {expect} from "chai";
import {SshConfig, PrivateKeyLocator} from "../src/RemoteLogger/config/SshConfig";

const RES_DIR = __dirname  + "/ressources/";

describe("PrivateKeyLocator", () => {
    it("should find id_ed25519 keyfile in path", () => {
        const foundFile = PrivateKeyLocator.locateIn(RES_DIR)
        expect(foundFile).not.to.be.undefined
    })

    it("should find id_rsa keyfile in path", () => {
        const foundFile = PrivateKeyLocator.locateIn(RES_DIR)
        expect(foundFile).not.to.be.undefined
    });
});

describe("SshConfig", () => {
    it("should can create SshConfig", () => {
        const conf = new SshConfig("test-host.net", 1337, "neo")
        expect(conf).not.to.be.null

        expect(conf).to.be.an("object").and.to.have.property("host")
        expect(conf.host).to.be.eq("test-host.net")

        expect(conf).to.be.an("object").and.to.have.property("port")
        expect(conf.port).to.be.eq(1337)

        expect(conf).to.be.an("object").and.to.have.property("username")
        expect(conf.username).to.be.eq("neo")
    })

    it("should can read private-key without passphrase", () => {
        const conf = new SshConfig("test-host.net", 1337, "neo");
        expect(conf).not.to.be.null

        conf.readPrivateKey(RES_DIR + "id_ed25519")
        expect(conf).to.be.an("object").and.to.have.property("privateKey")
        expect(conf.privateKey).not.to.be.undefined

        expect(conf).to.be.an("object").and.to.have.property("passphrase")
        expect(conf.passphrase).to.be.undefined
    })

    it("should can read private-key with passphrase", () => {
        const conf = new SshConfig("test-host.net", 1337, "neo");
        expect(conf).not.to.be.null

        conf.readPrivateKey( RES_DIR + "id_rsa", "S3cRet!")
        expect(conf).to.be.an("object").and.to.have.property("privateKey")
        expect(conf.privateKey).not.to.be.undefined

        expect(conf).to.be.an("object").and.to.have.property("passphrase")
        expect(conf.passphrase).to.be.eq("S3cRet!")
    })

    it("should not read non existing private-key", () => {
        const conf = new SshConfig("test-host.net", 1337, "neo");
        expect(conf).not.to.be.null

        conf.readPrivateKey(RES_DIR + "not-existing")
        expect(conf).to.be.an("object").and.to.have.property("privateKey")
        expect(conf.privateKey).to.be.undefined
    })
});