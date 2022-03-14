export type LogLevel = "emergency" | "alert" | "critical" | "error" | "warning" | "notice" | "info" | "debug" | "success";

export type LogEntry = {
    level?: LogLevel | undefined,
    message?: string | undefined,
    text?: string | undefined,
    stacktrace?: string | undefined,
    sql?: string | undefined,
    file?: string,
    method?: string,
    line?: number, 
    context?: any
}
