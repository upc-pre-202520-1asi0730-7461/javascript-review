import {ValidationError} from "./errors.js";
import {generateUUID, isValidUUID} from "./uuid.js";

/**
 * ProductId Value Object
 * Represents a unique identifier for a product.
 */
export class ProductId {
    #value;

    /**
     * Creates a new ProductId instance.
     * @param {string} value - The UUID string representing the product ID.
     */
    constructor(value) {
        if (!isValidUUID(value))
            throw new ValidationError(`Invalid ProductId: ${value}`);
        this.#value = value;
    }

    /**
     * Generates a new ProductId with a unique UUID.
     * @returns {ProductId} A new ProductId instance.
     */
    static generate() {
        return new ProductId(generateUUID());
    }

    /**
     * Gets the value of the ProductId.
     * @returns {string} The UUID string of the product ID.
     */
    get value() {
        return this.#value;
    }

    /**
     * Checks if this ProductId is equal to another ProductId.
     * @param {ProductId} other - The other ProductId to compare with.
     * @returns {boolean} True if both ProductIds are equal, false otherwise.
     */
    equals(other) {
        return (other instanceof ProductId && other.value === this.#value);
    }
}