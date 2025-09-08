import {SupplierId} from "../../../shared/domain/model/supplier-id.js";
import {ValidationError} from "../../../shared/domain/model/errors.js";
import {Money} from "../../../shared/domain/model/money.js";

/**
 * Represents a supplier in the supply chain management system.
 * @class
 * @property {SupplierId} id - Unique identifier for the supplier.
 * @property {string} name - Name of the supplier (2-100 characters).
 * @property {string|null} contactEmail - Contact email of the supplier (valid email format or null).
 * @property {Money|null} lastOrderTotalPrice - Total price of the last order from this supplier (Money instance or null).
 * @throws {ValidationError} If any property fails validation.
 */
export class Supplier {
    #id
    #name
    #contactEmail
    #lastOrderTotalPrice

    /**
     * Creates a new Supplier instance.
     * @param {Object} params - Parameters for creating a Supplier.
     * @param {SupplierId} params.id The unique identifier for the supplier.
     * @param {string} params.name The name of the supplier (2-100 characters).
     * @param {string|null} params.contactEmail The contact email of the supplier (valid email format or null).
     * @param {Money|null} params.lastOrderTotalPrice The total price of the last order from this supplier (Money instance or null).
     * @throws {ValidationError} Throws if any property fails validation.
     */
    constructor({id, name, contactEmail, lastOrderTotalPrice}) {
        if (!(id instanceof SupplierId))
            throw new ValidationError("Supplier ID must be an instance of SupplierId");
        if (typeof name !== 'string' || name.length < 2 || name.length > 100)
            throw new ValidationError("Supplier name must be a string between 2 and 100 characters");
        if (contactEmail !== null && !this.#isValidEmail(contactEmail))
            throw new ValidationError("Contact email must be a valid email address or null");
        if (lastOrderTotalPrice !== null && !(lastOrderTotalPrice instanceof Money))
            throw new ValidationError("Last order total price must be an instance of Money or null");
        this.#id = id
        this.#name = name
        this.#contactEmail = contactEmail
        this.#lastOrderTotalPrice = lastOrderTotalPrice
    }

    /**
     * Validates the email format.
     * @param {string} email - The email to validate.
     * @returns {boolean} True if the email is valid, false otherwise.
     */
    #isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Gets the supplier ID.
     * @returns {SupplierId} The supplier ID.
     */
    get id() {
        return this.#id;
    }

    /**
     * Gets the supplier name.
     * @returns {string} The supplier name.
     */
    get name() {
        return this.#name;
    }

    /**
     * Gets the contact email.
     * @returns {string|null} The contact email or null if not provided.
     */
    get contactEmail() {
        return this.#contactEmail;
    }

    /**
     * Gets the total price of the last order.
     * @returns {Money|null} The total price of the last order or null if not available.
     */
    get lastOrderTotalPrice() {
        return this.#lastOrderTotalPrice;
    }
}