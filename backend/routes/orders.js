const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database/database');

// Twilio setup - will be initialized on first use
let twilioClient = null;

const initializeTwilio = () => {
  try {
    // Try environment variables first, then fallback to database settings
            const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
        const authToken = process.env.TWILIO_AUTH_TOKEN || '';
        const twilioPhone = process.env.TWILIO_PHONE_NUMBER || '';
        const adminPhone = process.env.ADMIN_PHONE || '+4553379153';

    if (accountSid && authToken && twilioPhone) {
      const twilio = require('twilio');
      twilioClient = twilio(accountSid, authToken);
      console.log('Twilio initialized successfully');
      return { twilioClient, twilioPhone, adminPhone };
    } else {
      console.log('Twilio credentials not found');
      return null;
    }
  } catch (error) {
    console.error('Twilio initialization failed:', error);
    return null;
  }
};

// SMS notification function
const sendSMSNotification = async (orderData) => {
  const twilioConfig = initializeTwilio();
  
  if (!twilioConfig) {
    console.log('SMS not sent - Twilio not configured');
    return false;
  }

  try {
    const message = `🍽️ NY BESTILLING - me&ma

Mad: ${orderData.mad}
${orderData.drikke ? `Drikke: ${orderData.drikke}` : ''}
${orderData.ekstra_info ? `Ekstra: ${orderData.ekstra_info}` : ''}
${orderData.telefon ? `Telefon: ${orderData.telefon}` : ''}

Bestilling #${orderData.id}
Tid: ${new Date().toLocaleString('da-DK')}`;

    await twilioConfig.twilioClient.messages.create({
      body: message,
      from: twilioConfig.twilioPhone,
      to: twilioConfig.adminPhone
    });

    console.log(`SMS sent to ${twilioConfig.adminPhone} for order #${orderData.id}`);
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
};

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

    // Send SMS notification
    await sendSMSNotification(orderData);

    res.status(201).json({
      success: true,
      message: 'Bestilling modtaget!',
      order: orderData
    });

  } catch (error) {
    console.error('Fejl ved oprettelse af bestilling:', error);
    
    // Check if it's a database error
    if (error.message && error.message.includes('For mange bestillinger')) {
      res.status(429).json({
        error: 'For mange bestillinger. Vent venligst 1 minut før du prøver igen.',
        retryAfter: 60
      });
    } else {
      res.status(500).json({
        error: 'Der opstod en fejl ved oprettelse af bestillingen'
      });
    }
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
    console.log('Status update request:', { id: req.params.id, body: req.body });
    const { status } = req.body;
    const validStatuses = ['ny', 'behandles', 'klar', 'afsendt', 'annulleret'];

    if (!validStatuses.includes(status)) {
      console.log('Invalid status:', status);
      return res.status(400).json({
        error: 'Ugyldig status'
      });
    }

    console.log('Updating order status...');
    const result = await dbHelpers.updateOrderStatus(req.params.id, status);
    console.log('Status update result:', result);
    
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