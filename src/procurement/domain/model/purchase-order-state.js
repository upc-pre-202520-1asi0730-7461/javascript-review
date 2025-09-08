import {ValidationError} from "../../../shared/domain/model/errors.js";

/**
 * Value Object representing the state of a Purchase Order.
 * Valid states are: Draft, Submitted, Approved, Shipped, Completed, Cancelled.
 * State transitions are enforced through specific methods.
 */
export class PurchaseOrderState {
    static #VALID_STATES = {
        DRAFT: 'Draft',
        SUBMITTED: 'Submitted',
        APPROVED: 'Approved',
        SHIPPED: 'Shipped',
        COMPLETED: 'Completed',
        CANCELLED: 'Cancelled',
    }
    #value;

    /**
     * Creates a new PurchaseOrderState.
     * Defaults to 'Draft' if no value is provided.
     * @param {string} value - The state value.
     * @throws {ValidationError} If the provided state is invalid.
     */
    constructor(value = PurchaseOrderState.#VALID_STATES.DRAFT) {
        this.#validateState(value);
        this.#value = value;
    }

    /**
     * Validates the provided state.
     * @throws {ValidationError} If the state is not valid.
     * @param {string} state - The state to validate.
     */
    #validateState(state) {
        if (!Object.values(PurchaseOrderState.#VALID_STATES).includes(state))
            throw new ValidationError(`Invalid purchase order state: ${state}. Valid states are: ${Object.values(PurchaseOrderState.#VALID_STATES).join(', ')}`);
    }

    /**
     * Gets the current state value.
     * @returns {string} The current state.
     */
    get value() {
        return this.#value;
    }

    /**
     * Transitions the state to 'Submitted' from 'Draft'.
     * @param {PurchaseOrderState} currentState - The current state.
     * @throws {ValidationError} If the transition is not valid.
     * @returns {PurchaseOrderState} The new state with value 'Submitted'.
     */
    toSubmittedFrom(currentState) {
        if (currentState.value !== PurchaseOrderState.#VALID_STATES.DRAFT )
            throw new ValidationError(`Cannot transition from ${currentState.value} to Submitted`);
        return new PurchaseOrderState(PurchaseOrderState.#VALID_STATES.SUBMITTED);
    }

    /**
     * Transitions the state to 'Approved' from 'Submitted'.
     * @param {PurchaseOrderState} currentState - The current state.
     * @throws {ValidationError} If the transition is not valid.
     * @returns {PurchaseOrderState} The new state with value 'Approved'.
     */
    toApprovedFrom(currentState) {
        if (currentState.value !== PurchaseOrderState.#VALID_STATES.SUBMITTED )
            throw new ValidationError(`Cannot transition from ${currentState.value} to Approved`);
        return new PurchaseOrderState(PurchaseOrderState.#VALID_STATES.APPROVED);
    }

    /**
     * Transitions the state to 'Shipped' from 'Approved'.
     * @throws {ValidationError} If the transition is not valid.
     * @param {PurchaseOrderState} currentState - The current state.
     * @returns {PurchaseOrderState} The new state with value 'Shipped'.
     */
    toShippedFrom(currentState) {
        if (currentState.value !== PurchaseOrderState.#VALID_STATES.APPROVED )
            throw new ValidationError(`Cannot transition from ${currentState.value} to Shipped`);
        return new PurchaseOrderState(PurchaseOrderState.#VALID_STATES.SHIPPED);
    }

    /**
     * Transitions the state to 'Completed' from 'Shipped'.
     * @param {PurchaseOrderState} currentState - The current state.
     * @throws {ValidationError} If the transition is not valid.
     * @returns {PurchaseOrderState} The new state with value 'Completed'.
     */
    toCompletedFrom(currentState) {
        if (currentState.value !== PurchaseOrderState.#VALID_STATES.SHIPPED )
            throw new ValidationError(`Cannot transition from ${currentState.value} to Completed`);
        return new PurchaseOrderState(PurchaseOrderState.#VALID_STATES.COMPLETED);
    }

    /**
     * Transitions the state to 'Cancelled' from any state except 'Completed'.
     * @param {PurchaseOrderState} currentState - The current state.
     * @throws {ValidationError} If the transition is not valid.
     * @returns {PurchaseOrderState} The new state with value 'Cancelled'.
     */
    toCancelledFrom(currentState) {
        if(currentState.value === PurchaseOrderState.#VALID_STATES.COMPLETED)
            throw new ValidationError(`Cannot transition from ${currentState.value} to Cancelled`);
        return new PurchaseOrderState(PurchaseOrderState.#VALID_STATES.CANCELLED);
    }

    /**
     * Checks if the current state is 'Draft'.
     * @returns {boolean} True if the state is 'Draft', false otherwise.
     */
    isDraft() {
        return this.#value === PurchaseOrderState.#VALID_STATES.DRAFT;
    }

    /**
     * Verifies equality with another PurchaseOrderState.
     * @param {PurchaseOrderState} other - The other state to compare with.
     * @returns {boolean} True if both states are equal, false otherwise.
     */
    equals(other) {
        return other instanceof PurchaseOrderState && this.#value === other.#value;
    }
}