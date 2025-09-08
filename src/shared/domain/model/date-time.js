import {ValidationError} from "./errors.js";

/**
 * Class representing a date and time with validation.
 */
export class DateTime {
    #date

    /**
     * Creates a new DateTime instance.
     * @param {Date|string} [date=new Date()] - A Date object or a date string. Defaults to the current date and time.
     * @throws {ValidationError} If the provided date is invalid.
     */
    constructor(date = new Date()) {
        const parsedDate = date instanceof Date ? date : new Date(date)
        if (isNaN(parsedDate.getTime()))
            throw new ValidationError(`Invalid date: ${date}`);
        this.#date = parsedDate
    }

    /**
     * Gets the underlying Date object.
     * @returns {Date} The Date object.
     */
    get date() {
        return this.#date;
    }

    /**
     * Returns the ISO string representation of the date.
     * @returns {string} The ISO string representation of the date.
     */
    toISOString() {
        return this.#date.toISOString();
    }

    /**
     * Returns a human-readable string representation of the date.
     * @returns {string} A human-readable string representation of the date.
     */
    toString() {
        let options = { year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true };
    }

    /**
     * Compares this DateTime instance with another for equality.
     * @param {DateTime} other - Another DateTime instance to compare with.
     * @returns {boolean} True if both instances represent the same date and time, false otherwise.
     */
    equals(other) {
        return other instanceof DateTime && this.#date.getTime() === other.date.getTime();
    }
}