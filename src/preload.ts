// All of the Node.js APIs are available in the preload process.
import { App } from "./RemoteLogger/App";
import { AppConfig } from "./RemoteLogger/config/AppConfig";

// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("remote-logger-output");
  const appConfig = new AppConfig();
  const app = new App(output, appConfig, console);
  app.run();

  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(
      `${type}-version`,
      process.versions[type as keyof NodeJS.ProcessVersions]
    );
  }
});
