/**
 * Card Controller
 * 
 * Handles HTTP request/response logic for card endpoints.
 * Validates inputs and delegates business logic to the service layer.
 */

const CardService = require('../services/card.service');
const logger = require('../utils/logger');
const { validateCardData, validatePaginationParams, validateCardId } = require('../utils/validators');

class CardController {
  /**
   * GET /cards - Retrieve all cards with pagination
   * Query params: page (default: 1), limit (default: 10)
   */
  static getCards(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Validate pagination parameters
      const validation = validatePaginationParams(page, limit);
      if (!validation.valid) {
        logger.warn('Invalid pagination parameters', { page, limit, errors: validation.errors });
        return res.status(400).json({
          error: 'Bad Request',
          message: validation.errors.join('; '),
          timestamp: new Date().toISOString(),
        });
      }

      const result = CardService.getPaginatedCards(page, limit);
      logger.debug(`Retrieved ${result.count} cards`, { page, limit });
      res.json(result);
    } catch (error) {
      logger.error('Error retrieving cards', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve cards',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /cards/:id - Retrieve a single card by ID
   */
  static getCardById(req, res) {
    try {
      const idValidation = validateCardId(req.params.id);
      if (!idValidation.valid) {
        logger.warn('Invalid card ID', { id: req.params.id });
        return res.status(400).json({
          error: 'Bad Request',
          message: idValidation.error,
          timestamp: new Date().toISOString(),
        });
      }

      const id = parseInt(req.params.id);
      const card = CardService.getCardById(id);

      if (!card) {
        logger.debug(`Card not found: ${id}`);
        return res.status(404).json({
          error: 'Not Found',
          message: `Card with ID ${id} does not exist`,
          timestamp: new Date().toISOString(),
        });
      }

      logger.debug(`Retrieved card: ${id}`);
      res.json(card);
    } catch (error) {
      logger.error(`Error retrieving card ${req.params.id}`, error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve card',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /cards - Create a new card
   * Body: { suit, value, collection }
   */
  static createCard(req, res) {
    try {
      // Validate request body
      const validation = validateCardData(req.body, true);
      if (!validation.valid) {
        logger.warn('Invalid card data in create request', { errors: validation.errors });
        return res.status(400).json({
          error: 'Bad Request',
          message: validation.errors.join('; '),
          timestamp: new Date().toISOString(),
        });
      }

      const cardData = {
        suit: req.body.suit.trim(),
        value: req.body.value.trim(),
        collection: req.body.collection.trim(),
      };

      const newCard = CardService.createCard(cardData);
      logger.info(`New card created`, { cardId: newCard.id });
      res.status(201).json(newCard);
    } catch (error) {
      logger.error('Error creating card', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create card',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * PUT /cards/:id - Update an existing card
   * Body: partial card object with fields to update
   */
  static updateCard(req, res) {
    try {
      const idValidation = validateCardId(req.params.id);
      if (!idValidation.valid) {
        logger.warn('Invalid card ID in update request', { id: req.params.id });
        return res.status(400).json({
          error: 'Bad Request',
          message: idValidation.error,
          timestamp: new Date().toISOString(),
        });
      }

      const id = parseInt(req.params.id);

      // Check if card exists
      const existingCard = CardService.getCardById(id);
      if (!existingCard) {
        logger.debug(`Card not found for update: ${id}`);
        return res.status(404).json({
          error: 'Not Found',
          message: `Card with ID ${id} does not exist`,
          timestamp: new Date().toISOString(),
        });
      }

      // Validate update data
      const validation = validateCardData(req.body, false);
      if (!validation.valid) {
        logger.warn(`Invalid card data in update request for card ${id}`, { errors: validation.errors });
        return res.status(400).json({
          error: 'Bad Request',
          message: validation.errors.join('; '),
          timestamp: new Date().toISOString(),
        });
      }

      // Trim string values
      const updates = {};
      if (req.body.suit !== undefined) updates.suit = req.body.suit.trim();
      if (req.body.value !== undefined) updates.value = req.body.value.trim();
      if (req.body.collection !== undefined) updates.collection = req.body.collection.trim();

      const updatedCard = CardService.updateCard(id, updates);
      logger.info(`Card updated`, { cardId: id });
      res.json(updatedCard);
    } catch (error) {
      logger.error(`Error updating card ${req.params.id}`, error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update card',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * DELETE /cards/:id - Delete a card
   */
  static deleteCard(req, res) {
    try {
      const idValidation = validateCardId(req.params.id);
      if (!idValidation.valid) {
        logger.warn('Invalid card ID in delete request', { id: req.params.id });
        return res.status(400).json({
          error: 'Bad Request',
          message: idValidation.error,
          timestamp: new Date().toISOString(),
        });
      }

      const id = parseInt(req.params.id);

      // Check if card exists
      const existingCard = CardService.getCardById(id);
      if (!existingCard) {
        logger.debug(`Card not found for deletion: ${id}`);
        return res.status(404).json({
          error: 'Not Found',
          message: `Card with ID ${id} does not exist`,
          timestamp: new Date().toISOString(),
        });
      }

      CardService.deleteCard(id);
      logger.info(`Card deleted`, { cardId: id });
      res.json({
        message: 'Card deleted successfully',
        id,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error deleting card ${req.params.id}`, error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to delete card',
        timestamp: new Date().toISOString(),
      });
    }
  }
}

module.exports = CardController;
