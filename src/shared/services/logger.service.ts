import { NGXLogger, NgxLoggerLevel } from 'ngx-logger';

import { Injectable } from '@angular/core';

export const LOGGER_LEVELS = {
  TRACE: NgxLoggerLevel.TRACE,
  DEBUG: NgxLoggerLevel.DEBUG,
  INFO: NgxLoggerLevel.INFO,
  LOG: NgxLoggerLevel.LOG,
  WARN: NgxLoggerLevel.WARN,
  ERROR: NgxLoggerLevel.ERROR,
  FATAL: NgxLoggerLevel.FATAL,
  OFF: NgxLoggerLevel.OFF,
};
// to change the log level at run time update session storage
// sessionStorage.setItem('__env', JSON.stringify({"LOG_LEVEL":"DEBUG"}))
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor(private logger: NGXLogger) {
    const localStorageEnv = JSON.parse(sessionStorage.getItem('__env'));
    const level = localStorageEnv && localStorageEnv.LOG_LEVEL ? LOGGER_LEVELS[localStorageEnv.LOG_LEVEL] : NgxLoggerLevel.WARN;
    this.logger.updateConfig({ level: level });
    console.info(`LOG LEVEL set to ${level}`);
  }

  trace(msg) {
    // 0
    this.logger.trace(msg);
  }
  debug(msg) {
    // 1
    this.logger.debug(msg);
  }
  info(msg) {
    // 2
    this.logger.info(msg);
  }
  log(msg) {
    // 3
    this.logger.log(msg);
  }
  warn(msg) {
    // 4
    this.logger.warn(msg);
  }
  error(msg) {
    // 5
    // ALWAYS log errors
    //this.logger.error(msg);
    console.error(msg);
  }
  fatal(msg) {
    // 6
    // ALWAYS log errors
    //this.logger.fatal(msg);
    console.error(msg);
  }
  // 7 = OFF
}
