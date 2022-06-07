import { Renderer } from './RemoteLogger/Renderer';
import { OutputFilterListener } from './RemoteLogger/OutputFilter';

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

    const listener = new OutputFilterListener([
      ["debug", document.querySelector('#filterdebug') as HTMLInputElement],
      ["notice", document.querySelector('#filternotice') as HTMLInputElement],
      ["info", document.querySelector('#filterinfo') as HTMLInputElement],
      ["success", document.querySelector('#filtersuccess') as HTMLInputElement],
      ["warning", document.querySelector('#filterwarning') as HTMLInputElement],
      ["error", document.querySelector('#filtererror') as HTMLInputElement],
      ["emergency", document.querySelector('#filteremergency') as HTMLInputElement],
      ["alert", document.querySelector('#filteralert') as HTMLInputElement],    
      ["critical", document.querySelector('#filtercritical') as HTMLInputElement],
    ]);

    const infoBtn = document.querySelector('#show-ssh-info');

    const fnOnSshConnectionChange = (status: string) => {
      if(infoBtn instanceof HTMLElement) {
          infoBtn.classList.remove("text-white", "text-danger", "text-warning", "text-success", "text-secondary");
          switch(status) {
            case "ready":
              infoBtn.classList.add("text-success");
              infoBtn.title = "connected with: " + appConfig.sshConf.host;
              break;
            case "continue":
              infoBtn.classList.add("text-warning");
              infoBtn.title = "continue connection with: " + appConfig.sshConf.host;
              break;
            case "close":
              infoBtn.classList.add("text-secondary");
              infoBtn.title = "connection closed";
              break;
            case "error":
              infoBtn.classList.add("text-danger");
              infoBtn.title = "error no connection to: " + appConfig.sshConf.host;    
              break;
            default:
              infoBtn.classList.add("text-white");
              infoBtn.title = "";    
          }
      }
    };

    const renderer = new Renderer(output, listener, appConfig.maxLogEntries, logger)
    const app = new App(appConfig, renderer, logger, fnOnSshConnectionChange);
    app.run();

    const clearBtn = document.querySelector('#clear-output');
    if(clearBtn) {
      clearBtn.addEventListener('click', () => {
        renderer.cleanAll()
      })
    }

    if(infoBtn) {
      infoBtn.addEventListener('click', () => {
        if(confirm("really reconnect?")) {
          app.reconnect()
        }
      })
    }
      
    window.addEventListener('online', () => {
      logger.debug("trigger event listener ONLINE")
      app.reconnect()
    });
    window.addEventListener('offline', () => {
      logger.debug("trigger event listener OFFLINE")
      fnOnSshConnectionChange('close')
    });
  }
});
