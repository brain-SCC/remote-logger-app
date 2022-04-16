
// All of the Node.js APIs are available in the preload process.
import { App } from "./RemoteLogger/App";
import { ConsoleLoggerImpl } from './RemoteLogger/ConsoleLogger';
import { AppConfig } from "./RemoteLogger/config/AppConfig";

// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("remote-logger-output");
  if(output) 
  {
    const appConfig = new AppConfig();
    const logger = new ConsoleLoggerImpl(appConfig.isDebugEnabled? console : undefined);
    const app = new App(output, appConfig, logger);
    app.run();

    const clearBtn = document.querySelector('#clear-output');
    if(clearBtn) {
      clearBtn.addEventListener('click', () => {
        output.querySelectorAll('*').forEach(n => n.remove());
      })
    } 
  }

  /*
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
  }*/
});
