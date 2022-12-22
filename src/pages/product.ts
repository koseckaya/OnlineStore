// @ts-nocheck
import { parseRequestURL } from "../helpers/utils.ts";
import { items } from "../data.ts";
import starsImage from "../img/stars5.png";
const request = parseRequestURL()
const neededItemId = request.id;
const {name, colorHTML, availableColors, categoryId, brand, type, gender, price, description, url, rating, sizes} = items[neededItemId-1];

console.log(starsImage)
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
    ParentNode?.style.transform = `translateX(-${startWidth}px)`;
    ParentNode?.style.animation = `blur .5s`;
    setTimeout(function(){
        ParentNode?.style.transition = `all .5s ease`;
        ParentNode?.style.transform = `translateX(0px)`;
        ParentNode?.style.animation = ``;
        setTimeout(function(){
        ParentNode?.removeChild(ParentNode.lastElementChild);
        ParentNode?.style.width = `${startWidth}px`;
        ParentNode?.style.transition = `all .0s ease`;
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
    let startWidth = ParentNode?.offsetWidth;
    ParentNode?.style.width = `${ParentNode?.offsetWidth * 2}px`;
    
    ParentNode?.style.animation = `blur .5s`;
    setTimeout(function(){
        ParentNode?.style.transition = `all .5s ease`;
        ParentNode?.style.transform = `translateX(${-startWidth}px)`;
        ParentNode?.style.animation = ``;
        setTimeout(function(){
        ParentNode?.removeChild(ParentNode.firstElementChild);
        ParentNode?.style.width = `${startWidth}px`;
        ParentNode?.style.transform = `translateX(0px)`;
        ParentNode?.style.transition = `all .0s ease`;
        document.querySelector('.slider-right')?.addEventListener('click', sliderRight);
        document.querySelector('.slider-left')?.addEventListener('click', sliderLeft);
        }, 500)
    }, 500);
}

const Product = {
    bind: () => {
        document.querySelector('.slider-left')?.addEventListener('click', sliderLeft);
        document.querySelector('.slider-right')?.addEventListener('click', sliderRight);
    },
    render: () => {
        console.log({colorHTML, categoryId, brand, type, gender, price, description, url, rating, sizes})
        return `<div class="product">
        <div class="product__slider">
            <button class="slider-left"><span></span></button>
            <div id="slides-container">
                <img class="slider-image" src="${url[i]}" alt="card-image">
            </div>
            <button class="slider-right"><span></span></button>
        </div>
        <div class="product__info">
            <h2 class="product-name">${name}</h2>
            <p class="product-color">${colorHTML}</p>
            <div class="product-rating-container">
                <div class="product-rating-line" style="width:${(rating*10*2)}%"></div>
                <img src="${starsImage}">
            </div>
            <div class="product-available-colors">${availableColors.map((_el, index) => {
                return `<img class="product-color-btn" src="${filterAvailableColors()[index].url[0]}"></img>`
            }).join('')}</div>
            <p class="product-price"></p>
            <select class="product-sizes">
                ${sizesString()}
            </select>
            <h3 class="product-description-h2">Description:</h3>
            <div class="product-description">${description}</div>
            <button class="product-add-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
                    <g fill="none" fill-rule="evenodd"><path stroke="currentColor" stroke-width="2" d="M3.5 0v13.65h10.182L17.5 4.095h-14"></path><ellipse fill="currentColor" fill-rule="nonzero" cx="4" cy="17.9" rx="1.5" ry="1.575"></ellipse><ellipse fill="currentColor" fill-rule="nonzero" cx="12" cy="17.9" rx="1.5" ry="1.575"></ellipse>
                    </g>
                </svg>
                <span>$${price} USD</span>
            </button>
        </div>
    </div>`
    },
}

export default Product