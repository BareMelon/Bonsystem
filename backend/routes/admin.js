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
    const { restaurant_name, admin_phone, twilio_account_sid, twilio_auth_token, twilio_phone_number } = req.body;

    const updates = [];
    if (restaurant_name !== undefined) updates.push(dbHelpers.updateSetting('restaurant_name', restaurant_name));
    if (admin_phone !== undefined) updates.push(dbHelpers.updateSetting('admin_phone', admin_phone));
    if (twilio_account_sid !== undefined) updates.push(dbHelpers.updateSetting('twilio_account_sid', twilio_account_sid));
    if (twilio_auth_token !== undefined) updates.push(dbHelpers.updateSetting('twilio_auth_token', twilio_auth_token));
    if (twilio_phone_number !== undefined) updates.push(dbHelpers.updateSetting('twilio_phone_number', twilio_phone_number));

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
      totalOrders: orders.length,
      newOrders: orders.filter(o => o.status === 'ny').length,
      processingOrders: orders.filter(o => o.status === 'behandles').length,
      readyOrders: orders.filter(o => o.status === 'klar').length,
      sentOrders: orders.filter(o => o.status === 'afsendt').length,
      cancelledOrders: orders.filter(o => o.status === 'annulleret').length
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