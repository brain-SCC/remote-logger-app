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
    const MAX_LOG_ENTIES = 100;
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

    const renderer = new Renderer(output, listener, MAX_LOG_ENTIES, logger)
    const app = new App(appConfig, renderer, logger);
    app.run();

    const clearBtn = document.querySelector('#clear-output');
    if(clearBtn) {
      clearBtn.addEventListener('click', () => {
        renderer.cleanAll()
      })
    } 
  }
});
