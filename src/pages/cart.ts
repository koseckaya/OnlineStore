
import Checkout from "../modules/checkout";
import { getUrlParams } from '../helpers/utils';
import { items, categories } from "../data";
import { CheckoutInterface, ModuleInterface, storageItem } from "./types";



class Cart implements ModuleInterface {
    checkoutModule: CheckoutInterface | null = null;
    pageNow = 0;
    itemsPerPage = 4;
    available = 10;
    constructor() {

    }

    createProductDiv = (): string => {
        let string: string = ``;
        let array1: string[] = [];
        if (localStorage.getItem('fullCart')) {
            let productsInLocalStorage: storageItem[] = JSON.parse(localStorage.getItem('fullCart') || "");
            console.log('productsInLocalStorage', productsInLocalStorage);
            productsInLocalStorage.forEach((el, index: number) => {
                let { id, amount, size } = el
                string = `<div class="product-cart" id="${id}" size="${size}">
                        <div class="product-cart__number">${index + 1}</div>
                        <div class="product-cart__image-div">
                            <img class="product-cart-image" src="${items[+id].url[0]}" alt="product-image">
                        </div>
                        <div class="product-cart__card-info">
                            <h2 class="product-cart-name">${items[+id].name}</h2>
                            <div class="product-cart-brand">${items[+id].brand}</div>
                            <div class="product-cart-type">${items[+id].type}</div>
                        </div>
                        <div class="product-cart__picked-color">
                            <img class="picked-color-image" src="${items[+id].url[1]}"></img>
                            <div class="picked-color-name">${items[+id].colorHTML}</div>
                        </div>
                        <div class="counter-section">
                            <div class="counter" data-counter1>
                                <div class="counter__button counter__button-minus">-</div>
                                <div class="counter__input"><input type="text" disabled placeholder="${amount}" value="${amount}"></div>
                                <div class="counter__button counter__button-plus">+</div>
                            </div>
                            <div class="available">
                                Available: ${this.available - +el.amount}
                            </div>
                        </div>
                        <div class="product-cart__picked-size">
                            Size: ${size}
                        </div>
                        <div class="product-cart__price">
                            <span>Price:</span>
                            <span class="span-price-cart">$${+amount * items[+id].price} </span>
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
    openCheckout = (): void => {
        if (!this.checkoutModule) {
            this.checkoutModule = new Checkout();
        }
        this.checkoutModule.init();
    }
    visibleItems = (): void => {
        const productCart: NodeListOf<HTMLElement> = document.querySelectorAll('.product-cart')
        console.log('productCart', productCart);
        if (this.pageNow !== 0) {
            productCart.forEach((el, index: number) => {
                let start = this.pageNow * this.itemsPerPage;
                let end = start + this.itemsPerPage;
                if (!(index > start - 1 && index < end)) {
                    el.style.display = `none`;
                } else {
                    el.setAttribute('style', '');
                }
            });
        } else {
            productCart.forEach((el, index) => {
                let start = 0;
                let end = this.itemsPerPage;
                if (!(index > start - 1 && index < end)) {
                    el.style.display = `none`;
                } else el.setAttribute('style', '');
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

        const productCart: NodeListOf<HTMLDivElement> = document.querySelectorAll('.product-cart')
        productCart.forEach((el, index) => {
            if (!(index < (this.pageNow * 2 + this.itemsPerPage))) {
                el.style.display = `none`;
            } else el.setAttribute('style', '');
        });
        let trashBinButtons: NodeListOf<HTMLDivElement> = document.querySelectorAll('.product-cart__trash-bin')
        if (trashBinButtons) {
            trashBinButtons.forEach((el) => el.addEventListener('click', (e: Event) => {
                let productsInLocalStorage = JSON.parse(localStorage.getItem('fullCart') || "");

                if (e.target) {
                    let parent = (e.target as HTMLDivElement).closest('.product-cart');
                    if (parent) {
                        let parentId = parent.getAttribute('id');
                        let parentSize = parent.getAttribute('size');
                        if (!parentId || !parentSize) return '';
                        let neededItem = productsInLocalStorage.filter((el: storageItem, _index: number) => parentId && +(el.id) === +(parentId) && el.size === parentSize);
                        let idOfNeededItem = productsInLocalStorage.indexOf(neededItem[0]);
                        let deletedItem = productsInLocalStorage.splice(idOfNeededItem, 1);
                        localStorage.setItem('fullCart', `${JSON.stringify(productsInLocalStorage)}`);
                        let amount = JSON.parse(localStorage.getItem('fullCart') || '').length;
                        let total: storageItem[] = JSON.parse(localStorage.getItem('fullCart') || '').reduce((acc: number, curr: storageItem) => {
                            const { id, amount } = curr;
                            acc += items[Number(id)].price * Number(amount)
                            return acc;
                        }, 0);
                        const totalCash = document.querySelector('.cart-total__cash')
                        const totalAmount = document.querySelector('.cart-total__amount')
                        const cartProducts = document.querySelector('.cart-products')
                        const cartAmount = document.querySelector('.cart-amount')
                        const productCartNumber = document.querySelectorAll('.product-cart__number')
                        if (totalCash && totalAmount && cartProducts && cartAmount) {
                            totalCash.innerHTML = `Total: $${total} USD`;
                            totalAmount.innerHTML = `Products in cart: ${amount}`;
                            cartProducts.removeChild(parent);
                            cartAmount.innerHTML = `${productsInLocalStorage.length}`;
                        }
                        productCartNumber.forEach((el, index) => el.innerHTML = `${index + 1}`);
                        let arrayOfProductCart = document.querySelectorAll('.product-cart');
                        arrayOfProductCart.forEach((_el, _index) => {
                            if (!Array.from(arrayOfProductCart).some(el => el.getAttribute('style') === '')) {
                                this.pageNow -= 1;
                                const outputId = document.getElementById('output')
                                if (outputId) outputId.innerText = `${this.pageNow + 1}`;
                                this.visibleItems()
                            };
                            this.visibleItems()
                        });
                    }
                }
            }))
        }
        let counters = document.querySelectorAll('[data-counter1]');
        if (counters) {
            counters.forEach(counter => {
                counter.addEventListener('click', e => {
                    const target = e.target as HTMLElement
                    if (target) {
                        const parent = target.closest('.product-cart')
                        if (parent !== null) {
                            const parentId = parent.getAttribute('id');
                            const parentSize = parent.getAttribute('size');

                            if (target.closest('.counter__button')) {
                                const counterEl = target.closest('.counter');
                                const counterInputEl = counterEl ? counterEl.querySelector('input') : null;

                                if (!counterInputEl) {
                                    return;
                                }

                                if (
                                    counterInputEl.value == ''
                                    && (target.classList.contains('counter__button-minus') || target.classList.contains('counter__button-plus'))
                                ) {
                                    counterInputEl.value = '1';
                                }

                                let value = parseInt(counterInputEl.value);

                                if (target.classList.contains('counter__button-plus') && value < this.available) {
                                    let productsInLocalStorage = JSON.parse(localStorage.getItem('fullCart') || '');
                                    value++;
                                    productsInLocalStorage.forEach((el: storageItem) => {
                                        if (parentId === el.id && parentSize === el.size) {
                                            el.amount = value
                                        }
                                    })
                                    localStorage.setItem('fullCart', `${JSON.stringify(productsInLocalStorage)}`);
                                    let amount = JSON.parse(localStorage.getItem('fullCart') || '').length;
                                    let total = JSON.parse(localStorage.getItem('fullCart') || '').reduce((acc: number, curr: storageItem) => {
                                        const { id, amount } = curr;
                                        acc += items[Number(id)].price * Number(amount)
                                        return acc;
                                    }, 0);
                                    const cartTotalCashEl = document.querySelector('.cart-total__cash');
                                    if (cartTotalCashEl) {
                                        cartTotalCashEl.innerHTML = `Total: $${total} USD`;
                                    }

                                    const cartTotalAmountEl = document.querySelector('.cart-total__amount');
                                    if (cartTotalAmountEl) {
                                        cartTotalAmountEl.innerHTML = `Products in cart: ${amount}`;
                                    }

                                    const counterEl = target.closest('.counter');
                                    const counterInputEl = counterEl ? counterEl.querySelector('input') : null;

                                    if (counterInputEl) {
                                        counterInputEl.value = String(value);
                                    }
                                    const spanPriceCartEl = parent.querySelector('.span-price-cart');
                                    if (spanPriceCartEl && parentId) {
                                        spanPriceCartEl.innerHTML = `$${items[+parentId].price * value}`;
                                    }
                                    let available = parent.querySelector('.available');
                                    if (available) {
                                        available.innerHTML = `Available: ${this.available - value}`
                                    }
                                } else if (target.classList.contains('counter__button-minus') && value === 1) {
                                    let productsInLocalStorage = JSON.parse(localStorage.getItem('fullCart') || '');
                                    let neededItem = productsInLocalStorage.filter((el: storageItem, _index: number) => parentId && +(el.id) === +(parentId) && el.size === parentSize);
                                    let idOfNeededItem = productsInLocalStorage.indexOf(neededItem[0]);
                                    productsInLocalStorage.splice(idOfNeededItem, 1);
                                    localStorage.setItem('fullCart', `${JSON.stringify(productsInLocalStorage)}`);
                                    document.querySelector('.cart-products')?.removeChild(parent);
                                    let amount = JSON.parse(localStorage.getItem('fullCart') || '').length;
                                    let total = JSON.parse(localStorage.getItem('fullCart') || '').reduce((acc: number, curr: storageItem) => {
                                        const { id, amount } = curr;
                                        acc += items[Number(id)].price * Number(amount)
                                        return acc;
                                    }, 0);
                                    const cartTotalCashEl = document.querySelector('.cart-total__cash');
                                    if (cartTotalCashEl) {
                                        cartTotalCashEl.innerHTML = `Total: $${total} USD`;
                                    }

                                    const cartTotalAmountEl = document.querySelector('.cart-total__amount');
                                    if (cartTotalAmountEl) {
                                        cartTotalAmountEl.innerHTML = `Products in cart: ${amount}`;
                                    }
                                } else if (target.classList.contains('counter__button-minus') && value > 1) {
                                    let productsInLocalStorage = JSON.parse(localStorage.getItem('fullCart') || '');
                                    value--;
                                    productsInLocalStorage.forEach((el: storageItem) => {
                                        if (parentId === el.id && parentSize === el.size) {
                                            el.amount = value
                                        }
                                    })
                                    localStorage.setItem('fullCart', `${JSON.stringify(productsInLocalStorage)}`);
                                    let amount = JSON.parse(localStorage.getItem('fullCart') || '').length;
                                    let total = JSON.parse(localStorage.getItem('fullCart') || '').reduce((acc: number, curr: storageItem) => {
                                        const { id, amount } = curr;
                                        acc += items[Number(id)].price * Number(amount)
                                        return acc;
                                    }, 0);
                                    const cartTotalCashEl = document.querySelector('.cart-total__cash');
                                    if (cartTotalCashEl) {
                                        cartTotalCashEl.innerHTML = `Total: $${total} USD`;
                                    }

                                    const cartTotalAmountEl = document.querySelector('.cart-total__amount');
                                    if (cartTotalAmountEl) {
                                        cartTotalAmountEl.innerHTML = `Products in cart: ${amount}`;
                                    }

                                    const counterEl = target.closest('.counter');
                                    const counterInputEl = counterEl ? counterEl.querySelector('input') : null;

                                    if (counterInputEl) {
                                        counterInputEl.value = String(value);
                                    }
                                    const spanPriceCartEl = parent.querySelector('.span-price-cart');
                                    if (spanPriceCartEl && parentId) {
                                        spanPriceCartEl.innerHTML = `$${items[+parentId].price * value}`;
                                    }

                                    let available = parent.querySelector('.available');
                                    if (available) {
                                        available.innerHTML = `Available: ${this.available - value}`
                                    }
                                }
                                if (localStorage.getItem('fullCart') || '') {
                                    let productsInLocalStorage = JSON.parse(localStorage.getItem('fullCart') || '');
                                    const cartAmountEl = document.querySelector('.cart-amount');
                                    if (cartAmountEl) {
                                        cartAmountEl.innerHTML = `${productsInLocalStorage.length}`;
                                    }
                                }
                                document.querySelectorAll('.product-cart__number').forEach((el, index) => el.innerHTML = `${index + 1}`)
                                counterInputEl.value = String(value);
                                let arrayOfProductCart = document.querySelectorAll('.product-cart');
                                document.querySelectorAll('.product-cart').forEach((_el, _index) => {
                                    if (!Array.from(arrayOfProductCart).some(el => el.getAttribute('style') === '')) {
                                        this.pageNow -= 1;
                                        const outputEl = document.getElementById('output');
                                        if (outputEl) {
                                            outputEl.innerText = String(this.pageNow + 1);
                                        }
                                        // this.visibleItems() ?????
                                    };
                                    this.visibleItems()
                                });
                            }
                        }
                    }
                })
            })
        }

        let add = document.querySelector("#add");
        let subtract = document.querySelector("#subtract");
        if (add) {
            add.addEventListener("click", () => {
                let productsInLocalStorage = JSON.parse(localStorage.getItem('fullCart') || '');
                let pages = Math.ceil(productsInLocalStorage.length / 4);
                if (this.pageNow < pages - 1) {
                    this.pageNow += 1
                    add?.classList.remove('disabled');
                } else {
                    add?.classList.add('disabled');
                }
                let output = document.querySelector("#output") as HTMLSpanElement;
                if (output) output.innerText = `${this.pageNow + 1}`;
                this.visibleItems()
            });
        }
        if (subtract) {
            subtract.addEventListener("click", () => {
                if (this.pageNow >= 1) {
                    this.pageNow -= 1
                    add?.classList.add('disabled');
                    let output = document.querySelector("#output") as HTMLSpanElement;;
                    if (output) output.innerText = `${this.pageNow + 1}`;
                    this.visibleItems()
                }
            });
        }
    }
    render = () => {
        let amount = JSON.parse(localStorage.getItem('fullCart') || '').length;
        let total = JSON.parse(localStorage.getItem('fullCart') || '').reduce((acc: number, curr: storageItem) => {
            const { id, amount } = curr;
            acc += items[Number(id)].price * Number(amount)
            return acc;
        }, 0);
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
         <div class="container">
        `
    }
}

export default Cart