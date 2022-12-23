// @ts-nocheck
import { parseRequestURL } from "../helpers/utils.ts";
import { items, categories } from "../data.ts";
import starsImage from "../img/stars5.png";
const request = parseRequestURL()
const neededItemId = +(request.id);

const {name, colorHTML, availableColors, categoryId, brand, type, gender, price, description, url, rating, sizes, id} = items[neededItemId];

// transformation of available sizes in Product object to html-string, that we add to render()
function sizesString() {
    const sizesArrLength = sizes.length;
    let resultString = '';
    for (let i = 0; i < sizesArrLength; i++) {
        resultString += `<option value='${sizes[i]}'>${sizes[i]}</option>`
    }
    return resultString;
}
//---------------------------------------------------------------------------------

// filter available product colors and sort from the active color to other colors that we add to the render function() as available product colors
function filterAvailableColors() {
    let filteredArray = items.filter((el) => (el.name === name && el.categoryId === categoryId));
    filteredArray.sort(el => {
         if (el.colorHTML === colorHTML) {
            return -1;
         } else {
            return 1;
         }});
    return filteredArray;
}
//---------------------------------------------------------------------------------

let i = 0;

function iterator() {
    if (i === 0) {
        i = 2;
    } else {
        i -= 1;
    }
    return i;
} 



function sliderLeft() {
    document.querySelector('.slider-left')?.removeEventListener('click', sliderLeft);
    document.querySelector('.slider-right')?.removeEventListener('click', sliderRight);
    let ParentNode = document.getElementById('slides-container');
    let firstChild = ParentNode.firstChild;
    let newSlide = document.createElement('img');
    newSlide.setAttribute('src', `${url[iterator()]}`);
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
        document.querySelector('.slider-left')?.addEventListener('click', sliderLeft);
        document.querySelector('.slider-right')?.addEventListener('click', sliderRight);
        }, 500)
    }, 500);
}
function sliderRight() {
    document.querySelector('.slider-right')?.removeEventListener('click', sliderRight);
    document.querySelector('.slider-left')?.removeEventListener('click', sliderLeft);
    let ParentNode = document.getElementById('slides-container');
    let firstChild = ParentNode.firstChild;
    let newSlide = document.createElement('img');
    newSlide.setAttribute('src', `${url[iterator()]}`);
    newSlide.setAttribute('alt', `card-image`);
    newSlide.classList.add('slider-image');
    ParentNode?.appendChild(newSlide);
    ParentNode?.style.width = `${document.querySelector('.product__slider')?.offsetWidth * 2}px`;
    console.log(document.querySelector('.product__slider')?.offsetWidth)
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
        document.querySelector('.slider-right')?.addEventListener('click', sliderRight);
        document.querySelector('.slider-left')?.addEventListener('click', sliderLeft);
        }, 500)
    }, 500);
}
const cartProduct = {
    id: id,
    amount: 1, 
    size: '',
}
const Product = {
    bind: () => {
        document.querySelector('.slider-left')?.addEventListener('click', sliderLeft);
        document.querySelector('.slider-right')?.addEventListener('click', sliderRight);
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

                        if (target.classList.contains('counter__button-plus')) {
                            value++;
                            target.closest('.counter').querySelector('input').value = value
                            cartProduct.amount = +(target.closest('.counter').querySelector('input').value)
                            document.querySelector('.price-span')?.innerHTML = `$${price*value} USD`
                        } else {
                            value--;
                            target.closest('.counter').querySelector('input').value = value
                            cartProduct.amount = +(target.closest('.counter').querySelector('input').value)
                            document.querySelector('.price-span')?.innerHTML = `$${price*value} USD`
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
        document.querySelector('.product-add-btn')?.addEventListener('click', () => {
            cartProduct.size = document.querySelector('.product-sizes')?.value;
            if (localStorage.getItem('fullCart')) {
                let arr = JSON.parse(localStorage.getItem('fullCart'));
                if (arr.some((el) => el.id === cartProduct.id && el.size === cartProduct.size )) {
                    arr.map((el) => {
                        if (el.id === cartProduct.id && el.size === cartProduct.size ) {
                            el.amount = cartProduct.amount;
                        }
                        return el;
                    })
                } else {
                    arr.push(cartProduct);
                }
                localStorage.setItem('fullCart', JSON.stringify(arr));
            } else {
                localStorage.setItem('fullCart', JSON.stringify([cartProduct]));
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
        document.querySelectorAll('.product-color-btn').forEach((el) => el.addEventListener('click', () => console.log(1)))
    },
    render: () => {
        return `
        <div class="product-road">
            <a href="#/category/">Categories</a>
            <span>></span>
            <a href="#/category/:${categoryId}">${categories[categoryId-1].name}</a>
            <span>></span>
            <a href="#/product/:${id}">${name + ' ' + type + ' ' + gender + ' ' + colorHTML}</a>
        </div>
        <div class="product">
        <div class="product__slider">
            <button class="slider-left"><span></span></button>
            <div id="slides-container">
                <img class="slider-image" src="${url[i]}" alt="card-image">
            </div>
            <button class="slider-right"><span></span></button>
        </div>
        <div class="product__info">
            <h2 class="product-name">${name}</h2>
            <div class="product-brand">${brand.toUpperCase()}</div>
            <div class="product-color">COLOR:<p>${colorHTML}</p></div>
            <div class="product-rating-container">
                <div class="product-rating-line" style="width:${(rating*10*2)}%"></div>
                <img src="${starsImage}" alt="stars-rating-image">
            </div>
            <div class="product-available-colors">${availableColors.map((_el, index) => {
                if (index === 0) {
                    return `<a href="#/product/${filterAvailableColors()[index].id}"><img class="product-color-btn activated" src="${filterAvailableColors()[index].url[0]}"></img></a>`
                }
                return `<a href="#/product/${filterAvailableColors()[index].id}"><img class="product-color-btn" src="${filterAvailableColors()[index].url[0]}"></img></a>`
            }).join('')}</div>
            <div class="select">
                <select class="product-sizes">
                    ${sizesString()}
                </select>
            </div>
            <div class="counter" data-counter>
                <div class="counter__button counter__button-minus">-</div>
                <div class="counter__input"><input type="text" disabled placeholder="1" value="1"></div>
                <div class="counter__button counter__button-plus">+</div>
            </div>
            <h3 class="product-description-h2">Description:</h3>
            <div class="product-description">${description}</div>
            <button class="product-add-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
                    <g fill="none" fill-rule="evenodd"><path stroke="currentColor" stroke-width="2" d="M3.5 0v13.65h10.182L17.5 4.095h-14"></path><ellipse fill="currentColor" fill-rule="nonzero" cx="4" cy="17.9" rx="1.5" ry="1.575"></ellipse><ellipse fill="currentColor" fill-rule="nonzero" cx="12" cy="17.9" rx="1.5" ry="1.575"></ellipse>
                    </g>
                </svg>
                <span class="price-span">$${price} USD</span>
            </button>
        </div>
    </div>`
    },
}

export default Product