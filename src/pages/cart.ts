// @ts-nocheck
import Checkout from "../modules/checkout";
import { getUrlParams } from '../helpers/utils';
import { items, categories } from "../data";
import { ModuleInterface } from "./types";

class Cart implements ModuleInterface {
    checkoutModule = null;
    pageNow = 0;
    itemsPerPage = 4;
    available = 10;
    constructor() {

    }

    createProductDiv = () => {
        let string = ``;
        let array1 = [];
        if (localStorage.getItem('fullCart')) {
            let productsInLocalStorage = JSON.parse(localStorage.getItem('fullCart'));
            productsInLocalStorage.forEach((el, index) => {
                let { id, amount, size } = el
                string = `<div class="product-cart" id="${id}" size="${size}">
                        <div class="product-cart__number">${index + 1}</div>
                        <div class="product-cart__image-div">
                            <img class="product-cart-image" src="${items[id].url[0]}" alt="product-image">
                        </div>
                        <div class="product-cart__card-info">
                            <h2 class="product-cart-name">${items[id].name}</h2>
                            <div class="product-cart-brand">${items[id].brand}</div>
                            <div class="product-cart-type">${items[id].type}</div>
                        </div>
                        <div class="product-cart__picked-color">
                            <img class="picked-color-image" src="${items[id].url[1]}"></img>
                            <div class="picked-color-name">${items[id].colorHTML}</div>
                        </div>
                        <div class="counter-section">
                            <div class="counter" data-counter1>
                                <div class="counter__button counter__button-minus">-</div>
                                <div class="counter__input"><input type="text" disabled placeholder="${amount}" value="${amount}"></div>
                                <div class="counter__button counter__button-plus">+</div>
                            </div>
                            <div class="available">
                                Available: ${this.available - el.amount}
                            </div>
                        </div>
                        <div class="product-cart__picked-size">
                            Size: ${size}
                        </div>
                        <div class="product-cart__price">
                            <span>Price:</span>
                            <span class="span-price-cart">$${amount * items[id].price} </span>
                        </div>
                        <div class="product-cart__trash-bin">
                        <span class="trash">
                                <span></span>
                                <i></i>
                        </span>
                        </div>
                      </div>`
                array1.push(string);
            });
        }
        return array1.join('');
    }
    openCheckout = () => {
        if (!this.checkoutModule) {
            this.checkoutModule = new Checkout();
        }
        this.checkoutModule.init();
    }
    visibleItems = () => {
        if (this.pageNow !== 0) {
            document.querySelectorAll('.product-cart').forEach((el, index) => {
                let start = this.pageNow * this.itemsPerPage;
                let end = start + this.itemsPerPage;
                if (!(index > start - 1 && index < end)) {
                    el.style.display = `none`;
                } else el.style = ``;
            });
        } else {
            document.querySelectorAll('.product-cart').forEach((el, index) => {
                let start = 0;
                let end = this.itemsPerPage;
                if (!(index > start - 1 && index < end)) {
                    el.style.display = `none`;
                } else el.style = ``;
            });
        }
    }
    bind = () => {
        const urlParams = getUrlParams()

        urlParams.has('method')
        if (urlParams.has('method') && urlParams.get('method') === 'buynow') {
            this.openCheckout()
        }

        const checkout = document.querySelector('.btn-checkout')
        checkout?.addEventListener('click', this.openCheckout)

        this.visibleItems();
        if (document.querySelectorAll('.product-cart__trash-bin')) {
            let trashBinButtons = document.querySelectorAll('.product-cart__trash-bin');
            trashBinButtons.forEach((el) => el.addEventListener('click', (e) => {
                let productsInLocalStorage = JSON.parse(localStorage.getItem('fullCart'));
                let parent = e.target.closest('.product-cart');
                let parentId = parent.getAttribute('id');
                let parentSize = parent.getAttribute('size');
                let neededItem = productsInLocalStorage.filter((el, _index) => +(el.id) === +(parentId) && el.size === parentSize);
                let idOfNeededItem = productsInLocalStorage.indexOf(neededItem[0]);
                let deletedItem = productsInLocalStorage.splice(idOfNeededItem, 1);
                localStorage.setItem('fullCart', `${JSON.stringify(productsInLocalStorage)}`);
                let amount = JSON.parse(localStorage.getItem('fullCart')).length;
                let total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                document.querySelector('.cart-span-total')?.innerHTML = `$${total} USD`;
                document.querySelector('.cart-span-amount')?.innerHTML = `${amount}`;
                document.querySelector('.cart-products')?.removeChild(parent);
                document.querySelector('.cart-amount')?.innerHTML = `${productsInLocalStorage.length}`;
                document.querySelectorAll('.product-cart__number').forEach((el, index) => el.innerHTML = `${index + 1}`);
                let arrayOfProductCart = document.querySelectorAll('.product-cart');
                document.querySelectorAll('.product-cart').forEach((_el, _index) => {
                    if (!Array.from(arrayOfProductCart).some(el => el.getAttribute('style') === '')) {
                        this.pageNow -= 1;
                        document.getElementById('output').innerText = this.pageNow + 1;
                        this.visibleItems()
                    };
                    this.visibleItems()
                });
            }))
        }
        let counters = document.querySelectorAll('[data-counter1]');
        if (counters) {
            counters.forEach(counter => {
                counter.addEventListener('click', e => {
                    const target = e.target;
                    const parent = target.closest('.product-cart');
                    const parentId = +(parent.getAttribute('id'));
                    const parentSize = parent.getAttribute('size');
                    if (target.closest('.counter__button')) {
                        if (target.closest('.counter').querySelector('input').value == '' && (target.classList.contains('counter__button-minus') || target.classList.contains('counter__button-plus'))) {
                            target.closest('.counter').querySelector('input').value = 1;
                        }

                        let value = parseInt(target.closest('.counter').querySelector('input').value);

                        if (target.classList.contains('counter__button-plus') && value < this.available) {
                            let productsInLocalStorage = JSON.parse(localStorage.getItem('fullCart'));
                            value++;
                            productsInLocalStorage.forEach(el => {
                                if (parentId === el.id && parentSize === el.size) {
                                    el.amount = value
                                }
                            })
                            localStorage.setItem('fullCart', `${JSON.stringify(productsInLocalStorage)}`);
                            let amount = JSON.parse(localStorage.getItem('fullCart')).length;
                            let total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                            document.querySelector('.cart-span-total')?.innerHTML = `$${total} USD`;
                            document.querySelector('.cart-total-amount')?.innerHTML = `${amount}`;
                            target.closest('.counter').querySelector('input').value = value;
                            parent.querySelector('.span-price-cart').innerHTML = `$${items[parentId].price * value}`;
                            let available = parent.querySelector('.available');
                            available.innerHTML = `Available: ${this.available - value}`

                        } else if (target.classList.contains('counter__button-minus') && value === 1) {
                            let productsInLocalStorage = JSON.parse(localStorage.getItem('fullCart'));
                            let neededItem = productsInLocalStorage.filter((el, _index) => +(el.id) === +(parentId) && el.size === parentSize);
                            let idOfNeededItem = productsInLocalStorage.indexOf(neededItem[0]);
                            productsInLocalStorage.splice(idOfNeededItem, 1);
                            localStorage.setItem('fullCart', `${JSON.stringify(productsInLocalStorage)}`);
                            document.querySelector('.cart-products')?.removeChild(parent);
                            let amount = JSON.parse(localStorage.getItem('fullCart')).length;
                            let total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                            document.querySelector('.cart-span-total')?.innerHTML = `$${total} USD`;
                            document.querySelector('.cart-span-amount')?.innerHTML = `${amount}`;
                        } else if (target.classList.contains('counter__button-minus') && value > 1) {
                            let productsInLocalStorage = JSON.parse(localStorage.getItem('fullCart'));
                            value--;
                            productsInLocalStorage.forEach(el => {
                                if (parentId === el.id && parentSize === el.size) {
                                    el.amount = value
                                }
                            })
                            localStorage.setItem('fullCart', `${JSON.stringify(productsInLocalStorage)}`);
                            let amount = JSON.parse(localStorage.getItem('fullCart')).length;
                            let total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                            document.querySelector('.cart-span-total')?.innerHTML = `$${total} USD`;
                            document.querySelector('.cart-span-amount')?.innerHTML = `${amount}`;
                            target.closest('.counter').querySelector('input').value = value;
                            parent.querySelector('.span-price-cart').innerHTML = `$${items[parentId].price * value}`;
                            let available = parent.querySelector('.available');
                            available.innerHTML = `Available: ${this.available - value}`

                        }
                        if (localStorage.getItem('fullCart')) {
                            let productsInLocalStorage = JSON.parse(localStorage.getItem('fullCart'));
                            document.querySelector('.cart-amount')?.innerHTML = `${productsInLocalStorage.length}`;
                        }
                        document.querySelectorAll('.product-cart__number').forEach((el, index) => el.innerHTML = `${index + 1}`)
                        target.closest('.counter').querySelector('input').value = value;
                        let arrayOfProductCart = document.querySelectorAll('.product-cart');
                        document.querySelectorAll('.product-cart').forEach((_el, _index) => {
                            if (!Array.from(arrayOfProductCart).some(el => el.getAttribute('style') === '')) {
                                this.pageNow -= 1;
                                document.getElementById('output').innerText = this.pageNow + 1;
                                this.visibleItems()
                            };
                            this.visibleItems()
                        });
                    }
                })
            }
            )
        }

        let nextPage = document.querySelector("#add");
        let previousPage = document.querySelector("#subtract");

        nextPage.addEventListener("click", () => {
            let productsInLocalStorage = JSON.parse(localStorage.getItem('fullCart'));
            let pages = Math.ceil(productsInLocalStorage.length / this.itemsPerPage);
            if (this.pageNow < pages - 1) {
                this.pageNow += 1
                add?.classList.remove('disabled');
            } else {
                add?.classList.add('disabled');
            }
            let output = document.querySelector("#output");
            output.innerText = this.pageNow + 1;
            this.visibleItems()
        });

        previousPage.addEventListener("click", () => {
            if (this.pageNow >= 1) {
                this.pageNow -= 1
                add?.classList.add('disabled');
                let output = document.querySelector("#output");
                output.innerText = this.pageNow + 1;
                this.visibleItems()
            }
        });

        const promoField = document.querySelector('.form__field');
        const promoLabel = document.querySelector('.form__label');
        const discountsUl = document.querySelector('.discounts-ul');
        const promoValue = {
            dope1: 5,
            dope2: 10,
            dope3: 15,
        }
        const promoBtn = document.querySelector('.promo-btn');
        const arrOfAddedPromo = [];
        promoBtn?.addEventListener('click', () => {
            if (promoField.value in promoValue && !arrOfAddedPromo.includes(promoValue[promoField.value]) ) {
                promoBtn.style.background = `green`;
                promoLabel.style.color = `green`; 
                let elementLi = document.createElement('li');
                elementLi.classList.add('discount-li');
                elementLi.setAttribute('discount', promoValue[promoField.value]);
                elementLi.innerHTML = `${promoField.value}<span style="margin-left: auto;">-${promoValue[promoField.value]}%</span><span style="display: flex;
                justify-content: center;
                align-items: center;
                padding-left: 5px; cursor: pointer;"><svg class="delete-discount" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16"> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path> </svg></span>`
                let total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                arrOfAddedPromo.push(promoValue[promoField.value]);
                let discount;
                if (arrOfAddedPromo.length > 0 ) {
                  discount = arrOfAddedPromo.reduce((a,b) => a + b)/100 * total;
                } else discount = 0;
                let newValue = Math.round(total - discount);
                let spanTotal = document.querySelector('.cart-span-total');
                spanTotal?.innerHTML = `<span style='color: green;'>$${newValue} USD</span> <span style='text-decoration: line-through; color: grey;'>$${total} USD</span>`
                discountsUl?.appendChild(elementLi);
                elementLi.addEventListener('click', (e) => {
                    if (e.target.closest('.delete-discount')) {
                        let discount = Number(e.target.closest('.discount-li').getAttribute('discount'));
                        let indexOfDiscount = arrOfAddedPromo.indexOf(discount);
        
                        if (arrOfAddedPromo.length > 1 ) {
                            arrOfAddedPromo.splice(indexOfDiscount, 1);
                            discount = arrOfAddedPromo.reduce((a,b) => a + b)/100 * total;
                            newValue = Math.round(total - discount);
                            spanTotal?.innerHTML = `<span style='color: green;'>$${newValue} USD</span> <span style='text-decoration: line-through; color: grey;'>$${total} USD</span>`
                            discountsUl?.removeChild(elementLi);
                        } else {
                            discount = 0;
                            arrOfAddedPromo.splice(indexOfDiscount, 1);
                            newValue = Math.round(total - discount);
                            spanTotal?.innerHTML = `<span>$${total} USD</span>`
                            discountsUl?.removeChild(elementLi);
                        }
            
                    }
                })
                let deletedValue = setInterval(() => {
                    if (promoField.value.length === 0) {
                        clearInterval(deletedValue);
                        promoBtn.removeAttribute('style');
                        promoLabel?.removeAttribute('style');
                    }
                    promoField.value = promoField.value.slice(0, promoField.value.length - 1);
                }, 175)
            } else if (arrOfAddedPromo.includes(promoValue[promoField.value])){
                let neededItem = Array.from(document.querySelectorAll('.discount-li'));
                let filteredItemIndex = neededItem.filter((el) => +(el.getAttribute('discount')) === +(promoValue[promoField.value]));
                let indexOf = neededItem.indexOf(filteredItemIndex[0]);
                if (filteredItemIndex.length > 0) {
                    promoBtn.style.pointerEvents = 'none';
                    document.querySelectorAll('.discount-li')[indexOf].style.animationName = 'horizontal';
                    document.querySelectorAll('.discount-li')[indexOf].style.animationDuration = '1.5s';
                    setTimeout(() => {
                        document.querySelectorAll('.discount-li')[indexOf].removeAttribute('style');
                        promoBtn.removeAttribute('style');
                    }, 700)
                }
            } else {
                promoBtn.style.background = `red`;
                promoLabel.style.color = `red`;  
                let formLabel = document.querySelector('.form__field');
                let deletedValue = setInterval(() => {
                    if (promoField.value.length === 0) {
                        formLabel?.removeAttribute('style');
                        clearInterval(deletedValue);
                        promoBtn.removeAttribute('style');
                        promoLabel?.removeAttribute('style');
                    }
                    if (promoField.value.length > 0) {
                        formLabel.style = `border-image: linear-gradient(to right, red, #ffd199) 100% / 1 / 0 stretch;
                    border-width: 3px;
                    border-image-slice: 1;`
                    }
                    promoField.value = promoField.value.slice(0, promoField.value.length - 1);
                }, 175)
            }
        })

        const limitSelect = document.querySelector('.cart-limit');
        const productCart = document.querySelectorAll('.product-cart');
        limitSelect.addEventListener('change', (e) => {
            let limitValue = +(e.target.value)
            this.itemsPerPage = limitValue;
            this.visibleItems();
            if (limitValue === 3) {
                productCart.forEach((el) => el.classList.add('padding'));
            } else {
                productCart.forEach((el) => el.classList.remove('padding'));
            }
        })
    }
    render = () => {
        let amount = JSON.parse(localStorage.getItem('fullCart')).length;
        let total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
        return `<div class="cart-header">
            <div class="pages">
                <span>Pages: </span>
                <div class="counter-pagination">
                    <button id="subtract"><svg id="left-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6.028 0v6.425l5.549 5.575-5.549 5.575v6.425l11.944-12z"/></svg></button>
                        <span id="output">1</span>
                    <button id="add"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6.028 0v6.425l5.549 5.575-5.549 5.575v6.425l11.944-12z"/></svg></button>
                </div>
            </div>
            <div class="visible-items">
                <span>Visible items per page: </span>
                <div class="cart-limit-select">
                    <select class="cart-limit">
                        <option class="limit-option">4</option>
                        <option class="limit-option">3</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="cart-products-container">
            <div class="cart-products">
                ${this.createProductDiv()}
            </div>
            <div class="cart-total"> 
                <div class="cart-total__cash">
                    <span>Total:</span><span class="cart-span-total">$${total} USD</span>
                </div>
                <div class="cart-total__amount">
                    <span>Products in cart:</span><span class="cart-span-amount">${amount}</span>
                </div>
                <div class="form__group field">
                    <input type="input" class="form__field" placeholder="Promo" name="Promo" id='Promo' required />
                    <label for="Promo" class="form__label">Discount code</label>
                    <button class="promo-btn"><svg style="color: white" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" zoomAndPan="magnify" viewBox="0 0 30 30.000001" height="24" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="id1"><path d="M 2.328125 4.222656 L 27.734375 4.222656 L 27.734375 24.542969 L 2.328125 24.542969 Z M 2.328125 4.222656 " clip-rule="nonzero" fill="white"></path></clipPath></defs><g clip-path="url(#id1)"><path fill="white" d="M 27.5 7.53125 L 24.464844 4.542969 C 24.15625 4.238281 23.65625 4.238281 23.347656 4.542969 L 11.035156 16.667969 L 6.824219 12.523438 C 6.527344 12.230469 6 12.230469 5.703125 12.523438 L 2.640625 15.539062 C 2.332031 15.84375 2.332031 16.335938 2.640625 16.640625 L 10.445312 24.324219 C 10.59375 24.472656 10.796875 24.554688 11.007812 24.554688 C 11.214844 24.554688 11.417969 24.472656 11.566406 24.324219 L 27.5 8.632812 C 27.648438 8.488281 27.734375 8.289062 27.734375 8.082031 C 27.734375 7.875 27.648438 7.679688 27.5 7.53125 Z M 27.5 7.53125 " fill-opacity="1" fill-rule="nonzero"></path></g></svg></button>
                </div>
                <fieldset class="made-up">
                    <legend>Discounts:</legend>
                    <ul class="discounts-ul">
                    </ul>
                </fieldset>
                <button class="btn btn-checkout">checkout</button>
                <p>Go to <a href="./">Main</a></p>
            </div>
        </div>
        `
    }
}

export default Cart