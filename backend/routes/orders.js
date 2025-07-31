const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database/database');

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const { mad, drikke, ekstra_info, telefon } = req.body;

    // Validate required fields
    if (!mad) {
      return res.status(400).json({
        error: 'Mad er påkrævet'
      });
    }

    // Create order
    const orderData = await dbHelpers.createOrder({
      mad,
      drikke: drikke || '',
      ekstra_info: ekstra_info || '',
      telefon: telefon || ''
    });

    res.status(201).json({
      success: true,
      message: 'Bestilling modtaget!',
      order: orderData
    });

  } catch (error) {
    console.error('Fejl ved oprettelse af bestilling:', error);
    res.status(500).json({
      error: 'Der opstod en fejl ved oprettelse af bestillingen'
    });
  }
});

// GET /api/orders - Get all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await dbHelpers.getAllOrders();
    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('Fejl ved hentning af bestillinger:', error);
    res.status(500).json({
      error: 'Der opstod en fejl ved hentning af bestillinger'
    });
  }
});

// GET /api/orders/:id - Get specific order
router.get('/:id', async (req, res) => {
  try {
    const order = await dbHelpers.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({
        error: 'Bestilling ikke fundet'
      });
    }
    res.json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error('Fejl ved hentning af bestilling:', error);
    res.status(500).json({
      error: 'Der opstod en fejl ved hentning af bestillingen'
    });
  }
});

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['ny', 'behandles', 'klar', 'afsendt', 'annulleret'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Ugyldig status'
      });
    }

    const result = await dbHelpers.updateOrderStatus(req.params.id, status);
    res.json({
      success: true,
      message: 'Status opdateret',
      order: result
    });
  } catch (error) {
    console.error('Fejl ved opdatering af status:', error);
    res.status(500).json({
      error: 'Der opstod en fejl ved opdatering af status'
    });
  }
});

module.exports = router; 