import { ConsoleLogger } from './ConsoleLogger';
import { LogEntry, LogLevel } from './types';
import { ItemPrinter } from "./printer/ItemPrinter";
import { OutputFilterListener } from './OutputFilter';

export class Renderer {
    private itemPrinter: ItemPrinter;
    public constructor(  
        private readonly output: HTMLElement, 
        private readonly listener: OutputFilterListener, 
        private readonly max_log_entries:number, 
        private readonly logger: ConsoleLogger) {
        this.itemPrinter = new ItemPrinter()
        this.bind();
    }

    async renderItem(data: LogEntry) {
        const visible = this.listener.isVisible(data)
        const item = this.itemPrinter.create(data, !visible)
        this.output.prepend(item)
    }

    async cleanAll() {
        this.logger.debug("clear all logs")
        this.output.querySelectorAll('*').forEach(n => n.remove())
    }

    async cleanOverflow() {
        //this.output.querySelectorAll('* &gt; '+ this.max_log_entries).forEach(n => n.remove());
        while (this.output.childNodes.length > this.max_log_entries && this.output.lastChild) {
            this.output.removeChild(this.output.lastChild)
        }
    }

    private async update(e?: HTMLInputElement) {

        const logLevelHidden = this.listener.getHiddenLogLevel();
        if(logLevelHidden.length > 0) {
            const selectorHidden = logLevelHidden.map((ll: LogLevel) => `.log-entry.ll-${ll}` ).join(', ')
            this.output.querySelectorAll(selectorHidden).forEach(n => n.classList.add("d-none"))
            this.logger.debug(selectorHidden)
        }

        const logLevelVisible = this.listener.getVisibleLogLevel();
        if(logLevelVisible.length > 0) {
            const selectorVisible = logLevelVisible.map((ll: LogLevel) => `.log-entry.ll-${ll}` ).join(', ')
            this.output.querySelectorAll(selectorVisible).forEach(n => n.classList.remove("d-none"))
            this.logger.debug(selectorVisible)
        }
    }

    private bind() {
        this.listener.bindOnLogLevelUpdate((e: HTMLInputElement) => {
            this.update(e)
        });
    }
}