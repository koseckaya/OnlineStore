// @ts-nocheck
import visa from '../img/visa-credit-card.svg';
import master from '../img/mastercard.svg';
import americanExpress from '../img/american-express.svg';
import creditCard from '../img/credit.svg';

class Checkout {
    constructor () {}

    handleFocus = (e) => {
        const el = e.target
        el.parentNode.classList.add("focus");
    }
     handleBlur = (e) => {
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
        const creditCard = form?.querySelector('#card-number')
        const cvv = form?.querySelector('#card-cvv')
        const cardExpiry = form?.querySelector('#card-data')        
        const reEmail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
        
        if (name.value === "" || name.value.split(' ').length < 2 || name.value.split(' ').some(i => i.length < 3)) {
            name.closest('.input-box').classList.add("error")
        } else {
            name.closest('.input-box').classList.remove("error")
        }
    
        if (phone.value === "" || phone.value.length < 18) {
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

        if (creditCard.value === "" || !this.isValidCreditCard(creditCard.value)) {
            creditCard.closest('.input-box').classList.add("error")
        } else {
            creditCard.closest('.input-box').classList.remove("error")
        }
        if (!this.isExpireValid(cardExpiry.value)) {
            cardExpiry.closest('.input-box').classList.add("error")
        } else {
            cardExpiry.closest('.input-box').classList.remove("error")
        }
        if (cvv.value === "" || cvv?.value.length !== 3 ) {
            cvv.closest('.input-box').classList.add("error")
        } else {
            cvv.closest('.input-box').classList.remove("error")
        }
    }
    isExpireValid = (cardExpire) => {
        if (cardExpire === '' || cardExpire.length !== 5) {
            return false;
        }
        const year = +cardExpire.split('/')[1]
        if (year < 22) {
            return false;
        }
        return /(0[1-9]|1[012])\/(\d\d)/.test(cardExpire);
    }
    visaCard = (num) => {
        const cardnum = /^(?:4\d{3}\s\d{4}\s\d{4}\s\d{4})$/;
        return cardnum.test(num);
    }
    masterCard = (num) => {
        const cardnum = /^(?:5\d{3}\s\d{4}\s\d{4}\s\d{4})$/;
        return cardnum.test(num);
    }
    amexCard = (num) => {
        const cardnum = /^(?:3\d{3}\s\d{4}\s\d{4}\s\d{4})$/;
        return cardnum.test(num);
    }
    isValidCreditCard = (cardNumber) => {
        var cardType = null;
        if (this.visaCard(cardNumber)) {
            cardType = visa;
        } else if (this.masterCard(cardNumber)) {
            cardType = master;
        } else if (this.amexCard(cardNumber)) {
            cardType = americanExpress;
        }
        return cardType;
    }
    handlePhone = (e) => {
        let x = e.target.value
          .replace(/\D/g, "")
          .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2] ? x[1]
          : `+(${x[1]}) - ${x[2]}` + (!x[3] ? "" : ` - ${x[3]}`);
    }
    handleData = (e) => {
        let x = e.target.value
          .replace(/\D/g, "")
          .match(/(0[1-9]|1[012])(\d\d)/);
        console.log('x', e.target.value.replace(/\D/g, ""), x);
        if (x) {
            e.target.value = `${x[1]}\/${x[2]}`;
        }
    }
    handleCardNumber = (e) => {
        let x = e.target.value
         .replace(/\D/g, "")
          .match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
        e.target.value = `${x[1]} ${x[2]} ${x[3]} ${x[4]}`.trim();
        
        const image = document.querySelector('.input-image')
        
        switch (e.target.value[0]) {
            case '4':
                image?.setAttribute('src', visa);
                break;
            case '5':
                image?.setAttribute('src', master);
                break;
            case '3':
                image?.setAttribute('src', americanExpress);
                break;
            default: 
                image?.setAttribute('src', creditCard);
                break;
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

        const phone = form?.querySelector('#checkout-phone')
        phone?.addEventListener('input', this.handlePhone)
        const cardData = form?.querySelector('#card-data')
        cardData?.addEventListener('input', this.handleData)
        const cardNumber = form?.querySelector('#card-number')
        cardNumber?.addEventListener('input', this.handleCardNumber)

    }
    render = () => {
       
        const modal = document.querySelector('.modal')
        modal?.innerHTML = `
            <div class="checkout-container">
                <h2 class="checkout__title">Personal details</h2>
                <form class="checkout-form" id="form" autocomplete="off">
                    <div class='personal-data'>
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
                            
                    </div>
                     <div class='payment-data'>       
                        <div class="card-container">
                            <div class="input-box">
                                <label for="card-number" class="input-label">Card Number</label>
                                <img  class="input-image" src="${creditCard}">
                                <input class="checkout__input" id="card-number"
                                     name="card.number" type="tel" 
                                     autocomplete="off">
                            </div>
                            <div class="input-box">
                                <label for="card-data" class="input-label">Expiry (MM/YY)</label>
                                <input class="checkout__input" id="card-data" name="card.data" type="tel" autocomplete="off">
                            </div>
                            <div class="input-box">
                                <label for="card-number" class="input-label">CVV</label>
                                <input class="checkout__input" id="card-cvv" name="card.number" type="password" autocomplete="off">
                            </div>
                        </div>
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
