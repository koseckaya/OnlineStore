// @ts-nocheck
import { parseRequestURL } from "../helpers/utils";
import { items, categories } from "../data";
const starsImage = require('../img/stars5.png') as string
import { cartProductType, ModuleInterface, storageItem } from "./types";
import { Item } from "../types";

class Product implements ModuleInterface {
    i: number = 0;
    selectedProduct: Item | null = null;
    available = 10;
    cartProduct: cartProductType = {
        id: -1,
        amount: 1,
        size: null,
    };
    constructor() {
        const request = parseRequestURL()
        const neededItemId = Number(request.id);
        if (neededItemId && request.resource === 'product') {
            this.selectedProduct = items[neededItemId];
            this.cartProduct.id = this.selectedProduct.id
            this.cartProduct.size = items[neededItemId].sizes[0]
            if (localStorage.getItem('fullCart')) {
                if (JSON.parse(localStorage.getItem('fullCart')).filter(el => el.id === this.cartProduct.id && el.size === this.cartProduct.size).length > 0) {
                    this.itemWeNeedToFind = JSON.parse(localStorage.getItem('fullCart')).filter(el => el.id === this.cartProduct.id && el.size === this.cartProduct.size)[0];
                    this.available = 10 - this.itemWeNeedToFind.amount;
                }
            }

        } else if (request.resource === 'product') {
            this.selectedProduct = items[0];
            this.cartProduct.id = this.selectedProduct.id
            this.cartProduct.size = items[neededItemId].sizes[0]
            if (localStorage.getItem('fullCart')) {
                if (JSON.parse(localStorage.getItem('fullCart')).filter(el => el.id === this.cartProduct.id && el.size === this.cartProduct.size).length > 0) {
                    this.itemWeNeedToFind = JSON.parse(localStorage.getItem('fullCart')).filter(el => el.id === this.cartProduct.id && el.size === this.cartProduct.size)[0];
                    this.available = 10 - this.itemWeNeedToFind.amount;
                }
            }
        }
    }

    iterator = (): number => {
        if (this.i === 0) {
            this.i = 2;
        } else {
            this.i -= 1;
        }
        return this.i;
    }

    sliderLeft = () => {
        let ParentNode = document.getElementById('slides-container');
        if (ParentNode && this.selectedProduct) {
            let firstChild = ParentNode.firstChild;
            let newSlide = document.createElement('img');
            const srcLeft = this.selectedProduct.url[this.iterator()]
            newSlide.setAttribute('src', srcLeft);
            newSlide.setAttribute('alt', `card-image`);
            newSlide.classList.add('slider-image');
            ParentNode.insertBefore(newSlide, firstChild);
            // let startWidth = ParentNode?.offsetWidth;
            ParentNode.style.width = `${ParentNode?.offsetWidth * 2}px`;
            ParentNode.style.transform = `translateX(-${(document.querySelector('.product__slider') as HTMLElement).offsetWidth}px)`;
            ParentNode.style.animation = `blur .5s`;
            setTimeout(function () {
                if (ParentNode) {
                    ParentNode.style.transition = `all .5s ease-in-out`;
                    ParentNode.style.transform = `translateX(0px)`;
                    ParentNode.style.animation = ``;
                    setTimeout(function () {
                        if (ParentNode && ParentNode.lastElementChild) {
                            ParentNode.removeChild(ParentNode.lastElementChild);
                            ParentNode.style.width = `${(document.querySelector('.product__slider') as HTMLElement).offsetWidth}px`;
                            ParentNode.style.transition = `all .0s ease-in-out`;
                        }
                    }, 500)
                }
            }, 500);
        }
    }

    sliderRight = (): void => {
        let ParentNode = document.getElementById('slides-container');
        // let firstChild = ParentNode.firstChild;
        if (ParentNode && this.selectedProduct) {
            let newSlide = document.createElement('img');
            newSlide.setAttribute('src', `${this.selectedProduct.url[this.iterator()]}`);
            newSlide.setAttribute('alt', `card-image`);
            newSlide.classList.add('slider-image');
            ParentNode.appendChild(newSlide);
            ParentNode.style.width = `${(document.querySelector('.product__slider') as HTMLElement).offsetWidth * 2}px`;
            ParentNode.style.animation = `blur .5s`;
            setTimeout(function () {
                if (ParentNode) {
                    ParentNode.style.transition = `all .5s ease-in-out`;
                    ParentNode.style.transform = `translateX(${-(document.querySelector('.product__slider') as HTMLElement).offsetWidth}px)`;
                    ParentNode.style.animation = ``;
                    setTimeout(function () {
                        if (ParentNode && ParentNode.firstElementChild) {
                            ParentNode.removeChild(ParentNode.firstElementChild);
                            ParentNode.style.width = `${(document.querySelector('.product__slider') as HTMLElement).offsetWidth}px`;
                            ParentNode.style.transform = `translateX(0px)`;
                            ParentNode.style.transition = `all .0s ease-in-out`;
                        }
                    }, 500)
                }
            }, 500);
        }
    }
    // transformation of available sizes in Product object to html-string, that we add to render()
    sizesString = (): string => {
        let resultString = '';
        if (this.selectedProduct) {
            const sizesArrLength = this.selectedProduct.sizes.length;
            for (let i = 0; i < sizesArrLength; i++) {
                resultString += `<option value='${this.selectedProduct.sizes[i]}'>${this.selectedProduct.sizes[i]}</option>`
            }
        }
        return resultString;
    }
    // filter available product colors and sort from the active color to other colors that we add to the render function() as available product colors

    filterAvailableColors = (): Item[] => {
        let filteredArray = items.filter((el) => {
            if (this.selectedProduct) {
                return el.name === this.selectedProduct.name && el.categoryId === this.selectedProduct.categoryId;
            }
        })
        filteredArray.sort(el => {
            if (this.selectedProduct && el.colorHTML === this.selectedProduct.colorHTML) {
                return -1;
            } else {
                return 1;
            }
        });
        return filteredArray;
    }
    bind = () => {
        if (localStorage.getItem('fullCart')) {
            if (JSON.parse(localStorage.getItem('fullCart')).filter(el => el.id === this.cartProduct.id && el.size === this.cartProduct.size).length > 0) {
                if (this.available === 0) {
                    document.querySelector('.product-add-btn')?.innerHTML = `NOT AVAILABLE ANYMORE`;
                    document.querySelector('.product-add-btn')?.style.background = `grey`;
                }
                let availableInCart = document.createElement('div');
                availableInCart.classList.add('already-in');
                availableInCart.innerHTML = `You already have ${this.itemWeNeedToFind.amount} in your cart`;
                document.querySelector('.buy-buttons-container')?.appendChild(availableInCart);
                availableInCart.style.left = `${(document.querySelector('.buy-buttons-container').offsetWidth / 2) - (document.querySelector('.already-in').offsetWidth / 2)}px`;
            }
        }
        document.querySelector('.slider-left')?.addEventListener('click', this.sliderLeft);
        document.querySelector('.slider-right')?.addEventListener('click', this.sliderRight);
        const counters = document.querySelector('[data-counter]');
        if (counters) {
            counters.addEventListener('click', e => {
                const target = e.target;
                if (target.closest('.counter__button')) {
                    if (target.closest('.counter').querySelector('input').value == '1' && (target.classList.contains('counter__button-minus') || target.classList.contains('counter__button-plus'))) {
                        target.closest('.counter').querySelector('input').value = 1;
                    }

                    let value = parseInt(target.closest('.counter').querySelector('input').value);

                    if (target.classList.contains('counter__button-plus') && value < this.available) {
                        value++;
                        target.closest('.counter').querySelector('input').value = value
                        console.log(target.closest('.counter').querySelector('input').value)
                        this.cartProduct.amount = +(target.closest('.counter').querySelector('input').value)
                        document.querySelector('.price-span')?.innerHTML = `$${this.selectedProduct.price * value} USD`
                    } else if (target.classList.contains('counter__button-minus')) {
                        value--;
                        target.closest('.counter').querySelector('input').value = value
                        console.log(target.closest('.counter').querySelector('input').value)
                        this.cartProduct.amount = +(target.closest('.counter').querySelector('input').value)
                        document.querySelector('.price-span')?.innerHTML = `$${this.selectedProduct.price * value} USD`
                    }

                    if (value <= 1) {
                        value = 1;
                        target.closest('.counter').querySelector('.counter__button-minus').classList.add('disabled')
                    } else {
                        target.closest('.counter').querySelector('.counter__button-minus').classList.remove('disabled')
                    }
                    target.closest('.counter').querySelector('input').value = value;
                }
            })

        }
        document.querySelector('.product-sizes')?.addEventListener('change', (e) => {
            this.cartProduct.size = e.target?.value;
            document.querySelector('input').value = 1;
            document.querySelector('input')?.placeholder = '1';
            if (localStorage.getItem('fullCart')) {
                if (JSON.parse(localStorage.getItem('fullCart')).filter(el => el.id === this.cartProduct.id && el.size === this.cartProduct.size).length > 0) {
                    this.itemWeNeedToFind = JSON.parse(localStorage.getItem('fullCart')).filter(el => el.id === this.cartProduct.id && el.size === this.cartProduct.size)[0];
                    this.available = 10 - this.itemWeNeedToFind.amount;
                    document.querySelector('.product-add-btn')?.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
                    <g fill="none" fill-rule="evenodd"><path stroke="currentColor" stroke-width="2" d="M3.5 0v13.65h10.182L17.5 4.095h-14"></path><ellipse fill="currentColor" fill-rule="nonzero" cx="4" cy="17.9" rx="1.5" ry="1.575"></ellipse><ellipse fill="currentColor" fill-rule="nonzero" cx="12" cy="17.9" rx="1.5" ry="1.575"></ellipse>
                    </g>
                </svg>
                <span class="price-span">$${this.selectedProduct.price} USD</span>`
                    document.querySelector('.product-add-btn')?.removeAttribute('style');
                    if (this.available === 0) {
                        document.querySelector('.product-add-btn')?.innerHTML = `NOT AVAILABLE ANYMORE`;
                        document.querySelector('.product-add-btn')?.style.background = `grey`;
                    }
                    if (document.querySelector('.already-in')) {
                        document.querySelector('.already-in')?.innerHTML = `You already have ${this.itemWeNeedToFind.amount} in your cart`;
                    } else if (!document.querySelector('.already-in')) {
                        let availableInCart = document.createElement('div');
                        availableInCart.classList.add('already-in');
                        availableInCart.innerHTML = `You already have ${this.itemWeNeedToFind.amount} in your cart`;
                        document.querySelector('.buy-buttons-container')?.appendChild(availableInCart);
                        availableInCart.style.left = `${(document.querySelector('.buy-buttons-container').offsetWidth / 2) - (document.querySelector('.already-in').offsetWidth / 2)}px`;
                    }
                } else if (JSON.parse(localStorage.getItem('fullCart')).filter(el => el.id === this.cartProduct.id && el.size === this.cartProduct.size).length === 0) {
                    document.querySelector('input').value = 1;
                    document.querySelector('input')?.placeholder = '1';
                    this.itemWeNeedToFind = JSON.parse(localStorage.getItem('fullCart')).filter(el => el.id === this.cartProduct.id && el.size === this.cartProduct.size)[0];
                    console.log('ya nol')
                    this.available = 10;
                    this.cartProduct.amount = 1;
                    document.querySelector('.product-add-btn')?.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
                    <g fill="none" fill-rule="evenodd"><path stroke="currentColor" stroke-width="2" d="M3.5 0v13.65h10.182L17.5 4.095h-14"></path><ellipse fill="currentColor" fill-rule="nonzero" cx="4" cy="17.9" rx="1.5" ry="1.575"></ellipse><ellipse fill="currentColor" fill-rule="nonzero" cx="12" cy="17.9" rx="1.5" ry="1.575"></ellipse>
                    </g>
                </svg>
                <span class="price-span">$${this.selectedProduct.price} USD</span>`
                    document.querySelector('.product-add-btn')?.removeAttribute('style');
                    if (document.querySelector('.already-in')) {
                        document.querySelector('.buy-buttons-container')?.removeChild(document.querySelector('.already-in'))
                    } else if (!document.querySelector('.already-in')) {
                        let availableInCart = document.createElement('div');
                        availableInCart.classList.add('already-in');
                        availableInCart.innerHTML = `You already have ${this.itemWeNeedToFind.amount} in your cart`;
                        document.querySelector('.buy-buttons-container')?.appendChild(availableInCart);
                        availableInCart.style.left = `${(document.querySelector('.buy-buttons-container').offsetWidth / 2) - (document.querySelector('.already-in').offsetWidth / 2)}px`;
                    }
                }
            }
        })
        document.querySelector('.product-add-btn')?.addEventListener('click', () => {
            let counter = document.querySelector('[data-counter]');
            if (this.available !== 0) {
                this.cartProduct.size = document.querySelector('.product-sizes')?.value;
                if (localStorage.getItem('fullCart')) {
                    let arr = JSON.parse(localStorage.getItem('fullCart'));
                    if (arr.some((el) => el.id === this.cartProduct.id && el.size === this.cartProduct.size)) {
                        arr.map((el) => {
                            if (el.id === this.cartProduct.id && el.size === this.cartProduct.size) {
                                el.amount += Number(counter?.querySelector('input')?.value);
                            }
                            return el;
                        })
                    } else {
                        arr.push(this.cartProduct);
                    }
                    localStorage.setItem('fullCart', JSON.stringify(arr));
                    document.querySelector('.cart-amount')?.innerHTML = `${JSON.parse(localStorage.getItem('fullCart')).length}`;
                } else {
                    localStorage.setItem('fullCart', JSON.stringify([this.cartProduct]));
                    document.querySelector('.cart-amount')?.innerHTML = `${JSON.parse(localStorage.getItem('fullCart')).length}`;
                }
                if (localStorage.getItem('fullCart')) {
                    if (JSON.parse(localStorage.getItem('fullCart')).filter(el => el.id === this.cartProduct.id && el.size === this.cartProduct.size).length > 0) {
                        this.itemWeNeedToFind = JSON.parse(localStorage.getItem('fullCart')).filter(el => el.id === this.cartProduct.id && el.size === this.cartProduct.size)[0];
                        this.available = 10 - this.itemWeNeedToFind.amount;
                        if (document.querySelector('.already-in')) {
                            document.querySelector('.already-in')?.innerHTML = `You already have ${this.itemWeNeedToFind.amount} in your cart`;
                        } else if (!document.querySelector('.already-in')) {
                            let availableInCart = document.createElement('div');
                            availableInCart.classList.add('already-in');
                            availableInCart.innerHTML = `You already have ${this.itemWeNeedToFind.amount} in your cart`;
                            document.querySelector('.buy-buttons-container')?.appendChild(availableInCart);
                            availableInCart.style.left = `${(document.querySelector('.buy-buttons-container').offsetWidth / 2) - (document.querySelector('.already-in').offsetWidth / 2)}px`;
                        }
                    }
                }
                if (this.available === 0) {
                    document.querySelector('.product-add-btn')?.innerHTML = `NOT AVAILABLE ANYMORE`;
                    document.querySelector('.product-add-btn')?.style.background = `grey`;
                }
                document.querySelector('.counter__button-minus').style.transition = `0s`;
                counter?.querySelector('input')?.value = 1;
                counter?.querySelector('input')?.placeholder = '1';
                document.querySelector('.counter__button-minus').classList.add('disabled');
                setTimeout(() => {
                    document.querySelector('.counter__button-minus')?.removeAttribute('style');
                }, 50)
            } else {
                document.querySelector('.counter__button-minus').style.transition = `0s`;
                document.querySelector('.product-add-btn')?.innerHTML = `NOT AVAILABLE ANYMORE`;
                document.querySelector('.product-add-btn')?.style.background = `grey`;
                counter?.querySelector('input')?.value = 1;
                counter?.querySelector('input')?.placeholder = '1';
                document.querySelector('.counter__button-minus').classList.add('disabled');
                setTimeout(() => {
                    document.querySelector('.counter__button-minus')?.removeAttribute('style');
                }, 50)
            }
        })
        document.querySelector('#slides-container')?.addEventListener('click', () => {
            let productSlider = document.querySelector('.product__slider');
            let background = document.createElement('div');
            background.classList.add('blackout');
            if (!productSlider?.classList.contains('active')) {
                document.querySelector('body')?.appendChild(background);
                productSlider?.classList.add('active');
                productSlider.style.width = `${productSlider.offsetWidth}px`
                productSlider.style.height = `${productSlider.offsetHeight * 1.5}px`
                productSlider.style.left = `${(document.querySelector('.product').offsetWidth - productSlider.offsetWidth) / 2}px`
                document.getElementById('slides-container').style.width = `${productSlider.offsetWidth}px`;
                window.addEventListener('click', (e) => {
                    if (e.target.className === "blackout") {
                        productSlider?.classList.remove('active');
                        productSlider.style = ``;
                        let body = document.querySelector('body');
                        if (document.querySelector('.blackout')) {
                            body.removeChild(document.querySelector('.blackout'));
                        }
                        window.onclick = null;
                    }
                })
            } else if (productSlider?.classList.contains('active')) {
                productSlider?.classList.remove('active');
                productSlider.style = ``;
                let body = document.querySelector('body');
                if (document.querySelector('.blackout')) {
                    body.removeChild(document.querySelector('.blackout'));
                }
                window.onclick = null;
            }
        })
        document.querySelector('.product-buy-now-btn')?.addEventListener('click', () => {
            this.cartProduct.size = document.querySelector('.product-sizes')?.value;
            if (localStorage.getItem('fullCart')) {
                let arr = JSON.parse(localStorage.getItem('fullCart'));
                if (arr.some((el) => el.id === this.cartProduct.id && el.size === this.cartProduct.size)) {
                    arr.map((el) => {
                        if (el.id === this.cartProduct.id && el.size === this.cartProduct.size && el.amount !== 0) {
                            el.amount += this.cartProduct.amount;
                        } else if (el.id === this.cartProduct.id && el.size === this.cartProduct.size && el.amount === 0) {
                            el.amount += 1;
                        }
                        return el;
                    })
                } else {
                    arr.push(this.cartProduct);
                }
                localStorage.setItem('fullCart', JSON.stringify(arr));
                document.querySelector('.cart-amount')?.innerHTML = `${JSON.parse(localStorage.getItem('fullCart')).length}`;
            } else {
                localStorage.setItem('fullCart', JSON.stringify([this.cartProduct]));
                document.querySelector('.cart-amount')?.innerHTML = `${JSON.parse(localStorage.getItem('fullCart')).length}`;
            }

            window.location.href = '/?method=buynow#/cart';
        })
    }
    render = () => {
        if (!this.selectedProduct) return `Product not found`
        return `
        <div class="product-road">
            <a href="#/category/">Categories</a>
            <span>></span>
            <a href="#/category/${categories[this.selectedProduct.categoryId - 1].name}">${categories[this.selectedProduct.categoryId - 1].name}</a>
            <span>></span>
            <span>${this.selectedProduct.name + ' ' + this.selectedProduct.type + ' ' + this.selectedProduct.gender + ' ' + this.selectedProduct.colorHTML}</span>
        </div>
        <div class="product">
        <div class="product__slider">
            <button class="slider-left"><span></span></button>
            <div id="slides-container">
                <img class="slider-image" src="${this.selectedProduct.url[this.i]}" alt="card-image">
            </div>
            <button class="slider-right"><span></span></button>
        </div>
        <div class="product__info">
            <h2 class="product-name">${this.selectedProduct.name}</h2>
            <div class="product-brand">${this.selectedProduct.brand.toUpperCase()}</div>
            <div class="product-color">COLOR:<p>${this.selectedProduct.colorHTML}</p></div>
            <div class="product-rating-container">
                <div class="product-rating-line" style="width:${(this.selectedProduct.rating * 10 * 2)}%"></div>
                <img src="${starsImage}" alt="stars-rating-image">
            </div>
            <div class="product-available-colors">${this.selectedProduct.availableColors.map((_el, index) => {
            if (this.selectedProduct.id === this.filterAvailableColors()[index].id) {
                return `<a href="#/product/${this.filterAvailableColors()[index].id}"><img class="product-color-btn activated" src="${this.filterAvailableColors()[index].url[0]}"></img></a>`
            }
            return `<a href="#/product/${this.filterAvailableColors()[index].id}"><img class="product-color-btn" src="${this.filterAvailableColors()[index].url[0]}"></img></a>`
        }).join('')}</div>
            <div class="select">
                <select class="product-sizes">
                    ${this.sizesString()}
                </select>
            </div>
            <div class="counter" data-counter>
                <div class="counter__button counter__button-minus disabled">-</div>
                <div class="counter__input"><input type="text" disabled placeholder="1" value="1"></div>
                <div class="counter__button counter__button-plus">+</div>
            </div>
            <h3 class="product-description-h2">Description:</h3>
            <div class="product-description">${this.selectedProduct.description}</div>
            <div class="buy-buttons-container">
                <button class="product-add-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
                    <g fill="none" fill-rule="evenodd"><path stroke="currentColor" stroke-width="2" d="M3.5 0v13.65h10.182L17.5 4.095h-14"></path><ellipse fill="currentColor" fill-rule="nonzero" cx="4" cy="17.9" rx="1.5" ry="1.575"></ellipse><ellipse fill="currentColor" fill-rule="nonzero" cx="12" cy="17.9" rx="1.5" ry="1.575"></ellipse>
                    </g>
                </svg>
                <span class="price-span">$${this.selectedProduct.price} USD</span>
                </button>
                <button class="product-buy-now-btn">
                    <span class="price-span1">BUY NOW</span>
                </button>
            </div>
        </div>
    </div>`
    }
}

export default Product