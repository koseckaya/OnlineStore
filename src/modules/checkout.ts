// @ts-nocheck
class Checkout {
    constructor () {}

    bind = () => {

    }
    render = () => {
       
        
        console.log('windowInnerHeight',windowInnerWidth);
        const modal = document.querySelector('.modal')
        modal?.innerHTML = `
            <div class="checkout-container">Checkout</div>
        `
        
    }
    init = () => {
        this.render();
        this.bind();
    }
}

export default Checkout
