// cart backbone

module.exports = class Cart
{
    constructor(oldCart)
    {
        this.items = oldCart.items || {};
        this.totalQty = oldCart.totalQty || 0;
        this.totalPrice = oldCart.totalPrice || 0;
        this.discountPrice = oldCart.discountPrice || 0;
        this.userId = oldCart.userId || "";
    }

    add(item, id) //adds item to cart
    {
        let storedItem = this.items[id];
        if (!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;

    }

    decreaseQty(id) //decreases the quantity of the item in the cart
    {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price


        if(this.items[id].qty <= 0) {
            delete this.items[id];
        }
    }

    increaseQty(id) //increases quantity of item in cart
    {
        this.items[id].qty++;
        this.items[id].price += this.items[id].item.price;
        this.totalQty++;
        this.totalPrice += this.items[id].item.price

    }

    generateArray()
    {
        let arr = [];
        for (let id in this.items) {
            arr.push(this.items[id])
        }
        return arr;
    }
}
