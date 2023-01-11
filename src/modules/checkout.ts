//@ts-nocheck
import { CheckoutInterface, storageItem } from '../pages/types';
import { isValidCreditCard, isExpireValid, phoneNumberFormat, dataFormat } from '../helpers/validation'
import { setUrlParams } from '../helpers/url';

const visa = require('../img/visa-credit-card.svg') as string
const master = require('../img/mastercard.svg') as string
const americanExpress = require('../img/american-express.svg') as string
const creditCard = require('../img/credit.svg') as string

class Checkout implements CheckoutInterface {
    isValid: boolean = true
    constructor() { }

    handleFocus = (e: FocusEvent): void => {
        const target = e.target as HTMLInputElement;
        if (target && target.parentNode) {
            (target.parentNode as HTMLElement).classList.add("focus");
        }
    }
    handleBlur = (e: FocusEvent): void => {
        const el = e.target as HTMLInputElement;
        if (el && el.value === '') {
            const closestEl = el.closest('.input-box');
            if (closestEl) {
                closestEl.classList.remove('focus');
            }
        }
    }
    handleSubmit = (e: Event): void => {
        if (!this.isFormValid(e)) return;

        const result = this.sendDataToBack()
        const button = document.querySelector('.btn-modal') as HTMLButtonElement;
        button.style.backgroundColor = 'rgb(4, 123, 8)';

        result.then((res) => {
            localStorage.removeItem('fullCart')
            const container = document.querySelector('.checkout-container') as HTMLDivElement;
            container.innerHTML = ''
            container.innerHTML = '<div>Thanks for the order. Our manager will contact you</div>'
            setTimeout(() => {
                const modalEl = document.querySelector('.modal')
                if (modalEl) modalEl.innerHTML = ''
                const containerEl = document.querySelector('.modal-container');
                if (containerEl) {
                    containerEl.removeEventListener('click', this.closeModal)
                    containerEl.classList.remove('show')

                }
                window.location.href = 'index.html'
            }, 1000)
        })
            .catch(e => console.log('error', e))
            .finally(() => button.disabled = false)

    }
    isFormValid = (e: Event): boolean => {
        e.preventDefault();
        this.isValid = true;
        const form = document.getElementById('form')
        const name = form?.querySelector('#checkout-name') as HTMLInputElement
        const phone = form?.querySelector('#checkout-phone') as HTMLInputElement
        const email = form?.querySelector('#checkout-email') as HTMLInputElement
        const address = form?.querySelector('#checkout-address') as HTMLInputElement
        const creditCard = form?.querySelector('#card-number') as HTMLInputElement
        const cvv = form?.querySelector('#card-cvv') as HTMLInputElement
        const cardExpiry = form?.querySelector('#card-data') as HTMLInputElement
        const reEmail: RegExp = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;

        name.value === "" || name.value.split(' ').length < 2 || name.value.split(' ').some(i => i.trim().length < 3) ?
            this.setInvalid(name) :
            this.setValid(name)

        phone.value === "" || phone.value.length < 18 ?
            this.setInvalid(phone) :
            this.setValid(phone)

        email.value === "" || !reEmail.test(email.value) ?
            this.setInvalid(email) :
            this.setValid(email)

        address.value === "" || address.value.split(' ').length < 3 || address.value.split(' ').some(i => i.length < 5) ?
            this.setInvalid(address) :
            this.setValid(address)

        creditCard.value === "" || !isValidCreditCard(creditCard.value) ?
            this.setInvalid(creditCard) :
            this.setValid(creditCard);

        (!isExpireValid(cardExpiry.value)) ?
            this.setInvalid(cardExpiry) :
            this.setValid(cardExpiry)

        isNaN(Number(cvv.value)) || Number(cvv.value) < 100 || Number(cvv.value) > 999 ?
            this.setInvalid(cvv) :
            this.setValid(cvv)

        return this.isValid;
    }
    setInvalid = (field: HTMLInputElement): void => {
        const closestEl = field.closest('.input-box')
        if (closestEl) closestEl.classList.add("error")
        this.isValid = false
    }
    setValid = (field: HTMLInputElement): void => {
        const closestEl = field.closest('.input-box')
        if (closestEl) closestEl.classList.remove("error")
    }
    sendDataToBack = (): Promise<storageItem[]> => {
        const result = new Promise<storageItem[]>((res, rej) => {
            const fullCart = localStorage.getItem('fullCart');
            if (fullCart) {
                let arr: storageItem[] = JSON.parse(fullCart)
                setTimeout(() => {
                    res(arr)
                }, 1000)
            }
        });
        return result;
    }
    handlePhone = (e: Event): void => {
        if (e.target) {
            let x = (e.target as HTMLInputElement).value
            if (x) (e.target as HTMLInputElement).value = phoneNumberFormat(x)
        }
    }
    handleCvv = (e: Event): void => {
        let x = e.target.value[e.target.value.length - 1]
            if (/^\d*\.?\d*$/.test(x) && e.target.value.length < 4) {
                return x
            } else {
                return e.target.value = e.target.value.slice(0, -1)
            }
    }
    handleData = (e: Event): void => {
        const target = e.target as HTMLInputElement;
        if (target) {
            let x = dataFormat(target.value);
            if (x) (e.target as HTMLInputElement).value = x
        }
    }
    handleCardNumber = (e: Event): void => {
        let x = (e.target as HTMLInputElement).value
            .replace(/\D/g, "")
            .match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
        if (x) (e.target as HTMLInputElement).value = `${x[1]} ${x[2]} ${x[3]} ${x[4]}`.trim();

        const image = document.querySelector('.input-image')
        if (e.target) {
            switch ((e.target as HTMLInputElement).value[0]) {
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
    }

    closeModal = (e: Event): void => {
        if (e.target == document.querySelector('.modal-container')) {
            (document.querySelector('.modal') as HTMLDivElement).innerHTML = ''
            if (e.target) (e.target as HTMLElement).classList.remove('show')
            setUrlParams({});
        }
    }
    unbind = (): void => {
        document.querySelector('.modal-container')?.removeEventListener('click', this.closeModal)
    }

    bind = (): void => {
        const modalContainer = document.querySelector('.modal-container')
        if (modalContainer) {
            modalContainer?.classList.add('show')
            modalContainer.addEventListener('click', this.closeModal);
        }
        const inputs = document.querySelectorAll('.checkout__input ')
        for (let i = 0; i < inputs.length; i++) {
            const element = inputs[i] as HTMLSelectElement;
            element.addEventListener('focus', this.handleFocus)
            element.addEventListener('blur', this.handleBlur)
        }

        const form = document.getElementById('form')
        form?.addEventListener('submit', this.handleSubmit)

        const phone = form?.querySelector('#checkout-phone')
        phone?.addEventListener('input', this.handlePhone)
        const cardData = form?.querySelector('#card-data')
        cardData?.addEventListener('input', this.handleData)
        const cardNumber = form?.querySelector('#card-number')
        cardNumber?.addEventListener('input', this.handleCardNumber)
        const cardCvv = form?.querySelector('#card-cvv')
        cardCvv?.addEventListener('input', this.handleCvv)
        // cardCvv?.addEventListener('paste', (e) => {
        //     console.log('paste');
        //     if (!(/^\d*\.?\d*$/.test(e.target.value))) {
        //         console.log('paste2');
        //         return e.target.value = ''
        //     }
        // })
        
    }
    render = () => {

        const modal = document.querySelector('.modal')
        if (modal) modal.innerHTML = `
            <div class="checkout-container">
                <h2 class="checkout__title">Personal details</h2>
                <form class="checkout-form" id="form" autocomplete="off">
                    <div class='personal-data'>
                        <div class="input-box">
                            <label for="checkout-name" class="input-label">First name and Last name</label>
                            <div class="info">
                                <div class="info__i">i</div>
                                <div class="info__desc">Contains at least two words, each at least 3 characters</div>
                            </div>
                            <input class="checkout__input" id="checkout-name" name="checkout.name" type="text" autocomplete="off">
                        </div>
                        <div class="input-box">
                            <label for="checkout-phone" class="input-label">Phone number</label>
                            <div class="info">
                                <div class="info__i">i</div>
                                <div class="info__desc">Numbers only and be at least 9 characters</div>
                            </div>
                            <input class="checkout__input" id="checkout-phone" max='13' min='9' name="checkout.phone" type="tel" autocomplete="off">
                        </div>
                        <div class="input-box">
                            <label for="checkout-email" class="input-label">E-mail address</label>
                            <input class="checkout__input" id="checkout-email" name="checkout.email" type="email" autocomplete="off" >
                        </div>
                        <div class="input-box">
                            <label for="checkout-address" class="input-label">Delivery address</label>
                             <div class="info">
                                <div class="info__i">i</div>
                                <div class="info__desc">Contains at least three words, each at least 5 characters </div>
                            </div>
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
                     <button class="btn btn-modal">Buy now</button>
                </form>
            </div>
        `
    }
    init = () => {
        this.unbind();
        this.render();
        this.bind();
    }
}

export default Checkout
