import {v4 as uuidv4, validate as uuidValidate} from 'uuid';

/**
 * Generates a UUID (Universally Unique Identifier).
 * @returns {string} A newly generated UUID.
 */
export function generateUUID() {
    return uuidv4();
}

/**
 * Validates whether a given string is a valid UUID.
 * @param {string} uuid - The UUID string to validate.
 * @returns {boolean} True if the string is a valid UUID, false otherwise.
 */
export function isValidUUID(uuid) {
    return uuidValidate(uuid);
}
