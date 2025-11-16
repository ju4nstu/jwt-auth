import db from '../config/db.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function checkout(server, opts) {

  server.post('/checkout', /*{ preHandler: server.authentication },*/ async (req, rep) => {
    // req.body -> id, name, quantity, price
    //console.log('req body -> ', req.body)
    
    let finalPrice = 0
    for (let i = 0; i < req.body.length; i++) {

      const stockDB = await db.raw('select stock, name, price from products where id = ?', [req.body[i].id])
      if (stockDB.rows.length === 0) {
        return rep.code(409).send({ message: `the given id (product ${req.body[i].id}) does not match any product in database` })
      }
      
      if (stockDB.rows[0].name !== req.body[i].name) {
        return rep.code(409).send({ message: `the given product name (${req.body[i].name}) does not match any product in database` })
      }
      
      if (stockDB.rows[0].price !== req.body[i].price) {
        return rep.code(409).send({ message: `the price inside of ${req.body[i].name} does not match his price in the database` })
      }
      
      if (stockDB.rows[0].stock < req.body[i].quantity) {
        return rep.code(409).send({ message: `the quantity of the product ${stockDB.rows[0].name} is bigger than its available stock` })
      }
      
      let sum = req.body[i].price * req.body[i].quantity
      finalPrice += sum
      
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalPrice),
      currency: 'brl',
      automatic_payment_methods: {
        enabled: true
      },
    })
  
    return rep.code(201).send({ clientSecret: paymentIntent.client_secret })
  })

}
