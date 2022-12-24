class Checkout {


    bind = () => {

    }
    render = () => {
        console.log('checkout');
        return `
            <div class="checkout-container">CHECKOUT</div>
        `
    }
    init = () => {
        this.bind();
    }
}

export default Checkout
