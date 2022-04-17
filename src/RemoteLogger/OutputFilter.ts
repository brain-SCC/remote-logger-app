import { LogEntry, LogLevel, LogLevelCheckbox } from './types';

export class OutputFilterListener {
    public constructor(private readonly logLevelCb: LogLevelCheckbox[]) {}
    
    public getVisibleLogLevel(): LogLevel[] {
        return this.getVisible().map((item: LogLevelCheckbox) => item[0])
    }

    public getHiddenLogLevel(): LogLevel[] {
        return this.getHidden().map((item: LogLevelCheckbox) => item[0])
    }

    private getVisible(): LogLevelCheckbox[] {
        return this.logLevelCb.filter((item: LogLevelCheckbox) => item[1].checked)
    }

    private getHidden(): LogLevelCheckbox[] {
        return this.logLevelCb.filter((item: LogLevelCheckbox) => !item[1].checked)
    }

    public isVisible(entry: LogEntry) : boolean { 
        const logLevel: LogLevel = entry.level ?? "debug";
        return this.getVisible().map((i:LogLevelCheckbox) => i[0]).includes(logLevel);
    }

    public bindOnLogLevelUpdate(fn: any) {
        this.logLevelCb.forEach((i: LogLevelCheckbox) => i[1].addEventListener("click", fn))
    }
}