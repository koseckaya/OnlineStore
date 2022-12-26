// @ts-nocheck
class Checkout {
    constructor () {}

    handleFocus = (e) => {
        const el = e.target
        el.parentNode.classList.add("focus");
    }
     handleBlur = (e) => {
        // console.log('blur', e.target);
         const el = e.target
        if (el.value === '') {
            el.closest('.input-box').classList.remove("focus")
        } 
    }
    handleValidation = (e) => {
        e.preventDefault();
        const form = document.getElementById('form')
        const name = form?.querySelector('#checkout-name')
        const phone = form?.querySelector('#checkout-phone')
        const email = form?.querySelector('#checkout-email')
        const address = form?.querySelector('#checkout-address')
        const rePhone = /^[\d\+][\d\(\)\ -]{8,14}\d$/;
        const reEmail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
        
        if (name.value === "" || name.value.split(' ').length < 2 || name.value.split(' ').some(i => i.length < 3)) {
            name.closest('.input-box').classList.add("error")
        } else {
            name.closest('.input-box').classList.remove("error")
        }
    
        if (phone.value === "" || !rePhone.test(phone.value)) {
            phone.closest('.input-box').classList.add("error")
        } else {
            phone.closest('.input-box').classList.remove("error")
        }
             
        if (email.value === "" || !reEmail.test(email.value)) {
             email.closest('.input-box').classList.add("error")
        } else {
            email.closest('.input-box').classList.remove("error")
        }
                    
        if (address.value === "" || address.value.split(' ').length < 3 || address.value.split(' ').some(i => i.length < 5)) {
            address.closest('.input-box').classList.add("error")
        } else {
            address.closest('.input-box').classList.remove("error")
        }
    }

    bind = () => {
        const inputs = document.querySelectorAll('.checkout__input ')
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('focus', this.handleFocus)
            inputs[i].addEventListener('blur', this.handleBlur)
        }

        const form = document.getElementById('form')
        form?.addEventListener('submit', this.handleValidation)

    }
    render = () => {
       
        const modal = document.querySelector('.modal')
        modal?.innerHTML = `
            <div class="checkout-container">
                <h2 class="checkout__title">Personal details</h2>
                <form class="checkout-form" id="form" autocomplete="off">
                <div class="input-box">
                    <label for="checkout-name" class="input-label">First name and Last name</label>
                    <input class="checkout__input" id="checkout-name" name="checkout.name" type="text" autocomplete="off">
                </div>
                <div class="input-box">
                    <label for="checkout-phone" class="input-label">Phone number</label>
                    <input class="checkout__input" id="checkout-phone" max='13' min='9' name="checkout.phone" type="tel" autocomplete="off">
                </div>
                <div class="input-box">
                    <label for="checkout-email" class="input-label">E-mail address</label>
                    <input class="checkout__input" id="checkout-email" name="checkout.email" type="email" autocomplete="off" >
                </div>
                <div class="input-box">
                    <label for="checkout-address" class="input-label">Delivery address</label>
                    <input class="checkout__input" id="checkout-address" name="checkout.address" type="text" autocomplete="off" >
                </div>    
                    <button class="btn btn-checkout">Buy now</button>
                </form>
            </div>
        `
        
    }
    init = () => {
        this.render();
        this.bind();
    }
}

export default Checkout
