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
  private data: LogEntry;
  private div: HTMLDivElement;

  constructor() {
    this.data = {};
    this.div = document.createElement("div");
  }

  public create(data: LogEntry, hidden: boolean): HTMLDivElement {
    this.data = data;
    this.div = document.createElement("div");

    this.setClasslist(hidden);
    this.appendMessageNode();
    this.appendTextNode();
    this.appendSqlNode();
    this.appendContextNode();
    this.appendStacktraceNode();
    this.appendMetaNode();

    return this.div;
  }

  private getLogLevel(): LogLevel {
    return this.data.level ?? "debug";
  }

  private setClasslist(hidden: boolean): void {
    const logLevel = this.getLogLevel();
    this.div.classList.add(
      "shadow-sm",
      "p-3",
      "mb-2",
      "rounded",
      "border-5",
      "border-start",
      "log-entry",
      `ll-${logLevel}`
    );

    if (hidden) {
      this.div.classList.add("d-none");
    }

    const classNames =
      logLevelCssMap.get(logLevel) ?? logLevelCssMap.get("debug");
    classNames?.split(" ").forEach((css) => this.div.classList.add(css));
  }

  private appendMessageNode(): void {
    const message = this.data.message ?? "no message sent";
    const msgNode = document.createElement("p");
    msgNode.appendChild(document.createTextNode(message));
    this.div.appendChild(msgNode);
  }

  private appendTextNode(): void {
    if (this.data.text) {
      const textNode = document.createElement("p");
      textNode.appendChild(document.createTextNode(this.data.text));
      this.div.appendChild(textNode);
    }
  }

  private appendSqlNode(): void {
    if (this.data.sql) {
      const sqlNode = document.createElement("code");
      const logLevel = this.getLogLevel();
      if (logLevel === "alert" || logLevel === "critical") {
        sqlNode.classList.add("text-white");
      }
      sqlNode.innerHTML = SqlPrettyPrint.format(this.data.sql);
      this.div.appendChild(sqlNode);
    }
  }

  private appendContextNode(): void {
    if (this.data.context && typeof this.data.context == "object") {
      const contextNode = document.createElement("p");
      contextNode.appendChild(document.createTextNode("Context:"));
      contextNode.appendChild(document.createElement("br"));
      const jsonNode = document.createElement("div");
      jsonNode.innerHTML = JSON.stringify(this.data.context, null, 4)
        .replaceAll("  ", "&nbsp;&nbsp;")
        .replaceAll("\n", "<br>")
      contextNode.appendChild(jsonNode)
      this.div.appendChild(contextNode)
    }
  }

  private appendStacktraceNode(): void {
    if (this.data.stacktrace) {
      const stackNode = document.createElement("p");
      stackNode.appendChild(document.createTextNode("Stacktrace:"));
      stackNode.appendChild(document.createElement("br"));
      this.div.appendChild(stackNode);

      const traceNode = document.createElement("div");
      traceNode.innerHTML = StacktracePrettyPrint.format(this.data.stacktrace);
      this.div.appendChild(traceNode);
    }
  }

  private appendMetaNode(): void {
    const metaNode = document.createElement("small");
    metaNode.classList.add("text-muted");

    let meta = "";
    if (this.data.file) {
      meta += `File: ${this.data.file}`;
    }
    if (this.data.method) {
      meta += ` Method: ${this.data.method}`;
    }
    if (this.data.line) {
      meta += ` at line: ${this.data.line}`;
    }

    const dateTime = new Date().toLocaleString();
    meta += ` ${dateTime}`;

    metaNode.appendChild(document.createTextNode(meta));
    this.div.appendChild(metaNode);
  }
}
