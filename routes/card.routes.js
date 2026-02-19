const express = require('express');
const CardController = require('../controllers/card.controller');

const router = express.Router();

// GET /cards - Get all cards with pagination
router.get('/', CardController.getCards);

// GET /cards/:id - Get a single card
router.get('/:id', CardController.getCardById);

// POST /cards - Create a new card
router.post('/', CardController.createCard);

// PUT /cards/:id - Update a card
router.put('/:id', CardController.updateCard);

// DELETE /cards/:id - Delete a card
router.delete('/:id', CardController.deleteCard);

module.exports = router;
