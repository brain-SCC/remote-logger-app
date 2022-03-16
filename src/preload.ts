// All of the Node.js APIs are available in the preload process.

//import { contextBridge, ipcRenderer } from "electron";
import { App } from "./RemoteLogger/App";
import { AppConfig } from "./RemoteLogger/config/AppConfig";

/*
contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})
*/

// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  const output = document.getElementById("remote-logger-output");

  const appConfig = new AppConfig();
  const app = new App(output, appConfig, console);
  app.run();

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(
      `${type}-version`,
      process.versions[type as keyof NodeJS.ProcessVersions]
    );
  }
});
