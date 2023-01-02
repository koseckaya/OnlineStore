// @ts-nocheck
import { parseRequestURL } from "../helpers/utils.ts";
import { items, categories } from "../data.ts";
import starsImage from "../img/stars5.png";

class Product {
    i = 0;
    selectedProduct = null;
    available = 10;
    cartProduct = {
        id: -1,
        amount: 1,
        size: `${items[+(parseRequestURL().id)]['sizes'][0]}`
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

    
    iterator = () => {
        if (this.i === 0) {
            this.i = 2;
        } else {
            this.i -= 1;
        }
        return this.i;
    }
    sliderLeft = () => {
        console.log(this.cartProduct)
        let ParentNode = document.getElementById('slides-container');
        let firstChild = ParentNode.firstChild;
        let newSlide = document.createElement('img');
        const srcLeft = this.selectedProduct.url[this.iterator()]
        newSlide.setAttribute('src', srcLeft);
        newSlide.setAttribute('alt', `card-image`);
        newSlide.classList.add('slider-image');
        ParentNode.insertBefore(newSlide, firstChild);
        let startWidth = ParentNode?.offsetWidth;
        ParentNode?.style.width = `${ParentNode?.offsetWidth * 2}px`;
        ParentNode?.style.transform = `translateX(-${document.querySelector('.product__slider')?.offsetWidth}px)`;
        ParentNode?.style.animation = `blur .5s`;
        setTimeout(function(){
            ParentNode?.style.transition = `all .5s ease-in-out`;
            ParentNode?.style.transform = `translateX(0px)`;
            ParentNode?.style.animation = ``;
            setTimeout(function(){
                ParentNode?.removeChild(ParentNode.lastElementChild);
                ParentNode?.style.width = `${document.querySelector('.product__slider')?.offsetWidth}px`;
                ParentNode?.style.transition = `all .0s ease-in-out`;
            }, 500)
        }, 500);
    }

    sliderRight = () => {
        let ParentNode = document.getElementById('slides-container');
        let firstChild = ParentNode.firstChild;
        let newSlide = document.createElement('img');
        newSlide.setAttribute('src', `${this.selectedProduct.url[this.iterator()]}`);
        newSlide.setAttribute('alt', `card-image`);
        newSlide.classList.add('slider-image');
        ParentNode?.appendChild(newSlide);
        ParentNode?.style.width = `${document.querySelector('.product__slider')?.offsetWidth * 2}px`;
        ParentNode?.style.animation = `blur .5s`;
        setTimeout(function(){
            ParentNode?.style.transition = `all .5s ease-in-out`;
            ParentNode?.style.transform = `translateX(${-document.querySelector('.product__slider')?.offsetWidth}px)`;
            ParentNode?.style.animation = ``;
            setTimeout(function(){
            ParentNode?.removeChild(ParentNode.firstElementChild);
            ParentNode?.style.width = `${document.querySelector('.product__slider')?.offsetWidth}px`;
            ParentNode?.style.transform = `translateX(0px)`;
            ParentNode?.style.transition = `all .0s ease-in-out`;
            }, 500)
        }, 500);
    }

    

    // transformation of available sizes in Product object to html-string, that we add to render()
    sizesString = () => {
        const sizesArrLength = this.selectedProduct.sizes.length;
        let resultString = '';
        for (let i = 0; i < sizesArrLength; i++) {
            resultString += `<option value='${this.selectedProduct.sizes[i]}'>${this.selectedProduct.sizes[i]}</option>`

        }
        return resultString;
    }
    //---------------------------------------------------------------------------------

    // filter available product colors and sort from the active color to other colors that we add to the render function() as available product colors
    filterAvailableColors = () => {
        let filteredArray = items.filter((el) => (el.name === this.selectedProduct.name && el.categoryId === this.selectedProduct.categoryId));
        return filteredArray;
    }
    //---------------------------------------------------------------------------------

    bind = () => {
        document.querySelector('.slider-left')?.addEventListener('click', this.sliderLeft);
        document.querySelector('.slider-right')?.addEventListener('click', this.sliderRight);
        const counters = document.querySelectorAll('[data-counter]');
        if (counters) {
            counters.forEach(counter => {
                counter.addEventListener('click', e => {
                    const target = e.target;
                    if (target.closest('.counter__button')) {
                        if (target.closest('.counter').querySelector('input').value == '' && (target.classList.contains('counter__button-minus') || target.classList.contains('counter__button-plus'))) {
                            target.closest('.counter').querySelector('input').value = 1;
                        }

                        let value = parseInt(target.closest('.counter').querySelector('input').value);

                        if (target.classList.contains('counter__button-plus') && value < this.available) {
                            value++;
                            target.closest('.counter').querySelector('input').value = value
                            this.cartProduct.amount = +(target.closest('.counter').querySelector('input').value)
                            document.querySelector('.price-span')?.innerHTML = `$${this.selectedProduct.price*value} USD`
                        } else if (target.classList.contains('counter__button-minus')) {
                            value--;
                            target.closest('.counter').querySelector('input').value = value
                            this.cartProduct.amount = +(target.closest('.counter').querySelector('input').value)
                            document.querySelector('.price-span')?.innerHTML = `$${this.selectedProduct.price*value} USD`
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
            })	
        }
        document.querySelector('.product-sizes')?.addEventListener('click', (e) => {
            this.cartProduct.size = e.target?.value;
            let arr = JSON.parse(localStorage.getItem('fullCart')).filter(el => el.id === Number(parseRequestURL().id) && el.size === this.cartProduct.size);
            console.log(this.cartProduct)
        })
        document.querySelector('.product-add-btn')?.addEventListener('click', () => {
            this.cartProduct.size = document.querySelector('.product-sizes')?.value;
            if (localStorage.getItem('fullCart')) {
                let arr = JSON.parse(localStorage.getItem('fullCart'));
                if (arr.some((el) => el.id === this.cartProduct.id && el.size === this.cartProduct.size )) {
                    arr.map((el) => {
                        if (el.id === this.cartProduct.id && el.size === this.cartProduct.size ) {
                            el.amount += this.cartProduct.amount;
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
        })
        document.querySelector('#slides-container')?.addEventListener('click', () => {
            let productSlider = document.querySelector('.product__slider');
            let background = document.createElement('div');
            background.classList.add('blackout');
            if (!productSlider?.classList.contains('active')) {
                document.querySelector('body')?.appendChild(background);
                productSlider?.classList.add('active');
                productSlider.style.width = `${productSlider.offsetWidth}px`
                productSlider.style.height = `${productSlider.offsetHeight*1.5}px`
                productSlider.style.left = `${(document.querySelector('.product').offsetWidth - productSlider.offsetWidth)/2}px`
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
                if (arr.some((el) => el.id === this.cartProduct.id && el.size === this.cartProduct.size )) {
                    arr.map((el) => {
                        if (el.id === this.cartProduct.id && el.size === this.cartProduct.size && el.amount !== 0) {
                            el.amount += this.cartProduct.amount;
                        } else if (el.id === this.cartProduct.id && el.size === this.cartProduct.size && el.amount === 0){
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
            window.location.href = './#/cart';
        })
    }
    render = () => {
        return `
        <div class="product-road">
            <a href="#/category/">Categories</a>
            <span>></span>
            <a href="#/category/${categories[this.selectedProduct.categoryId-1].name}">${categories[this.selectedProduct.categoryId-1].name}</a>
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
                <div class="product-rating-line" style="width:${(this.selectedProduct.rating*10*2)}%"></div>
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
                    <span class="price-span">BUY NOW</span>
                </button>
            </div>
        </div>
    </div>`
    }
}

export default Product