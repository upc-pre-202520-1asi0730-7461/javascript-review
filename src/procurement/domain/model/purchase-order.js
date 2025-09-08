import {ValidationError} from "../../../shared/domain/model/errors.js";
import {Currency} from "../../../shared/domain/model/currency.js";
import {generateUUID} from "../../../shared/domain/model/uuid.js";
import {DateTime} from "../../../shared/domain/model/date-time.js";
import {PurchaseOrderState} from "./purchase-order-state.js";
import {PurchaseOrderItem} from "./purchase-order-item.js";
import {Money} from "../../../shared/domain/model/money.js";

/**
 * Represents a purchase order aggregate root.
 * Manages the lifecycle and business rules of a purchase order in the Procurement bounded context.
 * @class
 * @property {string} id - Unique identifier for the purchase order.
 * @property {SupplierId} supplierId - Identifier of the supplier associated with the purchase order.
 * @property {Currency} currency - Currency used for the purchase order.
 * @property {DateTime} orderDate - Date when the purchase order was created.
 * @property {PurchaseOrderItem[]} items - List of items included in the purchase order.
 * @property {PurchaseOrderState} state - Current state of the purchase order (e.g., Draft, Approved, Shipped, Completed, Cancelled).
 */
export class PurchaseOrder {
    #MAX_ITEMS = 50
    #id
    #supplierId
    #currency
    #orderDate
    #items
    #state

    /**
     * Creates a new PurchaseOrder instance.
     * @param {Object} params
     * @param {SupplierId} params.supplierId - Identifier of the supplier.
     * @param {Currency} params.currency - Currency for the purchase order.
     * @param {DateTime} [params.orderDate] - Date of the order; defaults to current date if not provided.
     * @throws {ValidationError} If required parameters are missing or invalid.
     */
    constructor({supplierId, currency, orderDate}) {
        if (!supplierId)
            throw new ValidationError('supplierId is required');
        if (!currency instanceof Currency)
            throw new ValidationError('currency must be an instance of Currency');
        this.#id = generateUUID();
        this.#supplierId = supplierId;
        this.#currency = currency;
        this.#orderDate = orderDate instanceof DateTime ? orderDate : new DateTime();
        this.#items = [];
        this.#state = new PurchaseOrderState();
    }

    /**
     * Adds an item to the purchase order.
     * @param {Object} params
     * @param {string} params.productId - Identifier of the product to add.
     * @param {number} params.quantity - Quantity of the product to add.
     * @param {number} params.unitPrice - Unit price of the product.
     * @throws {ValidationError} If the purchase order is not in Draft state, exceeds max items, or if parameters are invalid.
     */
    addItem({productId, quantity, unitPrice}) {
        if (!this.#state.isDraft())
            throw new ValidationError('Cannot add items to a non-draft purchase order');
        if (this.#items.length >= this.#MAX_ITEMS)
            throw new ValidationError(`Cannot add more than ${this.#MAX_ITEMS} items to a purchase order`);
        if (!Number.isFinite(unitPrice) || unitPrice < 0)
            throw new ValidationError('unitPrice must be a non-negative number');

        this.#items.push(
            new PurchaseOrderItem({
                orderId: this.#id,
                productId,
                quantity,
                unitPrice: new Money({amount: unitPrice, currency: this.#currency})
            })
        );
    }

    /**
     * Calculates the total price of the purchase order by summing the subtotals of all items.
     * @throws {ValidationError} If there are no items in the purchase order.
     * @returns {Money} Total price of the purchase order.
     */
    calculateTotalPrice() {
        if (this.#items.length === 0)
            throw new ValidationError('Cannot calculate total price of a purchase order with no items');
        return this.#items
            .reduce((sum, item) => sum.add(item.calculateSubtotal()),
                new Money({amount: 0, currency: this.#currency}));
    }

    /**
     * Transitions the purchase order to Approved state.
     * @throws {ValidationError} If the purchase order is not in Draft state or has no items.
     */
    approve() {
        this.#state = this.#state.toApprovedFrom(this.#state);
    }

    /**
     * Transitions the purchase order to Shipped state.
     * @throws {ValidationError} If the purchase order is not in Approved state.
     */
    ship() {
        this.#state = this.#state.toShippedFrom(this.#state);
    }

    /**
     * Transitions the purchase order to Completed state.
     * @throws {ValidationError} If the purchase order is not in Shipped state.
     */
    complete() {
        this.#state = this.#state.toCompletedFrom(this.#state);
    }

    /**
     * Transitions the purchase order to Cancelled state.
     * @throws {ValidationError} If the purchase order is already Completed or Cancelled.
     */
    cancel() {
        this.#state = this.#state.toCancelledFrom(this.#state);
    }

    /**
     * Gets the unique identifier of the purchase order.
     * @returns {string} The purchase order ID.
     */
    get id() {
        return this.#id;
    }

    /**
     * Gets the supplier ID associated with the purchase order.
     * @returns {SupplierId} The supplier ID.
     */
    get supplierId() {
        return this.#supplierId;
    }

    /**
     * Gets the currency of the purchase order.
     * @returns {Currency} The currency.
     */
    get currency() {
        return this.#currency;
    }

    /**
     * Gets the order date of the purchase order.
     * @returns {DateTime} The order date.
     */
    get orderDate() {
        return this.#orderDate;
    }

    /**
     * Gets a copy of the items in the purchase order.
     * @returns {*[]} Array of purchase order items.
     */
    get items() {
        return [...this.#items];
    }

    /**
     * Gets the current state of the purchase order.
     * @returns {string} The current state (e.g., Draft, Approved, Shipped, Completed, Cancelled).
     */
    get state() {
        return this.#state.value;
    }

    /**
     * Checks if the purchase order is in Draft state.
     * @returns {boolean} True if the purchase order is a draft, false otherwise.
     */
    get isDraft() {
        return this.#state.isDraft();
    }

}