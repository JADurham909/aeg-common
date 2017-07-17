import { ILogger } from '@adexchange/aeg-logger';
import * as EventEmitter from 'events';
import * as _ from 'lodash';

export interface ILoggerOptions {
	message?: string;
	data?: any;
	err?: Error;
}

/**
 * Base class for common operations
 */
export default class Base extends EventEmitter {

	private _logger: ILogger;

	/**
	 * Constructor
	 * @param {object} options
	 */
	constructor (options: {logger?: ILogger} = {}) {

		super();

		if (options.logger) {

			this._logger = options.logger;

		}

	}

	/**
	 * Returns an options object from an argument array
	 * Use this for options in a node-back style function
	 *
	 * function(someArg, options, callback)
	 *      let args = Array.prototype.slice.call(arguments);
	 *      someArg = args.shift();
	 *      callback = args.pop();
	 *      options = this._parseOptions(args);
	 *
	 * @param {object[]} args
	 * @returns {*|{}}
	 * @private
	 */
	public parseOptions (args: object[]): object {

		return (args.length > 0 ? args.shift() : {}) || {};

	}

	/**
	 * Emit an event
	 * @param {string} event
	 * @param {string} caller
	 * @param {ILoggerConfig} options
	 */
	public emit (event: string, caller: string, options: ILoggerOptions = {}): boolean {

		const body: any = {};

		body.message = `${_.camelCase(this.constructor.name)}#${caller}`;

		if (options.message) {

			body.message += `: ${options.message}`;

		}

		if (options.data) {

			body.data = options.data;

		}

		if (options.err) {

			body.err = options.err;

		}

		return super.emit(event, body);

	}

	/**
	 * Log debug
	 * @param {string} caller
	 * @param {ILoggerConfig} options
	 */
	public debug (caller: string, options: ILoggerOptions = {}): void {

		if (this._logger) {

			this._log(this._logger.debug, caller, options);

		}

	}

	/**
	 * Log info
	 * @param {string} caller
	 * @param {ILoggerConfig} options
	 */
	public info (caller: string, options: ILoggerOptions = {}): void {

		if (this._logger) {

			this._log(this._logger.info, caller, options);

		}

	}

	/**
	 * Log warn
	 * @param {string} caller
	 * @param {ILoggerConfig} options
	 */
	public warn (caller: string, options: ILoggerOptions = {}): void {

		if (this._logger) {

			this._log(this._logger.warn, caller, options);

		}

	}

	/**
	 * Log error
	 * @param {string} caller
	 * @param {ILoggerConfig} options
	 */
	public error (caller: string, options: ILoggerOptions = {}): void {

		if (this._logger) {

			this._log(this._logger.error, caller, options);

		}

	}

	/**
	 * Internal log handler
	 * @param {function} delegate
	 * @param {string} caller
	 * @param {ILoggerConfig} options
	 * @private
	 */
	private _log (delegate: (message: string, data?: object) => void, caller: string, options: ILoggerOptions = {}): void {

		if (!this._logger) {

			return;

		}

		let logMessage = `${_.camelCase(this.constructor.name)}#${caller}`;

		if (options.message) {

			logMessage += `: ${options.message}`;

		}

		if (options.data) {

			if (options.err) {

				this._logger.error(logMessage, options.data, options.err);

			} else {

				delegate(logMessage, options.data);

			}

		} else {

			if (!options.data && options.err) {

				this._logger.error(logMessage, options.err);

			} else {

				delegate(logMessage);

			}

		}

	}

}
