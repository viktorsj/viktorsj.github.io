const express = require('express');
const ejs = require ('ejs');
const paypal = require("paypal-rest-sdk");

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ARHIBJzrBXnvdlbuB54Y0t-E9T6Si8CNC28XpuUXhto0bfBWclse1SbM_kUWWxU-z3nJ5AIAnouiP7NH',
    'client_secret': 'EDgW2O0PzrxiiUYD8DdRl-UQ5r1BBmd2aUUVNu2twSaf_GWvGdYMoe-5Z6EDUueYbsFPmcqQGqHcsudT'
  });

const app = express();

app.set('view engine', 'ejs');

app.get ('/', (req,res) => res.render('index'));

app.post('/pay', (req,res) => {

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/sucesso",
            "cancel_url": "http://localhost:3000/cancelado"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Processador",
                    "sku": "123",
                    "price": "2000.00",
                    "currency": "BRL",
                    "quantity": 1
                }]
            },
                "amount": {
                    "currency": "BRL",
                    "total": "2000.00"
                 },
                    "description": "Overcloked Processor."
        }]
    };
   
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i =0;i < payment.links.length;i++){
                if(payment.links[i].rel =='approval_url'){
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });

});

app.get('/sucesso', (req,res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json ={
        "payer_id": payerId,
        "transactions":[{
            "amount":{
                "currency": "BRL",
                "total": "2000.00"
            }
         }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error,payment){
        if (error){
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment)); 
            res.redirect("https://i.imgur.com/hO7IuJq.jpg");
        }
    });    
});

app.get('/cancel', (req,res) => res.redirect("https:i.imgur.com/lKexQpw.jpg"));

app.listen(3000,() => console.log('Server Starte'))