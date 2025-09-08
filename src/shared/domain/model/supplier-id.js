import {generateUUID, isValidUUID} from "./uuid.js";
import {ValidationError} from "./errors.js";

/**
 * SupplierId Value Object
 * Represents a unique identifier for a supplier.
 */
export class SupplierId {
    #value

    /**
     * Creates a new SupplierId instance.
     * @param {string} value - The UUID string representing the supplier ID.
     */
    constructor(value) {
        if(!isValidUUID(value))
            throw ValidationError(`Invalid Supplier ID: Value ${value} is not a valid UUID.`);
        this.#value = value;
    }

    /**
     * Generates a new SupplierId with a unique UUID.
     * @returns {SupplierId} A new SupplierId instance with a generated UUID.
     */
    static generate() {
        return new SupplierId(generateUUID());
    }

    /**
     * Gets the string representation of the SupplierId.
     * @returns {string} The UUID string of the SupplierId.
     */
    get value() {
        return this.#value;
    }

    /**
     * Checks equality between this SupplierId and another.
     * @param {SupplierId} other - The other SupplierId to compare with.
     * @returns {boolean} True if both SupplierIds are equal, false otherwise.
     */
    equals(other) {
        return other instanceof SupplierId && this.#value === other.#value;
    }
}