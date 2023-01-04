
import { parseRequestURL } from "../helpers/utils";
import { items, categories } from "../data";
const starsImage = require('../img/stars5.png') as string
import { cartProductType, ModuleInterface, storageItem } from "./types";
import { Item } from "../types";

class Product implements ModuleInterface {
    i: number = 0;
    selectedProduct: Item | null = null;
    cartProduct: cartProductType = {
        id: 0,
        amount: 1,
        size: '',
    };

    constructor() {
        const request = parseRequestURL()
        const neededItemId = Number(request.id);
        if (neededItemId) {
            this.selectedProduct = items[neededItemId];
            this.cartProduct.id = this.selectedProduct.id
        } else {
            this.selectedProduct = items[0];
            this.cartProduct.id = this.selectedProduct.id
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
    //---------------------------------------------------------------------------------

    bind = (): void => {
        document.querySelector('.slider-left')?.addEventListener('click', this.sliderLeft);
        document.querySelector('.slider-right')?.addEventListener('click', this.sliderRight);
        const counters = document.querySelectorAll('[data-counter]');
        if (counters) {
            counters.forEach(counter => {
                counter.addEventListener('click', (e: Event) => {
    
                    const target = e.target as HTMLElement;
                    const closestCounter = target.closest('.counter')
                    const closestBtn = target.closest('.counter__button')
                    const counterMinusBtn = target.classList.contains('counter__button-minus')
                    const counterPlusBtn = target.classList.contains('counter__button-plus')
                    const priceSpan = document.querySelector('.price-span')
                    
                    if (target && closestCounter && closestBtn) {
                        const inputEl = closestCounter.querySelector('input')
                        if (inputEl && priceSpan && this.selectedProduct) {
                            if (inputEl.value == '' && (counterMinusBtn || counterPlusBtn)) {
                                inputEl.value = '1';
                            }
                            let value = parseInt(inputEl.value);
                            if (counterPlusBtn) {
                                value++;
                                inputEl.value = `${value}`
                                this.cartProduct.amount = +(inputEl.value)
                                priceSpan.innerHTML = `$${this.selectedProduct.price * value} USD`;
                            } else {
                                value--;
                                inputEl.value = `${value}`
                                this.cartProduct.amount = +(inputEl.value)
                                priceSpan.innerHTML = `$${this.selectedProduct.price * value} USD`;
                            }
                            const minusBtn = closestCounter.querySelector('.counter__button-minus')
                                if (value <= 1) {
                                    value = 1;
                                    if (minusBtn) minusBtn.classList.add('disabled')
                                } else {
                                    if (minusBtn) minusBtn.classList.remove('disabled')
                                }
                            inputEl.value = `${value}`;
                            }
                    }
                })
            })	
        }
        document.querySelector('.product-add-btn')?.addEventListener('click', () => {
            this.cartProduct.size = (document.querySelector('.product-sizes') as HTMLInputElement).value;
            const fullCart = localStorage.getItem('fullCart');
            const cartAmount = document.querySelector('.cart-amount')
            if (cartAmount && fullCart) {
                let arr: storageItem[] = JSON.parse(fullCart);
                if (arr.some((el) => el.id === this.cartProduct.id && el.size === this.cartProduct.size)) {
                    arr.map((el) => {
                        if (el.id === this.cartProduct.id && el.size === this.cartProduct.size ) {
                            el.amount = +el.amount  + this.cartProduct.amount;
                        }
                        return el;
                    })
                } else {
                    arr.push(this.cartProduct);
                }
                localStorage.setItem('fullCart', JSON.stringify(arr));
                cartAmount.innerHTML = `${JSON.parse(fullCart).length}`;
            } else {
                localStorage.setItem('fullCart', JSON.stringify([this.cartProduct]));
                if (cartAmount && fullCart) cartAmount.innerHTML = `${JSON.parse(fullCart).length}`;
            }
        })
        document.querySelector('#slides-container')?.addEventListener('click', () => {
            let productSlider = document.querySelector('.product__slider');
            let background = document.createElement('div');
            background.classList.add('blackout');
            if (productSlider && !productSlider?.classList.contains('active')) {
                document.querySelector('body')?.appendChild(background);
                productSlider.classList.add('active');
                (productSlider as HTMLDivElement).style.width = `${(productSlider as HTMLDivElement).offsetWidth}px`;
                (productSlider as HTMLDivElement).style.height = `${(productSlider as HTMLDivElement).offsetHeight * 1.5}px`;
                (productSlider as HTMLDivElement).style.left = `${((document.querySelector('.product') as HTMLDivElement) .offsetWidth - (productSlider as HTMLDivElement).offsetWidth) / 2}px`;
                (document.getElementById('slides-container') as HTMLDivElement).style.width = `${(productSlider as HTMLDivElement).offsetWidth}px`;
                window.addEventListener('click', (e: Event) => {
                    if (e.target && (e.target as HTMLElement).className === "blackout") {
                        productSlider?.classList.remove('active');
                        if (productSlider) (productSlider as HTMLDivElement).setAttribute('style', '');
                        const body = document.querySelector('body');
                        const blackout = document.querySelector('.blackout')
                        if (body && blackout) {
                            body.removeChild(blackout);
                        }
                        window.onclick = null;
                    } 
                })
            } else if (productSlider?.classList.contains('active')) {
                productSlider?.classList.remove('active');
               (productSlider as HTMLDivElement).setAttribute('style', '');
                const body = document.querySelector('body');
                const blackout = document.querySelector('.blackout')
                if (body && blackout) {
                    body.removeChild(blackout);
                }
                window.onclick = null;
            }
        })
        document.querySelector('.product-buy-now-btn')?.addEventListener('click', () => {
            this.cartProduct.size = (document.querySelector('.product-sizes') as HTMLInputElement).value;
            const fullCart = localStorage.getItem('fullCart');
             const cartAmount = document.querySelector('.cart-amount')
            if ( cartAmount && fullCart) {
                let arr: storageItem[] = JSON.parse(fullCart);
                if (arr.some((el) => el.id === this.cartProduct.id && el.size === this.cartProduct.size )) {
                    arr.map((el) => {
                        if (el.id === this.cartProduct.id && el.size === this.cartProduct.size ) {
                            el.amount = +el.amount  + this.cartProduct.amount;
                        }
                        return el;
                    })
                } else {
                    arr.push(this.cartProduct);
                }
                localStorage.setItem('fullCart', JSON.stringify(arr));
                cartAmount.innerHTML = `${JSON.parse(fullCart).length}`;
            } else {
                localStorage.setItem('fullCart', JSON.stringify([this.cartProduct]));
                if (cartAmount && fullCart) cartAmount.innerHTML = `${JSON.parse(fullCart).length}`;
            }

            window.location.href = '/?method=buynow#/cart' ;
        })
    }
    render = () => {
        if (!this.selectedProduct) return `Product not found`
        return `
        <div class="container">
        <div class="product-road">
            <a href="#/category/">Categories</a>
            <span>></span>
            <a href="#/category/${this.selectedProduct?.categoryId}">${categories[this.selectedProduct?.categoryId-1].name}</a>
            <span>></span>
            <a href="#/product/:${this.selectedProduct?.id}">${this.selectedProduct.name + ' ' + this.selectedProduct.type + ' ' + this.selectedProduct.gender + ' ' + this.selectedProduct.colorHTML}</a>

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
                <div class="product-rating-line" style="width:${(this.selectedProduct.rating*10*2)}%"></div>
                <img src="${starsImage}" alt="stars-rating-image">
            </div>
            <div class="product-available-colors">${this.selectedProduct.availableColors.map((_el, index) => {
                if (index === 0) {

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
                <div class="counter__button counter__button-minus">-</div>
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
                    <span class="price-span">BUY NOW</span>
                </button>
            </div>

        </div>
    </div></div>`
    }
}

export default Product