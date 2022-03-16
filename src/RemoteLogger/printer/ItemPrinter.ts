import { SqlPrettyPrint } from "./SqlPrettyPrint";
import { StacktracePrettyPrint } from "./StacktracePrettyPrint";
import { LogLevel, LogEntry } from "../types";

const logLevelCssClassNames: Record<LogLevel, string> = {
  debug: "border-light",
  notice: "border-primary",
  info: "border-info",
  success: "border-success",
  warning: "border-warning",
  error: "border-danger",
  emergency: "border-danger",
  alert: "border-danger",
  critical: "border-danger",
};
const logLevelCssMap = new Map<string, string>(
  Object.entries(logLevelCssClassNames)
);

export class ItemPrinter {
  public toHtml(data: LogEntry) {
    const logLevel = data.level ?? "debug";
    const message = data.message ?? "no message sent";

    const classNames =
      logLevelCssMap.get(logLevel) ?? logLevelCssMap.get("debug");
    const dateTime = new Date().toLocaleString();

    let text = "";
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
      sql = `<p>SQL:<br>${SqlPrettyPrint.format(data.sql)}</p>`;
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

    return `
        <div class="shadow-sm p-3 mb-2 rounded border-5 border-start text-dark ${classNames}">
            <p class="text-dark">${message}</p>
            ${text} ${sql} ${stacktrace}
            <small class="text-muted">${meta}</small>
        </div>
        `;
  }
}
