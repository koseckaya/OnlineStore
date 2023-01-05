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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/></svg>
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

        document.querySelectorAll('.product-cart').forEach((el, index) => {
            if (!(index < (this.pageNow * 2 + this.itemsPerPage))) {
                el.style.display = `none`;
            } else el.style = ``;
        });
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
                document.querySelector('.cart-total__cash')?.innerHTML = `Total: $${total} USD`;
                document.querySelector('.cart-total__amount')?.innerHTML = `Products in cart: ${amount}`;
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
                            document.querySelector('.cart-total__cash')?.innerHTML = `Total: $${total} USD`;
                            document.querySelector('.cart-total__amount')?.innerHTML = `Products in cart: ${amount}`;
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
                            document.querySelector('.cart-total__cash')?.innerHTML = `Total: $${total} USD`;
                            document.querySelector('.cart-total__amount')?.innerHTML = `Products in cart: ${amount}`;
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
                            document.querySelector('.cart-total__cash')?.innerHTML = `Total: $${total} USD`;
                            document.querySelector('.cart-total__amount')?.innerHTML = `Products in cart: ${amount}`;
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

        let add = document.querySelector("#add");
        let subract = document.querySelector("#subtract");

        add.addEventListener("click", () => {
            let productsInLocalStorage = JSON.parse(localStorage.getItem('fullCart'));
            let pages = Math.ceil(productsInLocalStorage.length / 4);
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

        subract.addEventListener("click", () => {
            if (this.pageNow >= 1) {
                this.pageNow -= 1
                add?.classList.add('disabled');
                let output = document.querySelector("#output");
                output.innerText = this.pageNow + 1;
                this.visibleItems()
            }
        });
    }
    render = () => {
        let amount = JSON.parse(localStorage.getItem('fullCart')).length;
        let total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
        return `<div class="cart-header">
            <div class="pages">
                <div class="counter-pagination">
                    <button id="subtract"><svg id="left-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6.028 0v6.425l5.549 5.575-5.549 5.575v6.425l11.944-12z"/></svg></button>
                        <span id="output">1</span>
                    <button id="add"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6.028 0v6.425l5.549 5.575-5.549 5.575v6.425l11.944-12z"/></svg></button>
                </div>
            </div>
            <div class="cart-total">
                <div class="cart-total__cash">
                    Total: $${total} USD
                </div>
                <div class="cart-total__amount">
                    Products in cart: ${amount}
                </div>
            </div>
        </div>
        <div class="cart-products">
            ${this.createProductDiv()}
        </div>
        <button class="btn btn-checkout">checkout</button>
        <p>Go to <a href="./">Main</a></p>
        `
    }
}

export default Cart