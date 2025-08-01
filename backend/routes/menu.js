const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database/database');

// GET /api/menu/food - Get all food items
router.get('/food', async (req, res) => {
  try {
    const foodItems = await dbHelpers.getAllFoodItems();
    res.json({
      success: true,
      items: foodItems
    });
  } catch (error) {
    console.error('Fejl ved hentning af mad:', error);
    res.status(500).json({
      error: 'Der opstod en fejl ved hentning af mad'
    });
  }
});

// GET /api/menu/drinks - Get all drink items
router.get('/drinks', async (req, res) => {
  try {
    const drinkItems = await dbHelpers.getAllDrinkItems();
    res.json({
      success: true,
      items: drinkItems
    });
  } catch (error) {
    console.error('Fejl ved hentning af drikke:', error);
    res.status(500).json({
      error: 'Der opstod en fejl ved hentning af drikke'
    });
  }
});

// POST /api/menu/food - Create new food item
router.post('/food', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        error: 'Navn og pris er påkrævet'
      });
    }

    const newItem = await dbHelpers.createFoodItem({
      name,
      description: description || '',
      price: parseFloat(price)
    });

    res.status(201).json({
      success: true,
      message: 'Mad oprettet',
      item: newItem
    });
  } catch (error) {
    console.error('Fejl ved oprettelse af mad:', error);
    res.status(500).json({
      error: 'Der opstod en fejl ved oprettelse af mad'
    });
  }
});

// POST /api/menu/drinks - Create new drink item
router.post('/drinks', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        error: 'Navn og pris er påkrævet'
      });
    }

    const newItem = await dbHelpers.createDrinkItem({
      name,
      description: description || '',
      price: parseFloat(price)
    });

    res.status(201).json({
      success: true,
      message: 'Drikke oprettet',
      item: newItem
    });
  } catch (error) {
    console.error('Fejl ved oprettelse af drikke:', error);
    res.status(500).json({
      error: 'Der opstod en fejl ved oprettelse af drikke'
    });
  }
});

// PUT /api/menu/food/:id - Update food item
router.put('/food/:id', async (req, res) => {
  try {
    const { name, description, price, available } = req.body;

    const updatedItem = await dbHelpers.updateFoodItem(req.params.id, {
      name,
      description,
      price: parseFloat(price),
      available
    });

    res.json({
      success: true,
      message: 'Mad opdateret',
      item: updatedItem
    });
  } catch (error) {
    console.error('Fejl ved opdatering af mad:', error);
    res.status(500).json({
      error: 'Der opstod en fejl ved opdatering af mad'
    });
  }
});

// PUT /api/menu/drinks/:id - Update drink item
router.put('/drinks/:id', async (req, res) => {
  try {
    const { name, description, price, available } = req.body;

    const updatedItem = await dbHelpers.updateDrinkItem(req.params.id, {
      name,
      description,
      price: parseFloat(price),
      available
    });

    res.json({
      success: true,
      message: 'Drikke opdateret',
      item: updatedItem
    });
  } catch (error) {
    console.error('Fejl ved opdatering af drikke:', error);
    res.status(500).json({
      error: 'Der opstod en fejl ved opdatering af drikke'
    });
  }
});

// DELETE /api/menu/food/:id - Delete food item
router.delete('/food/:id', async (req, res) => {
  try {
    await dbHelpers.deleteFoodItem(req.params.id);
    res.json({
      success: true,
      message: 'Mad slettet'
    });
  } catch (error) {
    console.error('Fejl ved sletning af mad:', error);
    res.status(500).json({
      error: 'Der opstod en fejl ved sletning af mad'
    });
  }
});

// DELETE /api/menu/drinks/:id - Delete drink item
router.delete('/drinks/:id', async (req, res) => {
  try {
    await dbHelpers.deleteDrinkItem(req.params.id);
    res.json({
      success: true,
      message: 'Drikke slettet'
    });
  } catch (error) {
    console.error('Fejl ved sletning af drikke:', error);
    res.status(500).json({
      error: 'Der opstod en fejl ved sletning af drikke'
    });
  }
});

module.exports = router;