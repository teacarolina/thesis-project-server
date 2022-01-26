const express = require('express');
const app = express();

const cors = require("cors");
const bodyParser = require('body-parser');

require("dotenv").config();
                                  
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.post('/create-checkout-session', async (req, res) => {  

const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  shipping_address_collection: {
    allowed_countries: ['US', 'SE'],
  },
  shipping_options: [
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: {
          amount: 0,
          currency: 'usd',
        },
        display_name: 'Free shipping',
        delivery_estimate: {
          minimum: {
            unit: 'business_day',
            value: 5,
          },
          maximum: {
            unit: 'business_day',
            value: 7,
          },
        }
      }
    },
  ],
  line_items: [
    {
      price_data: {
        currency: 'usd',
        product_data: {
        name: req.body.name,
        },
        unit_amount: req.body.price * 100,
      },
        quantity: req.body.quantity,
    },
  ],
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/error',
});

  res.json({ id: session.id});
});

app.listen( process.env.PORT || 4242 , () => console.log(`Listening on port ${4242}!`));