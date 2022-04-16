
export interface ConsoleLogger {
    debug(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    dir(obj: any): void;
}

export class ConsoleLoggerImpl implements ConsoleLogger {

    private console?: Console

    public constructor(console?: Console) {
        this.console = console;
    }

    debug(message?: any, ...optionalParams: any[]): void {
        this.console?.debug(message, ...optionalParams);
    }

    info(message?: any, ...optionalParams: any[]): void {
        this.console?.info(message, ...optionalParams);
    }

    error(message?: any, ...optionalParams: any[]): void {
        this.console?.error(message, ...optionalParams);
    }

    log(message?: any, ...optionalParams: any[]): void {
        this.console?.log(message, ...optionalParams);
    }

    dir(obj: any): void {
        this.console?.dir(obj);
    }
}