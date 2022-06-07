import { SqlPrettyPrint } from "./SqlPrettyPrint";
import { StacktracePrettyPrint } from "./StacktracePrettyPrint";
import { LogLevel, LogEntry } from "../types";

const logLevelCssClassNames: Record<LogLevel, string> = {
  debug: "border-secondary text-dark",
  notice: "border-primary text-dark",
  info: "border-info text-dark",
  success: "border-success text-dark",
  warning: "border-warning text-dark",
  error: "border-danger text-dark",
  emergency: "border-danger bg-gradient-warning text-dark",
  alert: "border-danger bg-gradient-danger text-white",
  critical: "border-danger bg-gradient-dark text-white",
};
const logLevelCssMap = new Map<string, string>(
  Object.entries(logLevelCssClassNames)
);

export class ItemPrinter {
  public create(data: LogEntry, hidden: boolean): HTMLDivElement {
    const div: HTMLDivElement = document.createElement("div");
    const logLevel = data.level ?? "debug";
    const message = data.message ?? "no message sent";
    const dateTime = new Date().toLocaleString();

    let text = "";
    let context = "";
    let stacktrace = "";
    let sql = "";

    if (data.text) {
      text = `<p>${data.text}</p>`;
    }

    if (data.stacktrace) {
      stacktrace = `<p>Stacktrace:<br>${StacktracePrettyPrint.format(
        data.stacktrace
      )}</p>`;
    }

    if (data.sql) {
      if(logLevel === "alert" || logLevel === "critical") {
        sql = `<code class="text-white">${SqlPrettyPrint.format(data.sql)}</code>`;
      }
      else {
        sql = `<code>${SqlPrettyPrint.format(data.sql)}</code>`;
      }
    }

    if (data.context) {
      context = `<p>Stacktrace:<br>${StacktracePrettyPrint.format(
        data.context
      )}</p>`;
    }

    let meta = "";

    if (data.file) {
      meta += `File: ${data.file}`;
    }
    if (data.method) {
      meta += ` Method: ${data.method}`;
    }
    if (data.line) {
      meta += ` at line: ${data.line}`;
    }

    meta += ` ${dateTime}`;

    div.classList.add(
      "shadow-sm", 
      "p-3", 
      "mb-2", 
      "rounded", 
      "border-5", 
      "border-start", 
      "log-entry",
      `ll-${logLevel}`
    )

    if(hidden) {
      div.classList.add("d-none")
    }

    const classNames = logLevelCssMap.get(logLevel) ?? logLevelCssMap.get("debug");
    classNames?.split(" ").forEach(css => div.classList.add(css));

    div.innerHTML = `
        <p>${message}</p>
        ${text} ${sql} ${context} ${stacktrace}
        <small class="text-muted">${meta}</small>
    `;

    return div;
  }
}
