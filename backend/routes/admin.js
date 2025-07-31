const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database/database');

// GET /api/admin/orders - Get all orders
router.get('/orders', async (req, res) => {
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

// GET /api/admin/settings - Get all settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await dbHelpers.getSettings();
    res.json({
      success: true,
      settings: settings
    });
  } catch (error) {
    console.error('Fejl ved hentning af indstillinger:', error);
    res.status(500).json({
      error: 'Der opstod en fejl ved hentning af indstillinger'
    });
  }
});

// PUT /api/admin/settings - Update settings
router.put('/settings', async (req, res) => {
  try {
    const { restaurant_name } = req.body;

    const updates = [];
    if (restaurant_name) updates.push(dbHelpers.updateSetting('restaurant_name', restaurant_name));

    await Promise.all(updates);

    res.json({
      success: true,
      message: 'Indstillinger opdateret'
    });
  } catch (error) {
    console.error('Fejl ved opdatering af indstillinger:', error);
    res.status(500).json({
      error: 'Der opstod en fejl ved opdatering af indstillinger'
    });
  }
});

// GET /api/admin/stats - Get system statistics
router.get('/stats', async (req, res) => {
  try {
    const orders = await dbHelpers.getAllOrders();

    const stats = {
      total_orders: orders.length,
      new_orders: orders.filter(o => o.status === 'ny').length,
      processing_orders: orders.filter(o => o.status === 'behandles').length,
      ready_orders: orders.filter(o => o.status === 'klar').length,
      completed_orders: orders.filter(o => o.status === 'afsendt').length,
      cancelled_orders: orders.filter(o => o.status === 'annulleret').length,
      today_orders: orders.filter(o => {
        const today = new Date().toDateString();
        const orderDate = new Date(o.created_at).toDateString();
        return today === orderDate;
      }).length
    };

    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Fejl ved hentning af statistikker:', error);
    res.status(500).json({
      error: 'Der opstod en fejl ved hentning af statistikker'
    });
  }
});

// DELETE /api/admin/orders/:id - Delete order
router.delete('/orders/:id', async (req, res) => {
  try {
    const order = await dbHelpers.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({
        error: 'Bestilling ikke fundet'
      });
    }

    // Note: We'll add delete functionality to dbHelpers if needed
    // For now, we'll just update status to 'annulleret'
    await dbHelpers.updateOrderStatus(req.params.id, 'annulleret');

    res.json({
      success: true,
      message: 'Bestilling annulleret'
    });
  } catch (error) {
    console.error('Fejl ved sletning af bestilling:', error);
    res.status(500).json({
      error: 'Der opstod en fejl ved sletning af bestillingen'
    });
  }
});

module.exports = router; 