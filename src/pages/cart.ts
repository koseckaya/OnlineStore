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
        const urlParams = getUrlParams()

        urlParams.has('method')
        if (urlParams.has('method') && urlParams.get('method') === 'buynow') {
            this.openCheckout()
        }

        const checkout = document.querySelector('.btn-checkout')
        checkout?.addEventListener('click', this.openCheckout)

        this.visibleItems();
        if (document.querySelector('.card')) {
            const card = document.querySelector('.card');
            card.style.height = `${document.querySelector('.made-up').offsetHeight - 20}px`;
        }
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
                if (arrOfAddedPromo.length === 0) {
                    let total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                    document.querySelector('.cart-span-total')?.innerHTML = `$${total} USD`
                } else if (arrOfAddedPromo.length > 0) {
                    let total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                    let discount = arrOfAddedPromo.reduce((a,b) => a + b)/100 * total;
                    let newValue = Math.round(total - (total - discount));
                    document.querySelector('.cart-span-total')?.innerHTML = `<span style='color: green;'>$${Math.round(total - newValue)} USD</span> <span style='text-decoration: line-through; color: grey;'>$${total} USD</span>`;
                    let discountSpan = document.querySelector('.cart-span-discount');
                    discountSpan?.innerHTML = `$${Math.round(newValue)} USD`;
                }
                if (localStorage.getItem('fullCart') && JSON.parse(localStorage.getItem('fullCart')).length > 0) {
                    const totalMoneyHeader = document.querySelector('.total-money') as HTMLElement;
                    let arr: storageItem[] = JSON.parse(localStorage.getItem('fullCart') || '');
                    let total = arr.reduce((acc : number, curr : storageItem) => acc + items[curr.id].price * curr.amount, 0);
                    totalMoneyHeader.innerHTML = `$${total}`
                } else {
                    const totalMoneyHeader = document.querySelector('.total-money') as HTMLElement;
                    totalMoneyHeader.innerHTML = `$0`
                }
                if (productsInLocalStorage.length === 0) return location.reload()
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
                            document.querySelector('.cart-total-amount')?.innerHTML = `${amount}`;
                            target.closest('.counter').querySelector('input').value = value;
                            parent.querySelector('.span-price-cart').innerHTML = `$${items[parentId].price * value}`;
                            let available = parent.querySelector('.available');
                            available.innerHTML = `Available: ${this.available - value}`
                            if (arrOfAddedPromo.length === 0) {
                                let total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                                document.querySelector('.cart-span-total')?.innerHTML = `$${total} USD`
                            } else if (arrOfAddedPromo.length > 0) {
                                let total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                                let discount = arrOfAddedPromo.reduce((a,b) => a + b)/100 * total;
                                let newValue = Math.round(total - (total - discount));
                                document.querySelector('.cart-span-total')?.innerHTML = `<span style='color: green;'>$${Math.round(total - newValue)} USD</span> <span style='text-decoration: line-through; color: grey;'>$${total} USD</span>`;
                                let discountSpan = document.querySelector('.cart-span-discount');
                                discountSpan?.innerHTML = `$${Math.round(newValue)} USD`;
                            }
                        } else if (target.classList.contains('counter__button-minus') && value === 1) {
                            let productsInLocalStorage = JSON.parse(localStorage.getItem('fullCart'));
                            let neededItem = productsInLocalStorage.filter((el, _index) => +(el.id) === +(parentId) && el.size === parentSize);
                            let idOfNeededItem = productsInLocalStorage.indexOf(neededItem[0]);
                            productsInLocalStorage.splice(idOfNeededItem, 1);
                            localStorage.setItem('fullCart', `${JSON.stringify(productsInLocalStorage)}`);
                            document.querySelector('.cart-products')?.removeChild(parent);
                            let amount = JSON.parse(localStorage.getItem('fullCart')).length;
                            document.querySelector('.cart-span-amount')?.innerHTML = `${amount}`;
                            if (arrOfAddedPromo.length === 0) {
                                let total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                                document.querySelector('.cart-span-total')?.innerHTML = `$${total} USD`
                            } else if (arrOfAddedPromo.length > 0) {
                                let total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                                let discount = arrOfAddedPromo.reduce((a,b) => a + b)/100 * total;
                                let newValue = Math.round(total - (total - discount));
                                document.querySelector('.cart-span-total')?.innerHTML = `<span style='color: green;'>$${Math.round(total - newValue)} USD</span> <span style='text-decoration: line-through; color: grey;'>$${total} USD</span>`;
                                let discountSpan = document.querySelector('.cart-span-discount');
                                discountSpan?.innerHTML = `$${Math.round(newValue)} USD`;
                            }
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
                            document.querySelector('.cart-span-amount')?.innerHTML = `${amount}`;
                            target.closest('.counter').querySelector('input').value = value;
                            parent.querySelector('.span-price-cart').innerHTML = `$${items[parentId].price * value}`;
                            let available = parent.querySelector('.available');
                            available.innerHTML = `Available: ${this.available - value}`
                            if (arrOfAddedPromo.length === 0) {
                                let total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                                document.querySelector('.cart-span-total')?.innerHTML = `$${total} USD`
                            } else if (arrOfAddedPromo.length > 0) {
                                let total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                                let discount = arrOfAddedPromo.reduce((a,b) => a + b)/100 * total;
                                let newValue = Math.round(total - (total - discount));
                                document.querySelector('.cart-span-total')?.innerHTML = `<span style='color: green;'>$${Math.round(total - newValue)} USD</span> <span style='text-decoration: line-through; color: grey;'>$${total} USD</span>`;
                                let discountSpan = document.querySelector('.cart-span-discount');
                                discountSpan?.innerHTML = `$${Math.round(newValue)} USD`;
                            }

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
                        if (localStorage.getItem('fullCart') && JSON.parse(localStorage.getItem('fullCart')).length > 0) {
                            const totalMoneyHeader = document.querySelector('.total-money') as HTMLElement;
                            let arr: storageItem[] = JSON.parse(localStorage.getItem('fullCart') || '');
                            let total = arr.reduce((acc : number, curr : storageItem) => acc + items[curr.id].price * curr.amount, 0);
                            totalMoneyHeader.innerHTML = `$${total}`
                        } else {
                            const totalMoneyHeader = document.querySelector('.total-money') as HTMLElement;
                            totalMoneyHeader.innerHTML = `$0`
                        }
                        let productsInLocalStorage = JSON.parse(localStorage.getItem('fullCart'));
                        if (productsInLocalStorage.length === 0 || !productsInLocalStorage) return location.reload()
                    }
                })
            }
            )
        }
        if (document.querySelector("#add")) {
        let nextPage = document.querySelector("#add");

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
        }   
        if (document.querySelector("#subtract")) {
        let previousPage = document.querySelector("#subtract");
        previousPage.addEventListener("click", () => {
            if (this.pageNow >= 1) {
                this.pageNow -= 1
                add?.classList.add('disabled');
                let output = document.querySelector("#output");
                output.innerText = this.pageNow + 1;
                this.visibleItems()
            }
        });
        }
        promoBtn?.addEventListener('click', () => {
            if (promoField.value in promoValue && !arrOfAddedPromo.includes(promoValue[promoField.value]) ) {
                promoBtn.style.background = `green`;
                promoLabel.style.color = `green`; 
                let elementLi = document.createElement('li');
                elementLi.classList.add('discount-li');
                elementLi.setAttribute('discount', promoValue[promoField.value]);
                elementLi.innerHTML = `<svg class="percent-svg" width="24px" height="24px" viewBox="0 0 24.00 24.00" id="magicoon-Regular" xmlns="http://www.w3.org/2000/svg" fill="#ffa200" stroke="#ffa200">

                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                
                <g id="SVGRepo_iconCarrier"> <defs> <style>.cls-1{fill:#ffa200;}</style> </defs> <title>discount</title> <g id="discount-Regular"> <path id="discount-Regular-2" data-name="discount-Regular" class="cls-1" d="M20.8,9.7l-.579-.579a1.25,1.25,0,0,1-.368-.889V7.412a3.263,3.263,0,0,0-3.26-3.26h-.815a1.25,1.25,0,0,1-.889-.368l-.579-.579a3.263,3.263,0,0,0-4.61,0l-.579.579a1.25,1.25,0,0,1-.889.368H7.412a3.263,3.263,0,0,0-3.26,3.26v.815a1.25,1.25,0,0,1-.368.889L3.205,9.7a3.263,3.263,0,0,0,0,4.61l.579.579a1.25,1.25,0,0,1,.368.889v.815a3.263,3.263,0,0,0,3.26,3.26h.815a1.25,1.25,0,0,1,.889.368L9.7,20.8a3.262,3.262,0,0,0,4.61,0l.579-.579a1.25,1.25,0,0,1,.889-.368h.815a3.263,3.263,0,0,0,3.26-3.26v-.815a1.25,1.25,0,0,1,.368-.889l.579-.579A3.263,3.263,0,0,0,20.8,9.7Zm-1.061,3.55-.578.578a2.741,2.741,0,0,0-.808,1.95v.815a1.761,1.761,0,0,1-1.76,1.76h-.815a2.741,2.741,0,0,0-1.95.808l-.578.578a1.762,1.762,0,0,1-2.49,0l-.578-.578a2.741,2.741,0,0,0-1.95-.808H7.412a1.761,1.761,0,0,1-1.76-1.76v-.815a2.741,2.741,0,0,0-.808-1.95l-.578-.578a1.764,1.764,0,0,1,0-2.49l.578-.578a2.741,2.741,0,0,0,.808-1.95V7.412a1.761,1.761,0,0,1,1.76-1.76h.815a2.741,2.741,0,0,0,1.95-.808l.578-.578a1.762,1.762,0,0,1,2.49,0l.578.578a2.741,2.741,0,0,0,1.95.808h.815a1.761,1.761,0,0,1,1.76,1.76v.815a2.741,2.741,0,0,0,.808,1.95l.578.578A1.764,1.764,0,0,1,19.734,13.245ZM15.53,8.47a.749.749,0,0,1,0,1.06l-6,6a.75.75,0,0,1-1.06-1.06l6-6A.749.749,0,0,1,15.53,8.47ZM15.5,14.5a1,1,0,1,1-1-1A1,1,0,0,1,15.5,14.5Zm-7-5a1,1,0,1,1,1,1A1,1,0,0,1,8.5,9.5Z"/> </g> </g>
                
                </svg>${promoField.value}<span style="margin-left: auto;">-${promoValue[promoField.value]}%</span><span style="display: flex;
                justify-content: center;
                align-items: center;
                padding-left: 10px; cursor: pointer;"><svg class="delete-discount" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16"> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path> </svg></span>`
                let total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                arrOfAddedPromo.push(promoValue[promoField.value]);
                let discount;
                if (arrOfAddedPromo.length > 0 ) {
                  discount = arrOfAddedPromo.reduce((a,b) => a + b)/100 * total;
                } else discount = 0;
                console.log(discount)
                let discountSpan = document.querySelector('.cart-span-discount');
                let newValue = Math.round(total - (total - discount));
                discountSpan?.innerHTML = `$${Math.round(newValue)} USD`;
                let spanTotal = document.querySelector('.cart-span-total');
                spanTotal?.innerHTML = `<span style='color: green;'>$${Math.round(total - newValue)} USD</span> <span style='text-decoration: line-through; color: grey;'>$${total} USD</span>`
                discountsUl?.appendChild(elementLi);
                elementLi.addEventListener('click', (e) => {
                    if (e.target.closest('.delete-discount')) {
                        let discount = Number(e.target.closest('.discount-li').getAttribute('discount'));
                        let indexOfDiscount = arrOfAddedPromo.indexOf(discount);
                        if (arrOfAddedPromo.length > 1 ) {
                            arrOfAddedPromo.splice(indexOfDiscount, 1);
                            total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                            discount = arrOfAddedPromo.reduce((a,b) => a + b)/100 * total;
                            newValue = Math.round(total - (total - discount));
                            spanTotal?.innerHTML = `<span style='color: green;'>$${Math.round(total - newValue)} USD</span> <span style='text-decoration: line-through; color: grey;'>$${total} USD</span>`;
                            discountSpan?.innerHTML = `$${Math.round(newValue)} USD`;
                            discountsUl?.removeChild(elementLi);
                        } else {
                            discount = 0;
                            arrOfAddedPromo.splice(indexOfDiscount, 1);
                            total = JSON.parse(localStorage.getItem('fullCart')).reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                            discount = arrOfAddedPromo.reduce((a,b) => a + b)/100 * total;
                            newValue = Math.round(total - (total - discount));
                            discountSpan?.innerHTML = `$${Math.round(newValue)} USD`;
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
        if (document.querySelector('.cart-limit')) {
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
    }
    render = () => {
        if (localStorage.getItem('fullCart')) {
            if (JSON.parse(localStorage.getItem('fullCart')).length === 0) {
                return `<div class="empty-cart"><span>Sorry, but cart is empty. You need to add products.</span><svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 231.523 231.523" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M107.415,145.798c0.399,3.858,3.656,6.73,7.451,6.73c0.258,0,0.518-0.013,0.78-0.04c4.12-0.426,7.115-4.111,6.689-8.231 l-3.459-33.468c-0.426-4.12-4.113-7.111-8.231-6.689c-4.12,0.426-7.115,4.111-6.689,8.231L107.415,145.798z"></path> <path d="M154.351,152.488c0.262,0.027,0.522,0.04,0.78,0.04c3.796,0,7.052-2.872,7.451-6.73l3.458-33.468 c0.426-4.121-2.569-7.806-6.689-8.231c-4.123-0.421-7.806,2.57-8.232,6.689l-3.458,33.468 C147.235,148.377,150.23,152.062,154.351,152.488z"></path> <path d="M96.278,185.088c-12.801,0-23.215,10.414-23.215,23.215c0,12.804,10.414,23.221,23.215,23.221 c12.801,0,23.216-10.417,23.216-23.221C119.494,195.502,109.079,185.088,96.278,185.088z M96.278,216.523 c-4.53,0-8.215-3.688-8.215-8.221c0-4.53,3.685-8.215,8.215-8.215c4.53,0,8.216,3.685,8.216,8.215 C104.494,212.835,100.808,216.523,96.278,216.523z"></path> <path d="M173.719,185.088c-12.801,0-23.216,10.414-23.216,23.215c0,12.804,10.414,23.221,23.216,23.221 c12.802,0,23.218-10.417,23.218-23.221C196.937,195.502,186.521,185.088,173.719,185.088z M173.719,216.523 c-4.53,0-8.216-3.688-8.216-8.221c0-4.53,3.686-8.215,8.216-8.215c4.531,0,8.218,3.685,8.218,8.215 C181.937,212.835,178.251,216.523,173.719,216.523z"></path> <path d="M218.58,79.08c-1.42-1.837-3.611-2.913-5.933-2.913H63.152l-6.278-24.141c-0.86-3.305-3.844-5.612-7.259-5.612H18.876 c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h24.94l6.227,23.946c0.031,0.134,0.066,0.267,0.104,0.398l23.157,89.046 c0.86,3.305,3.844,5.612,7.259,5.612h108.874c3.415,0,6.399-2.307,7.259-5.612l23.21-89.25C220.49,83.309,220,80.918,218.58,79.08z M183.638,165.418H86.362l-19.309-74.25h135.895L183.638,165.418z"></path> <path d="M105.556,52.851c1.464,1.463,3.383,2.195,5.302,2.195c1.92,0,3.84-0.733,5.305-2.198c2.928-2.93,2.927-7.679-0.003-10.607 L92.573,18.665c-2.93-2.928-7.678-2.927-10.607,0.002c-2.928,2.93-2.927,7.679,0.002,10.607L105.556,52.851z"></path> <path d="M159.174,55.045c1.92,0,3.841-0.733,5.306-2.199l23.552-23.573c2.928-2.93,2.925-7.679-0.005-10.606 c-2.93-2.928-7.679-2.925-10.606,0.005l-23.552,23.573c-2.928,2.93-2.925,7.679,0.005,10.607 C155.338,54.314,157.256,55.045,159.174,55.045z"></path> <path d="M135.006,48.311c0.001,0,0.001,0,0.002,0c4.141,0,7.499-3.357,7.5-7.498l0.008-33.311c0.001-4.142-3.356-7.501-7.498-7.502 c-0.001,0-0.001,0-0.001,0c-4.142,0-7.5,3.357-7.501,7.498l-0.008,33.311C127.507,44.951,130.864,48.31,135.006,48.311z"></path> </g> </g></svg></div>`
            }
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
                    <div class="form__group field">
                        <input type="input" class="form__field" placeholder="Promo" name="Promo" id='Promo' required />
                        <label for="Promo" class="form__label">Discount code</label>
                        <button class="promo-btn"><svg style="color: white" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" zoomAndPan="magnify" viewBox="0 0 30 30.000001" height="24" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="id1"><path d="M 2.328125 4.222656 L 27.734375 4.222656 L 27.734375 24.542969 L 2.328125 24.542969 Z M 2.328125 4.222656 " clip-rule="nonzero" fill="white"></path></clipPath></defs><g clip-path="url(#id1)"><path fill="white" d="M 27.5 7.53125 L 24.464844 4.542969 C 24.15625 4.238281 23.65625 4.238281 23.347656 4.542969 L 11.035156 16.667969 L 6.824219 12.523438 C 6.527344 12.230469 6 12.230469 5.703125 12.523438 L 2.640625 15.539062 C 2.332031 15.84375 2.332031 16.335938 2.640625 16.640625 L 10.445312 24.324219 C 10.59375 24.472656 10.796875 24.554688 11.007812 24.554688 C 11.214844 24.554688 11.417969 24.472656 11.566406 24.324219 L 27.5 8.632812 C 27.648438 8.488281 27.734375 8.289062 27.734375 8.082031 C 27.734375 7.875 27.648438 7.679688 27.5 7.53125 Z M 27.5 7.53125 " fill-opacity="1" fill-rule="nonzero"></path></g></svg></button>
                    </div>
                    <fieldset class="made-up">
                        <legend>Discounts:</legend>
                        <div class="cardWrap">
                        <div class="card cardRight">
                        </div>
                        </div>
                        <ul class="discounts-ul">
                        </ul>
                    </fieldset>
                    <div class="cart-total__cash">
                        <span>Total:</span><span class="cart-span-total">$${total} USD</span>
                    </div>
                    <div class="cart-total__discount">
                        <span>Discount: </span><span class="cart-span-discount">$0 USD</span>
                    </div>
                    <div class="cart-total__amount">
                        <span>Products in cart:</span><span class="cart-span-amount">${amount}</span>
                    </div>
                    <button class="btn btn-checkout">checkout</button>
                </div>
            </div>
            `
        } else {
            return `<div class="empty-cart"><span>Sorry, but cart is empty. You need to add products.</span><svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 231.523 231.523" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M107.415,145.798c0.399,3.858,3.656,6.73,7.451,6.73c0.258,0,0.518-0.013,0.78-0.04c4.12-0.426,7.115-4.111,6.689-8.231 l-3.459-33.468c-0.426-4.12-4.113-7.111-8.231-6.689c-4.12,0.426-7.115,4.111-6.689,8.231L107.415,145.798z"></path> <path d="M154.351,152.488c0.262,0.027,0.522,0.04,0.78,0.04c3.796,0,7.052-2.872,7.451-6.73l3.458-33.468 c0.426-4.121-2.569-7.806-6.689-8.231c-4.123-0.421-7.806,2.57-8.232,6.689l-3.458,33.468 C147.235,148.377,150.23,152.062,154.351,152.488z"></path> <path d="M96.278,185.088c-12.801,0-23.215,10.414-23.215,23.215c0,12.804,10.414,23.221,23.215,23.221 c12.801,0,23.216-10.417,23.216-23.221C119.494,195.502,109.079,185.088,96.278,185.088z M96.278,216.523 c-4.53,0-8.215-3.688-8.215-8.221c0-4.53,3.685-8.215,8.215-8.215c4.53,0,8.216,3.685,8.216,8.215 C104.494,212.835,100.808,216.523,96.278,216.523z"></path> <path d="M173.719,185.088c-12.801,0-23.216,10.414-23.216,23.215c0,12.804,10.414,23.221,23.216,23.221 c12.802,0,23.218-10.417,23.218-23.221C196.937,195.502,186.521,185.088,173.719,185.088z M173.719,216.523 c-4.53,0-8.216-3.688-8.216-8.221c0-4.53,3.686-8.215,8.216-8.215c4.531,0,8.218,3.685,8.218,8.215 C181.937,212.835,178.251,216.523,173.719,216.523z"></path> <path d="M218.58,79.08c-1.42-1.837-3.611-2.913-5.933-2.913H63.152l-6.278-24.141c-0.86-3.305-3.844-5.612-7.259-5.612H18.876 c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h24.94l6.227,23.946c0.031,0.134,0.066,0.267,0.104,0.398l23.157,89.046 c0.86,3.305,3.844,5.612,7.259,5.612h108.874c3.415,0,6.399-2.307,7.259-5.612l23.21-89.25C220.49,83.309,220,80.918,218.58,79.08z M183.638,165.418H86.362l-19.309-74.25h135.895L183.638,165.418z"></path> <path d="M105.556,52.851c1.464,1.463,3.383,2.195,5.302,2.195c1.92,0,3.84-0.733,5.305-2.198c2.928-2.93,2.927-7.679-0.003-10.607 L92.573,18.665c-2.93-2.928-7.678-2.927-10.607,0.002c-2.928,2.93-2.927,7.679,0.002,10.607L105.556,52.851z"></path> <path d="M159.174,55.045c1.92,0,3.841-0.733,5.306-2.199l23.552-23.573c2.928-2.93,2.925-7.679-0.005-10.606 c-2.93-2.928-7.679-2.925-10.606,0.005l-23.552,23.573c-2.928,2.93-2.925,7.679,0.005,10.607 C155.338,54.314,157.256,55.045,159.174,55.045z"></path> <path d="M135.006,48.311c0.001,0,0.001,0,0.002,0c4.141,0,7.499-3.357,7.5-7.498l0.008-33.311c0.001-4.142-3.356-7.501-7.498-7.502 c-0.001,0-0.001,0-0.001,0c-4.142,0-7.5,3.357-7.501,7.498l-0.008,33.311C127.507,44.951,130.864,48.31,135.006,48.311z"></path> </g> </g></svg></div>`
        }
    }
}

export default Cart