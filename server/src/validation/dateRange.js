export function validateDateRange(since, until) {
    // required?
    if (!since || !until) {
        throw new ValidationError("Both since and until are required.");
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    // correct syntax?
    if (!datePattern.test(since) || !datePattern.test(until)) {
        throw new ValidationError("Dates must use YYYY-MM-DD format.");
    }

    const sinceDate = new Date(`${since}T00:00:00Z`);
    const untilDate = new Date(`${until}T00:00:00Z`);

    // can these become valid Date objects?
    if (
        Number.isNaN(sinceDate.getTime()) ||
        Number.isNaN(untilDate.getTime())
    ) {
        throw new ValidationError("Dates must be valid calendar dates.");
    }

    // did parsing preserve the exact calendar date?
    if (
        sinceDate.toISOString().slice(0, 10) !== since ||
        untilDate.toISOString().slice(0, 10) !== until
    ) {
        throw new ValidationError("Dates must be valid calendar dates.");
    }

    // correct chronological order?
    if (sinceDate > untilDate) {
        throw new ValidationError("since cannot be later than until.");
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const rangeInDays = (untilDate - sinceDate) / millisecondsPerDay;

    // allowed range?
    if (rangeInDays > 90) {
        throw new ValidationError("Date range cannot exceed 90 days.");
    }

    return {
        since,
        until
    };
}