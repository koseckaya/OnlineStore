// @ts-nocheck
import { items, categories } from '../data.ts';
import { parseRequestURL } from '../helpers/utils.ts';

const Category = {
    getCategoryId: () => {
        const request = parseRequestURL()
        let categoryId = 0;
        categories.forEach(cat => {
            if (cat.name.toLowerCase() === request.id) {
                categoryId = cat.id;
            }
        })
       return categoryId
    },
    getFilterItems: (categoryId) => {
        if (categoryId === 0) return items;
        return items.filter(item => item.categoryId === categoryId);
    },
    sortByPrice: () => {
        return items.sort((a, b) => a.price > b.price ? 1 : -1);
    },
    toggleShow: () => {
        document.querySelectorAll(".dropdown-answers").classList.toggle("show")
    },

    render: () => {

        let categoryId = Category.getCategoryId()
        const filteredItems = Category.getFilterItems(categoryId)

        return `
        <div class="categories">
            <div class="bread-crumbs">

            </div>
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
            <div class="filter filter-size">
                <button onclick="toggleShow()" class="filter-btn">Размер</button>
                <div class="dropdown-answers show">
                    <a href="#about">S</a>
                    <a href="#base">M</a>
                    <a href="#blog">L</a>
                </div>  
            </div>
            <button onclick="myFunction()" class="filter-btn">Цвет</button>
            <button onclick="myFunction()" class="filter-btn">Сортировать по</button>
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
    },
};

export default Category