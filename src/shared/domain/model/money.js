import {ValidationError} from "./errors.js";
import {Currency} from "./currency.js";

/**
 * Represents a monetary value with an amount and a currency.
 */
export class Money {
    #amount
    #currency

    /**
     * Creates a new Money instance.
     * @param {Object} params - The parameters for the Money instance.
     * @param {number} params.amount - The monetary amount (non-negative).
     * @param {Currency} params.currency - The currency of the monetary amount.
     * @throws {ValidationError} If the amount is negative or not a finite number, or if the currency is not a Currency instance.
     */
    constructor({ amount, currency }) {
        if (!Number.isFinite(amount) || amount < 0)
            throw new ValidationError("Amount must be a non-negative finite number");
        if (!(currency instanceof Currency))
            throw new ValidationError("Currency must be an instance of Currency");
        this.#amount = Number(amount.toFixed(2)); // Round to 2 decimal places
        this.#currency = currency;
    }

    /**
     * Gets the amount of the monetary value.
     * @returns {number} The monetary amount.
     */
    get amount() {
        return this.#amount;
    }

    /**
     * Gets the currency of the monetary value.
     * @returns {Currency} The currency.
     */
    get currency() {
        return this.#currency;
    }

    /**
     * Adds another Money instance to this one, if they have the same currency.
     * @param {Money} other - The other Money instance to add.
     * @throws {ValidationError} If the currencies do not match.
     * @returns {Money} A new Money instance representing the sum.
     */
    add(other) {
        if (!(other instanceof Money) || !this.#currency.equals(other.currency))
            throw new ValidationError("Can only add Money with the same currency");
        return new Money({
            amount: this.#amount + other.amount,
            currency: this.#currency });
    }

    /**
     * Multiplies the monetary amount by a non-negative finite number.
     * @param {number} multiplier - The multiplier (non-negative finite number).
     * @throws {ValidationError} If the multiplier is negative or not a finite number.
     * @returns {Money} A new Money instance representing the product.
     */
    multiply(multiplier) {
        if (!Number.isFinite(multiplier) || multiplier < 0)
            throw new ValidationError("Multiplier must be a non-negative finite number");
        return new Money({
            amount: this.#amount * multiplier,
            currency: this.#currency });
    }

    /**
     * Returns a string representation of the Money instance.
     * @returns {string} A string in the format "amount currencyCode", e.g., "100.00 USD".
     */
    toString() {
        return `${this.#amount.toFixed(2)} ${this.#currency.code}`;
    }

    /**
     * Checks if this Money instance is equal to another.
     * @param {Money} other - The other Money instance to compare.
     * @returns {boolean} True if both amount and currency are equal, false otherwise.
     */
    equals(other) {
        return other instanceof Money &&
               this.#amount === other.amount &&
               this.#currency.equals(other.currency);
    }
}