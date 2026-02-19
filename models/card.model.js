/**
 * Card Model
 * 
 * Manages the in-memory card data store.
 * In production, this would be replaced with a database like MongoDB or PostgreSQL.
 */

// Initial card data
const cards = [
  { id: 171836785992, suit: 'diamonds', value: 'queen', collection: 'royal' },
  { id: 171836785993, suit: 'hearts', value: 'king', collection: 'royal' },
  { id: 171836785994, suit: 'clubs', value: 'ace', collection: 'classic' },
  { id: 171836785995, suit: 'spades', value: 'jack', collection: 'classic' },
];

let nextId = 171836785996;

/**
 * CardModel class provides CRUD operations for cards
 */
class CardModel {
  /**
   * Get all cards
   * @returns {Array<Object>} Array of all cards
   */
  static getAll() {
    return cards;
  }

  /**
   * Get card by ID
   * @param {number} id - Card ID
   * @returns {Object|undefined} Card object or undefined if not found
   */
  static getById(id) {
    return cards.find(card => card.id === id);
  }

  /**
   * Create a new card
   * @param {Object} cardData - Card data { suit, value, collection }
   * @returns {Object} Created card with generated ID
   */
  static create(cardData) {
    const newCard = {
      id: nextId++,
      suit: cardData.suit,
      value: cardData.value,
      collection: cardData.collection,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    cards.push(newCard);
    return newCard;
  }

  /**
   * Update a card
   * @param {number} id - Card ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated card or null if not found
   */
  static update(id, updates) {
    const cardIndex = cards.findIndex(card => card.id === id);
    if (cardIndex === -1) return null;
    
    cards[cardIndex] = {
      ...cards[cardIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return cards[cardIndex];
  }

  /**
   * Delete a card
   * @param {number} id - Card ID
   * @returns {boolean} True if deleted, false if not found
   */
  static delete(id) {
    const cardIndex = cards.findIndex(card => card.id === id);
    if (cardIndex === -1) return false;
    
    cards.splice(cardIndex, 1);
    return true;
  }

  /**
   * Get total card count
   * @returns {number} Total number of cards
   */
  static getCount() {
    return cards.length;
  }
}

module.exports = CardModel;
