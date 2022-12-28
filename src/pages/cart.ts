// @ts-nocheck
import Checkout from "../modules/checkout";

class Cart {
    checkoutModule = null;
    constructor () {
        
    }
    
    openCheckout = () => {
        if (!this.checkoutModule) {
            this.checkoutModule = new Checkout();
        }
        this.checkoutModule.init();
    }
    bind = () => {
        const checkout = document.querySelector('.btn-checkout')
        checkout?.addEventListener('click', this.openCheckout)
    }
    render = () => {
        
        return `<h1>Cart</h1>
        <div>Product1</div>
        <div>Product2</div>
        <div>Product3</div>
        <button class="btn btn-checkout">checkout</button>
        <p>Go to <a href="./">Main</a></p>
        `
    }
}

export default Cart