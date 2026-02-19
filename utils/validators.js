/**
 * Validation utilities for card data
 */

/**
 * Validate card creation/update data
 * @param {Object} cardData - Data to validate
 * @param {boolean} isCreation - Whether this is a create operation (all fields required)
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateCardData(cardData, isCreation = false) {
  const errors = [];

  if (!cardData || typeof cardData !== 'object') {
    return { valid: false, errors: ['Card data must be a valid object'] };
  }

  if (isCreation) {
    if (!cardData.suit || typeof cardData.suit !== 'string' || cardData.suit.trim() === '') {
      errors.push('suit is required and must be a non-empty string');
    }
    if (!cardData.value || typeof cardData.value !== 'string' || cardData.value.trim() === '') {
      errors.push('value is required and must be a non-empty string');
    }
    if (!cardData.collection || typeof cardData.collection !== 'string' || cardData.collection.trim() === '') {
      errors.push('collection is required and must be a non-empty string');
    }
  } else {
    // For updates, validate only provided fields
    if (cardData.suit !== undefined) {
      if (typeof cardData.suit !== 'string' || cardData.suit.trim() === '') {
        errors.push('suit must be a non-empty string');
      }
    }
    if (cardData.value !== undefined) {
      if (typeof cardData.value !== 'string' || cardData.value.trim() === '') {
        errors.push('value must be a non-empty string');
      }
    }
    if (cardData.collection !== undefined) {
      if (typeof cardData.collection !== 'string' || cardData.collection.trim() === '') {
        errors.push('collection must be a non-empty string');
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validatePaginationParams(page, limit) {
  const errors = [];

  if (isNaN(page) || page < 1) {
    errors.push('page must be a positive integer');
  }
  if (isNaN(limit) || limit < 1 || limit > 100) {
    errors.push('limit must be a positive integer between 1 and 100');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate card ID
 * @param {*} id - ID to validate
 * @returns {Object} { valid: boolean, error: string|null }
 */
function validateCardId(id) {
  const parsedId = parseInt(id);

  if (isNaN(parsedId) || parsedId <= 0) {
    return { valid: false, error: 'Card ID must be a positive number' };
  }

  return { valid: true, error: null };
}

module.exports = {
  validateCardData,
  validatePaginationParams,
  validateCardId,
};
