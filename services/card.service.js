/**
 * Card Service
 * 
 * Business logic layer for card operations.
 * Handles pagination, validation, and data transformation.
 */

const CardModel = require('../models/card.model');
const logger = require('../utils/logger');

class CardService {
  /**
   * Get paginated cards
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @returns {Object} Paginated response with metadata
   */
  static getPaginatedCards(page = 1, limit = 10) {
    try {
      const allCards = CardModel.getAll();
      const totalCards = allCards.length;
      const totalPages = Math.ceil(totalCards / limit) || 1;

      // Ensure page is within valid range
      const validPage = Math.max(1, Math.min(page, totalPages));
      if (validPage !== page) {
        logger.warn(`Invalid page number: ${page}, adjusted to ${validPage}`);
      }

      // Calculate pagination boundaries
      const startIndex = (validPage - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCards = allCards.slice(startIndex, endIndex);

      return {
        totalCards,
        totalPages,
        currentPage: validPage,
        limit,
        count: paginatedCards.length,
        cards: paginatedCards,
        next: validPage < totalPages ? { page: validPage + 1, limit } : null,
        previous: validPage > 1 ? { page: validPage - 1, limit } : null,
      };
    } catch (error) {
      logger.error('Error in getPaginatedCards', error);
      throw error;
    }
  }

  /**
   * Get card by ID
   * @param {number} id - Card ID
   * @returns {Object|null} Card object or null if not found
   */
  static getCardById(id) {
    try {
      return CardModel.getById(id);
    } catch (error) {
      logger.error(`Error fetching card ${id}`, error);
      throw error;
    }
  }

  /**
   * Create a new card
   * @param {Object} cardData - Card data { suit, value, collection }
   * @returns {Object} Created card
   */
  static createCard(cardData) {
    try {
      const card = CardModel.create(cardData);
      logger.info(`Card created with ID: ${card.id}`);
      return card;
    } catch (error) {
      logger.error('Error creating card', error);
      throw error;
    }
  }

  /**
   * Update a card
   * @param {number} id - Card ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated card or null if not found
   */
  static updateCard(id, updates) {
    try {
      const card = CardModel.update(id, updates);
      if (card) {
        logger.info(`Card ${id} updated`);
      }
      return card;
    } catch (error) {
      logger.error(`Error updating card ${id}`, error);
      throw error;
    }
  }

  /**
   * Delete a card
   * @param {number} id - Card ID
   * @returns {boolean} True if deleted, false if not found
   */
  static deleteCard(id) {
    try {
      const deleted = CardModel.delete(id);
      if (deleted) {
        logger.info(`Card ${id} deleted`);
      }
      return deleted;
    } catch (error) {
      logger.error(`Error deleting card ${id}`, error);
      throw error;
    }
  }
}

module.exports = CardService;
