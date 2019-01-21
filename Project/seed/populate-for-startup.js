var User        = require('../models/user');
var Category    = require('../models/categories');
var Department  = require('../models/department');
var Product     = require('../models/product');
var Variant     = require('../models/variant');
var mongoose    = require('mongoose');
//mongoose.connect('mongodb://localhost/shoppingApp');
//mongoose.connect('mongodb://localhost/myShoppingApp3', { useNewUrlParser: true, useCreateIndex: true, });
mongoose.connect('mongodb://localhost/myShoppingApp3');


var categories =
[
    new Category({
        categoryName        : 'Vanilla'
    }),
    new Category({
        categoryName        : 'Chocolate'
    }),
    new Category({
        categoryName        : 'Crazy'
    }),
    new Category({
        categoryName        : 'Basics'
    }),

]

for (let i = 0; i < categories.length; i++){
    categories[i].save(function(e, r) {
        if (i === categories.length - 1){
            exit();
        }
    });
}

var departments =
[
    new Department({
        departmentName      : 'Birthdays',
        categories          : 'Crazy Cakes, Vanilla, Chocolate'

    }),
    new Department({
        departmentName      : 'Any Occasion',
        categories          : 'Basics, Vanilla, Chocolate'
    })
]

for (let i = 0; i < departments.length; i++){
    departments[i].save(function(e, r) {
        if (i === departments.length - 1){
            exit();
        }
    });
}

var products =
[
    new Product({
        _id: "5bedf31cc14d7822b39d9d43",
        imagePath: '/images/Bubblegum.jpg',
        title: 'BubbleGum Vanilla',
        description: 'Edible bubble ornament. Sweet flavours inspired by the classic Hubba Bubba Bubblegum',
        price: 6.95,
        color: 'Pink',
        size: 'Single',
        quantity: 10,
        department: 'Birthdays',
        category: 'Crazy',
    }),
    new Product({
        _id: "5bedf3b9c14d7822b39d9d45",
        imagePath: '/images/Cherryblast.jpg',
        title: 'Cherry Blaster',
        description: 'Vanilla base with subtle flavours of cherry.',
        price: 4.99,
        color: 'Red',
        size: 'Single',
        quantity: 15,
        department: 'Any Occasion',
        category: 'Vanilla',
    }),
    new Product({
        _id: "5bedf448c14d7822b39d9d47",
        imagePath: '/images/Fairy.jpg',
        title: 'Silver Fairy',
        description: 'Blend of vanilla and raspberry for base. ',
        price: 4.99,
        color: 'Silver',
        size: 'Single',
        quantity: 30,
        department: 'Birthdays',
        category: 'Vanilla',
    }),
    new Product({
        _id: "5bedf55bc14d7822b39d9d4b",
        imagePath: '/images/ChocolateAvenger.jpg',
        title: 'Chocolate Avenger',
        description: 'Chocolatey goodness.',
        price: 6.99,
        color: 'Brown',
        size: 'Single',
        quantity: 4,
        department: 'Birthdays',
        category: 'Chocolate',
    }),
    new Product({
        _id: "5bedf5eec14d7822b39d9d4e",
        imagePath: '/images/Funfetti.jpg',
        title: 'Funfetti',
        description: 'Chocolate base with sprinkles and m&ms on top.',
        price: 6.99,
        color: 'Rainbow',
        size: 'Single',
        quantity: 30,
        department: 'Birthdays',
        category: 'Chocolate',
    }),
    new Product({
        _id: "5bedf6b5c14d7822b39d9d51",
        imagePath: '/images/Matcha.jpg',
        title: 'Matcha Green Tea',
        description: 'Matcha flavoured cupcake.',
        price: 7.99,
        color: 'Green',
        size: 'Single',
        quantity: 10,
        department: 'Any Occasion',
        category: 'Basics',
    }),
    new Product({
        _id: "5bedf720c14d7822b39d9d52",
        imagePath: '/images/PinaColada.jpg',
        title: 'Pina Colada',
        description: 'Coconut and pineapple, like the popular beverage.',
        price: 10.99,
        color: 'Yellow',
        size: 'Single',
        quantity: 8,
        department: 'Any Occasion',
        category: 'Basics',
    }),
    new Product({
        _id: "5bedf7ecc14d7822b39d9d55",
        imagePath: '/images/Party.jpg',
        title: 'Its a Party!',
        description: 'Extravagent.',
        price: 10.99,
        color: 'Rainbow',
        size: 'Single',
        quantity: 12,
        department: 'Birthdays',
        category: 'Crazy',
    }),
    new Product({
        _id: "5bedf7ecc14d7822b39d9d66",
        imagePath: '/images/Lemonade.jpg',
        title: 'Iced Tea Lemonade',
        description: 'Lemony notes.',
        price: 5.99,
        color: 'Yellow',
        size: 'Single',
        quantity: 12,
        department: 'Any Occasion',
        category: 'Basics',
    }),
    new Product({
        _id: "5bedf7ecc14d7822b39d9d77",
        imagePath: '/images/Oreo.jpg',
        title: 'Oreo Explosion',
        description: 'Oreo + cupcakes = Heaven.',
        price: 10.99,
        color: 'Brown',
        size: 'Single',
        quantity: 12,
        department: 'Any Occasion',
        category: 'Chocolate',
    }),
    new Product({
        _id: "5bedf7ecc14d7822b39d9d88",
        imagePath: '/images/Galaxy.jpg',
        title: 'Galaxy',
        description: 'Taste the universe.',
        price: 7.99,
        color: 'Rainbow',
        size: 'Single',
        quantity: 12,
        department: 'Birthdays',
        category: 'Crazy',
    })
];

for (let i = 0; i < products.length; i++){
    products[i].save(function(e, r) {
        if (i === products.length - 1){
            exit();
        }
    });
}


var variants =
[
    new Variant({
        productID: '5bedf31cc14d7822b39d9d43',
        imagePath: '/images/Bubblecake.jpg',
        color: 'Full Size',
        size: 'Cake',
        price: 30.99,
        quantity: 5,
    })

];

for (let i = 0; i < variants.length; i++){
    variants[i].save(function(e, r) {
        if (i === variants.length - 1){
            exit();
        }
    });
}

var newUser = new User({
    username    : 'admin@admin.com',
    password    : 'admin',
    fullname    : 'Yasmeen Joumaa',
    admin       : true
});
User.createUser(newUser, function(err, user){
    if(err) throw err;
    console.log(user);
});

function exit() {
    mongoose.disconnect();
}
