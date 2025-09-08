import {ValidationError} from "../../../shared/domain/model/errors.js";
import {ProductId} from "../../../shared/domain/model/product-id.js";
import {Money} from "../../../shared/domain/model/money.js";

/**
 * Represents an item in a purchase order aggregate for the Procurement bounded context.
 * Includes validation for its properties and a method to calculate the subtotal.
 * @class
 * @property {string} orderId - The ID of the purchase order.
 * @property {ProductId} productId - The ID of the product.
 * @property {number} quantity - The quantity of the product.
 * @property {Money} unitPrice - The unit price of the product.
 * @method {Money} calculateSubtotal - Calculates the subtotal for this item (unit price * quantity).
 */
export class PurchaseOrderItem {
    #orderId
    #productId
    #quantity
    #unitPrice

    /**
     * Creates a new PurchaseOrderItem instance.
     * @param {Object} params - The parameters for the purchase order item.
     * @param {string} params.orderId - The ID of the purchase order.
     * @param {ProductId} params.productId - The ID of the product.
     * @param {number} params.quantity - The quantity of the product.
     * @param {Money} params.unitPrice - The unit price of the product.
     * @throws {ValidationError} If any of the parameters are invalid.
     */
    constructor({ orderId, productId, quantity, unitPrice }) {
        if (typeof orderId !== 'string' || !orderId)
            throw new ValidationError('orderId must be a string');
        if (!(productId instanceof ProductId))
            throw new ValidationError('productId must be an instance of ProductId');
        if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 1000)
            throw new ValidationError('quantity must be a positive integer not exceeding 1000');
        if (!(unitPrice instanceof Money))
            throw new ValidationError('unitPrice must be a valid Money instance');
        this.#orderId = orderId
        this.#productId = productId
        this.#quantity = quantity
        this.#unitPrice = unitPrice
    }

    /**
     * Gets the order ID.
     * @returns {string} The order ID.
     */
    get orderId() {
        return this.#orderId
    }

    /**
     * Gets the product ID.
     * @returns {ProductId} The product ID.
     */
    get productId() {
        return this.#productId
    }

    /**
     * Gets the quantity.
     * @returns {number} The quantity.
     */
    get quantity() {
        return this.#quantity
    }

    /**
     * Gets the unit price.
     * @returns {Money} The unit price.
     */
    get unitPrice() {
        return this.#unitPrice
    }

    /**
     * Calculates the subtotal for this item (unit price * quantity).
     * @returns {Money} The subtotal amount.
     */
    calculateSubtotal() {
        return this.#unitPrice.multiply(this.#quantity)
    }
}