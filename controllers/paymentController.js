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
      const { amount } = req.body;
      const amountInCents = parseInt(amount * 100);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        payment_method_types: ['card']
      });
      
      res.json({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating payment intent', error: error.message });
    }
  };
  
  return {
    createPaymentIntent,
  };
};

module.exports = getPaymentController;
