// controllers/paymentController.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getPaymentController = () => {
  
  /**
   * @desc    Create Payment Intent
   * @route   POST /api/v1/payments/create-payment-intent
   * @access  Private
   */
  const createPaymentIntent = async (req, res) => {
    try {
      const { amount, scholarshipId } = req.body;
      
      // Validate amount
      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid payment amount' });
      }
      
      const amountInCents = Math.round(amount * 100);
      
      // Create payment intent with metadata
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: {
          scholarshipId: scholarshipId || 'unknown',
          integration_check: 'accept_a_payment'
        }
      });
      
      res.json({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Payment intent creation error:', error);
      res.status(500).json({ success: false, message: 'Error creating payment intent', error: error.message });
    }
  };
  
  return {
    createPaymentIntent,
  };
};

module.exports = getPaymentController;
