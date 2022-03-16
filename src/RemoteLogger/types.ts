export type LogLevel =
  | "emergency"
  | "alert"
  | "critical"
  | "error"
  | "warning"
  | "notice"
  | "info"
  | "debug"
  | "success";

export type LogEntry = {
  level?: LogLevel;
  message?: string;
  text?: string;
  stacktrace?: string;
  sql?: string;
  file?: string;
  method?: string;
  line?: number;
  context?: any;
};
