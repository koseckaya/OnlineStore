// @ts-nocheck
import Checkout from "../modules/checkout";

class Cart {
    constructor () {
        
    }
    
    openCheckout = () => {
        console.log('openCheckout');
        // const CheckoutModule = new Checkout();
        // CheckoutModule.init();
        
    }
    bind = () => {
        const checkout = document.querySelector('.btn-checkout')
        checkout?.addEventListener('click', this.openCheckout)

    }
    render = () => {
        const CheckoutModule = new Checkout();
        CheckoutModule.init();
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