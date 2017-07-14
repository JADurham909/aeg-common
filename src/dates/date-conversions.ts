import moment from 'moment-timezone';

// start of week is Monday
moment.updateLocale('en', {
	week: {
		dow: 1,
		doy: 4
	}
});

export const dateFormatString: string = 'YYYY-MM-DD HH:mm:ss';

export default {
	dateFormatString,
	convertUTCStringToESTString,
	convertESTStringToUTCString,
	momentToString,
	stringToMoment,
	utcStringToMoment,
	unixTimestampToUTCString,
	utcStringToUnixTimestamp,
	resolveUTCIntervals
};

/**
 * Convert UTC Date string to EST string
 * @param {string} utc
 * @return {string}
 */
export function convertUTCStringToESTString (utc: string): string {

	return moment.tz(utc, dateFormatString, 'UTC').tz('America/New_York').format(dateFormatString);

}

/**
 * Convert EST date string to UTC string
 * @param {string} est
 * @param {string} [format]
 * @return {string}
 */
export function convertESTStringToUTCString (est: string, format: string): string {

	const f = format || dateFormatString;
	return moment.tz(est, f, 'America/New_York').tz('UTC').format(dateFormatString);

}

/**
 * Moment to string
 * @param {Moment} moment
 * @return {string}
 */
export function momentToString (thisMoment: moment): string {

	return thisMoment.format(dateFormatString);

}

/**
 * String to moment
 * @param {string} str
 * @return {Moment}
 */
export function stringToMoment (str: string): moment {

	return moment(str, dateFormatString);

}

/**
 * UTC date string to moment
 * @param {string} utc
 * @return {Moment}
 */
export function utcStringToMoment (utc: string): moment {

	return moment.tz(utc, dateFormatString, 'UTC');

}

/**
 * Unix timestamp to UTC date string
 * @param {number} timestamp
 * @return {string}
 */
export function unixTimestampToUTCString (timestamp: number): string {

	return moment.tz(timestamp, 'X', 'UTC').format(dateFormatString);

}

/**
 * UTC date string to unix timestamp
 * @param {string} utc
 * @return {number}
 */
export function utcStringToUnixTimestamp (utc: string): number {

	return utcStringToMoment(utc).unix();

}

/**
 * Resolves the requested interval to UTC start and end dates
 * @param {string} interval - hourly, daily, yesterday, weekly, last-week, monthly, yearly
 * @param {string} timezone
 * @param {Object} [options] - moment: the date time to resolve, otherwise now
 * @returns {{startDate: *, endDate: *}}
 */
export function resolveUTCIntervals (interval: string, timezone: string, options?: { moment: moment })
	: { startDate: moment, startDateString: string, endDate: moment, endDateString: string } {

	let startDateClient, endDateClient, m;

	if (options && options.moment) {

		m = options.moment.clone().tz(timezone);

	} else {

		m = moment.tz(timezone);

	}

	switch (interval) {
		case 'minutely':
			startDateClient = m.clone().startOf('minute');
			endDateClient = m.clone().endOf('minute');
			break;
		case 'hourly':
			startDateClient = m.clone().startOf('hour');
			endDateClient = m.clone().endOf('hour');
			break;
		case 'last-hour':
			startDateClient = m.clone().subtract(1, 'hours').startOf('hour');
			endDateClient = m.clone().subtract(1, 'hours').endOf('hour');
			break;
		case 'daily':
			startDateClient = m.clone().startOf('day');
			endDateClient = m.clone().endOf('day');
			break;
		case 'yesterday':
			startDateClient = m.clone().subtract(1, 'days').startOf('day');
			endDateClient = m.clone().subtract(1, 'days').endOf('day');
			break;
		case 'weekly':
			startDateClient = m.clone().startOf('week');
			endDateClient = m.clone().endOf('week');
			break;
		case 'last-week':
			startDateClient = m.clone().subtract(7, 'days').startOf('week');
			endDateClient = m.clone().subtract(7, 'days').endOf('week');
			break;
		case 'monthly':
			startDateClient = m.clone().startOf('month');
			endDateClient = m.clone().endOf('month');
			break;
		case 'yearly':
			startDateClient = m.clone().startOf('year');
			endDateClient = m.clone().endOf('year');
			break;
		default:
			throw new Error(`Interval not valid ${interval}`);
	}

	return {
		startDate: startDateClient.tz('UTC'),
		startDateString: startDateClient.tz('UTC').format(dateFormatString),
		endDate: endDateClient.tz('UTC'),
		endDateString: endDateClient.tz('UTC').format(dateFormatString)
	};

}
