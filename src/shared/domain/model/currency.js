import {ValidationError} from "./errors.js";

/**
 * Represents a currency with a specific code (e.g., USD, EUR).
 * Validates the currency code upon instantiation.
 * Provides methods to access the code and compare two Currency instances.
 */
export class Currency {
    static #VALID_CODES = ['USD', 'EUR', 'GBP', 'JPY'];
    #code;

    /**
     * Creates a new Currency instance.
     * @param {string} code - The currency code (e.g., 'USD', 'EUR').
     * @throws {ValidationError} If the provided code is not valid.
     */
    constructor(code) {
        if (!Currency.#VALID_CODES.includes(code))
            throw new ValidationError(`Invalid code: ${code}. Valid codes are: ${Currency.#VALID_CODES.join(', ')}`);
        this.#code = code;
    }

    /**
     * Gets the currency code.
     * @returns {string} The currency code.
     */
    get code() {
        return this.#code;
    }

    /**
     * Compares this {@link Currency} instance with another for equality.
     * @param {Currency} other - Another {@link Currency} instance to compare with.
     * @returns {boolean} True if both instances have the same currency code, false otherwise.
     */
    equals(other) {
        return other instanceof Currency && this.#code === other.#code;
    }
}