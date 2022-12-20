// @ts-nocheck
import { items, categories } from '../data.ts';
import { parseRequestURL, getUrlParams, setUrlParams } from '../helpers/utils.ts';

class Category {
    filters = {
        size: '',
        color: '',
        categoryId: 0,
    };

    constructor() {
        let categoryId = this.getCategoryId();
        this.filters.categoryId = categoryId;

        const urlParams = getUrlParams();

        if (urlParams.has('size')) {
            this.filters.size = urlParams.get('size');
        }

        if (urlParams.has('color')) {
            this.filters.color = urlParams.get('color');
        }

        console.log(this.filters);
    }
    
    getCategoryId = () => {
        const request = parseRequestURL()
        let categoryId = 0;
        categories.forEach(cat => {
            if (cat.name.toLowerCase() === request.id) {
                categoryId = cat.id;
            }
        })
       return categoryId
    }

    getFilterItems = () => {
        const { categoryId, color, size } = this.filters;

        if (categoryId === 0) return items;
        return items.filter(item => item.categoryId === categoryId);
    }
    
    sortByPrice = () => {
        return items.sort((a, b) => a.price > b.price ? 1 : -1);
    }
    
    
    filterGoods = (e) => {
        const filters = document.querySelector('.filters')
        const size = filters.querySelector('#filter-size').value
        const color = filters.querySelector('#filter-color').value
        const filteredItems =  items.filter(item => 
            //(item.size.toLowerCase() === size.toLowerCase()) &&
            (item.color.toLowerCase() === color.toLowerCase())
        );
        console.log( filteredItems);
        return filteredItems
    }

    handleChangeFilters = (e) => {
        const { name, value } = e.target;
        console.log('у', e.target);
        this.filters[name] = value;

        this.updateUrlParams()
    }

    updateUrlParams = () => {
        const { categoryId, ...rest} = this.filters
        setUrlParams(rest)
    }

    bind = () => {

        const lists = document.querySelectorAll(".filters select");
        for (let i = 0; i < lists.length; i++) {
            lists[i].addEventListener('change', this.handleChangeFilters)
        }
    }

    render = () => {
   
        const filteredItems = this.getFilterItems()

        return `
        <div class="categories">
            <div class="bread-crumbs"></div>

            <div class="categories-side">
                <h2 class="side__title">Каталог</h2>
                <ul class="categ-list">
                    <li class="categ-item"><a href="/#/category">All</a></li>
                    ${categories.map(cat => `
                        <li class="categ-item">
                            <a href="/#/category/${cat.name.toLowerCase()}">
                                ${cat.name}</a></li>
                    `).join('')}
                </ul>
            </div>
        <div class="categories-main">

         <div class="filters"> 
            <select name="size" class="filter filter-size" id="filter-size">
                <option class="filter-size__val" value="">Размер</option>
                <option class="filter-size__val" value="s">S</option>
                <option class="filter-size__val" value="m">M</option>
                <option class="filter-size__val" value="l">L</option>
                
            </select>
            
            <select name="color" class="filter filter-color"  id="filter-color">
                <option class="filter-size__val" value="">Цвет</option>
                <option class="filter-size__val" value="white">White</option>
                <option class="filter-size__val" value="black">Black</option>
                <option class="filter-size__val" value="blue">Blue</option> 
            </select>


            <div class="filter filter-sortby">
                <button id="filter-sortby" class="filter-btn filter-btn-sortby">Сортировать по</button>
                <div class="dropdown-answers">
                    <a href="#about">Цене</a>
                    <a href="#base">Рейтингу</a>
                </div>  
            </div>
            <button onclick="myFunction()" class="btn">Сбросить фильтры</button>
        </div>

        <ul class="product-list">
        ${filteredItems.map((prod) => `
             <li class="product-card">
                <div class="card__image">
                    <a href="/#/product/${prod.id}">
                        <img src="${prod.url}" alt="${prod.name}">
                    </a>
                    <button class="btn btn-category">добавить в карзину</button>
                </div>
                <div class="product-name">
                    <a href="/#/product/1">
                        ${prod.name}
                    </a>
                </div>
                <div class="product-brand">
                    <a href="/#/product/1">
                        ${prod.brand}
                    </a>
                </div>
                <div class="product-price">
                    ${prod.price} $
                </div>
            </li>
        `
        ).join('')}
        </div></div>`;
    }
};

export default Category;