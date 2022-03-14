// All of the Node.js APIs are available in the preload process.

import { Webserver } from "./Webserver";
import { AppConfig } from "./AppConfig";
import { SshRemoteForwardConnection } from "./SshRemoteForwardConnection";
import { contextBridge, ipcRenderer } from "electron";
import { ItemRenderer } from "./ItemRenderer";


contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})

const maxLogEnties = 200;

// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  const output = document.getElementById("remote-logger-output");
  const itemRenderer: ItemRenderer = new ItemRenderer();

  const fnPostHandler = (data:any) => {
    console.log(data);

    const item = document.createElement('div');
    item.innerHTML = itemRenderer.toHtml(data);
    output.prepend(item);

    while (output.childNodes.length > maxLogEnties) {
      output.removeChild(output.lastChild);
    }
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type as keyof NodeJS.ProcessVersions]);
  }

  /* starts local webserver on 127.0.0.1:290980 */
  const appConf = new AppConfig();
  const webServer:Webserver = new Webserver(appConf);
  webServer.registerRoutes(fnPostHandler);
  webServer.start();

  /* opens ssh remote forward connection to remote host */
  const openSshRemoteForwardConnection = async () => {
      const con: SshRemoteForwardConnection = await SshRemoteForwardConnection.create(appConf.sshConf);
      /* forward to local 127.0.0.1:290980 */
      con.forwardIn(appConf.localConf.host, appConf.localConf.port);
  };
  openSshRemoteForwardConnection();
});
