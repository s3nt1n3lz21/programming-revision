import { Injectable } from '@angular/core';

export enum LogLevel {
	DEBUG,
	INFO,
	WARN,
	ERROR
}

@Injectable({
	providedIn: 'root'
})
export class LoggerService {
	private logLevel: LogLevel = LogLevel.DEBUG;

	log(level: LogLevel, context: string, message: any, ...optionalParams: any[]): void {
		if (level >= this.logLevel) {
			switch (level) {
				case LogLevel.DEBUG:
					console.log(`[${context}]`, message, ...optionalParams);
					break;
				case LogLevel.INFO:
					console.info(`[${context}]`, message, ...optionalParams);
					break;
				case LogLevel.WARN:
					console.warn(`[${context}]`, message, ...optionalParams);
					break;
				case LogLevel.ERROR:
					console.error(`[${context}]`, message, ...optionalParams);
					break;
			}
			this.sendLogsToServer(level, context, message, optionalParams);
		}
	}

	private sendLogsToServer(level: LogLevel, context: string, message: any, optionalParams: any[]): void {
		// Implement sending logs to the server logic here (e.g., via HTTP POST request)
	}
}
