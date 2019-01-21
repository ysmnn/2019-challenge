var express = require('express');
var router = express.Router();
var paypal = require('paypal-rest-sdk');
var Cart = require('../models/cart');
var Product = require('../models/product');
var Variant = require('../models/variant');
var Order = require('../models/order');
var Department = require('../models/department');
var Discount = require('../models/discount');


/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests to the checkout page
//
// This basically renders checkout page and set the discount price
// to 0 always.
//
/////////////////////////////////////////////////////////////////////
router.get('/', ensureAuthenticated, function(req, res, next) {
  let cart = new Cart(req.session.cart);
  req.session.cart.discountPrice = 0;
  res.render('checkout', {
    title: 'Checkout Page',
    items: cart.generateArray(),
    totalPrice: cart.totalPrice.toFixed(2), //rounds total to 2 decimal points
    bodyClass: 'registration',
    containerWrapper: 'container'
  });
})

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests for adding discount
//
// This basically rediercts to checkout page. I need this because
// I in the post request for apply discount I am rendering another page
// so '/apply-discount' keeps in the address bar. Therefore I just
// created redirect middleware for that reason.
//
/////////////////////////////////////////////////////////////////////
router.get('/apply-discount', ensureAuthenticated, function(req, res, next) {
  res.redirect('/checkout')
})

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles POST requests for adding discount
//
// Checks for the discount codes and if it is applicable then returns
// discounted price.
//
/////////////////////////////////////////////////////////////////////
router.post('/apply-discount', ensureAuthenticated, function(req, res, next) {
  let discountCode = req.body.discountCode;
  Discount.getDiscountByCode(discountCode, function(e, discount) {
    if (e) {
      console.log("Failed on router.get('/checkout/apply-discount')\nError:".error, e.message.error + "\n")
      e.status = 406;
      next(e);
    } else {
      let cart = new Cart(req.session.cart);
      if (discount) {
        let totalDiscount = (cart.totalPrice * discount.percentage) / 100
        totalDiscount = parseFloat(totalDiscount.toFixed(2))
        let totalPrice = cart.totalPrice - totalDiscount;
        totalPrice = parseFloat(totalPrice.toFixed(2))
        cart.discountPrice = totalPrice
        req.session.cart = cart;
        console.log(req.session.cart)
        res.render('checkout', {
          title: 'Checkout Page',
          items: cart.generateArray(),
          totalPriceAfterDiscount: totalPrice,
          totalDiscount: totalDiscount,
          actualPrice: cart.totalPrice,
          discountPercentage: discount.percentage,
          bodyClass: 'registration',
          containerWrapper: 'container'
        });
      } else {
        cart.discountPrice = 0;
        req.session.cart = cart;
        console.log(req.session.cart)
        res.render('checkout', {
          title: 'Checkout Page',
          items: cart.generateArray(),
          totalPrice: cart.totalPrice.toFixed(2),
          discountCode: discountCode,
          bodyClass: 'registration',
          containerWrapper: 'container',
          msg: "This discount code is not applicable"
        });
      }
    }
  })
})

/////////////////////////////////////////////////////////////////////
//
// checkout-process - checkout-success - checkout-cancel
// MIDDLEWARE - Handles POST & GET requests
//
// They are just middleware for paypal API. Nothing special about them
// Derived from https://github.com/paypal/PayPal-node-SDK
//
/////////////////////////////////////////////////////////////////////


router.post('/checkout-process', function(req, res) {
  let cart = new Cart(req.session.cart);
  let totalPrice = (req.session.cart.discountPrice > 0) ? req.session.cart.discountPrice : cart.totalPrice.toFixed(2);
  let items = cart.generateArray();
  /*var didPaymentSucceed = Math.random()

  //TODO: IMPLEMENT PAYMENT THROUGH PAYPAL
  //FOR NOW -randomly choose whether payment was approved or cancelled
  //redirect client to the success or cancel screens

  if (didPaymentSucceed >= 0.5) {
    //either of these two could work
    //res.render('checkoutSuccess', {title: 'Successful', containerWrapper: 'container', userFirstName: req.user.fullname})
    res.redirect(302, '/checkout/checkout-success')
  } else {
    //either of these two could work
    //res.render('checkoutCancel', {title: 'Successful', containerWrapper: 'container', userFirstName: req.user.fullname})
    res.redirect(302, '/checkout/checkout-cancel')
  }*/
  let create_payment_json = {
    "intent": "sale",
    "payer" : {
      "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/checkout/checkout-success",
        "cancel_url": "http://localhost:3000/checkout/checkout-cancel"
    },
    "transactions" : [{
      "item_list": {
            "items": [{
                "name": "item",
                "sku": "item",
                "price": "1.00",
                "currency": "CAD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "CAD",
            "total": totalPrice
        },
        "description": "This is a test payment."
    }]
  }
  create_payment_json.transactions[0].item_list.items = []; //clear items in json

	// Build the item objects to add to the create payment JSON
	for(let item of items){
		newItem = {};
		newItem.name = item.item.title;
		newItem.quantity = item.qty;
		newItem.price = item.item.price;
		newItem.sku = "item";
		newItem.currency = "CAD";
		create_payment_json.transactions[0].item_list.items.push(newItem);
	}

	create_payment_json.transactions[0].amount.total = totalPrice; //set transaction total

	console.log(create_payment_json);
	console.log(create_payment_json.transactions[0].amount.total);
	console.log(create_payment_json.transactions[0].item_list.items);

  paypal.payment.create(create_payment_json, function(error, payment){
    let links = {}; //maybe change this, is the variable supposed to be called links?
    if (error) {
      console.log("ERROR:" + error)
        throw error;

  }
  else {

			for(let link of payment.links){
				if(link.rel === 'approval_url'){
					console.log(payment)

					res.redirect(link.href); //link to payment approve page
				}
			}
		}

})
});

router.get('/checkout-success', ensureAuthenticated, function(req, res) {


  console.log(`ROUTE: GET CHECKOUT-SUCCESS`);

  	// Extract the ID's to excecute the payment
  	var paymentId = req.query.paymentId;
  	var payerId = { payer_id: req.query.PayerID };

  	// Excecute the prepared payment
  	paypal.payment.execute(paymentId, payerId, function(error, payment){
  		if(error){
  			console.error(JSON.stringify(error));
  		}
  		else {
  			// Empty the cart and reset the total price
  			req.session.cart = new Cart({});
  			var totalPrice = 0;

  			// Build the address string
  			addressObj = payment.payer.payer_info.shipping_address
  			addressString = `${addressObj.line1}, ${addressObj.city} ${addressObj.state} ${addressObj.country_code} ${addressObj.postal_code}`

  			// create the new order object
  			let newOrder = new Order({
  				orderID             : payment.cart,
  				username            : req.user.username,
  				address             : addressString,
  				orderDate           : payment.create_time,
  				shipping            : true
  			});
  			// save the object to the DB
  		   newOrder.save();
  			// Load the success screen
  			res.render('checkoutSuccess', {title: 'Successful', containerWrapper: 'container', userFirstName: req.user.fullname, email: req.user.username})
  		}
  	});

});

router.get('/checkout-cancel', ensureAuthenticated, function(req, res) {
  res.render('checkoutCancel', {
    title: 'Successful',
    containerWrapper: 'container',
    userFirstName: req.user.fullname
  });
});

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests for the buy now page
//
// This middleware works for in couple steps;
//      if there is no product in the shopping bag then creates a bag
//      then add to item in the bag then go to checkout page.
//
//      if there is a product in the shopping bag then add to selected
//      item in the bag then go to checkout page.
//
/////////////////////////////////////////////////////////////////////
router.get('/buy-now/:id', ensureAuthenticated, function(req, res, next) {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(e, product) {
    if (e) {
      console.log("Failed on router.get('/add-to-bag/:id')\nError:".error, e.message.error + "\n")
      e.status = 406;
      next(e);
    } else {
      if (product) {
        cart.add(product, product.id);
        cart.userId = req.user._id;
        req.session.cart = cart;
        res.render('checkout', {
          title: 'Checkout Page',
          items: cart.generateArray(),
          totalPrice: cart.totalPrice.toFixed(2),
          bodyClass: 'registration',
          containerWrapper: 'container'
        });
      } else {
        Variant.findById(productId, function(e, variant) {
          if (e) {
            console.log("Failed on router.get('/add-to-bag/:id')\nError:".error, e.message.error + "\n")
            e.status = 406;
            next(e);
          } else {
            Product.findById(variant.productID, function(e, p) {
              let color = (variant.color) ? "- " + variant.color : "";
              variant.title = p.title + " " + color
              variant.price = p.price
              cart.add(variant, variant.id);
              req.session.cart = cart;
              res.render('checkout', {
                title: 'Checkout Page',
                items: cart.generateArray(),
                totalPrice: cart.totalPrice.toFixed(2),
                bodyClass: 'registration',
                containerWrapper: 'container'
              });
            })
          }
        })
      }
    }
  })
});


/////////////////////////////////////////////////////////////////////
//
// Function decreaseInventory
//
// Decrease the inventory quantity whenever a customer buys an item.
//
/////////////////////////////////////////////////////////////////////
function decreaseInventory(cartItems, callback) {
  for (let item in cartItems) {
    let qty = cartItems[item].qty;
    console.log("QTY IS: ", qty)
    Product.getProductByID(item, function(e, p) {
      if (p) {
        Product.findOneAndUpdate({
          "_id": item
        }, {
          $set: {
            "quantity": p.quantity - qty,
          }
        }, {
          new: true
        }, function(e, result) {

        });
      } else {
        Variant.getVariantByID(item, function(e, v) {
          Variant.findOneAndUpdate({
            "_id": item
          }, {
            $set: {
              "quantity": v.quantity - qty,
            }
          }, {
            new: true
          }, function(e, result) {

          });
        });
      }
    });
  }

  return callback(true)
};

/////////////////////////////////////////////////////////////////////
//
// Function ensureAuthenticated()
//
// Check if the user authenticated or not. If not returns to login page
//
/////////////////////////////////////////////////////////////////////
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    Department.getAllDepartments(function(e, departments) {
      req.session.department = JSON.stringify(departments)
      return next();
    })
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/');
  }
};

module.exports = router;
