// @ts-nocheck
import { items, categories } from '../data.ts';
import { parseRequestURL } from '../helpers/utils.ts';

const Category= {
    render: () => {
        const request = parseRequestURL()
        console.log(request)
        let categoryId = 0;
        categories.forEach(cat => {
            if (cat.name.toLowerCase() === request.id) {
                categoryId = cat.id;
            }
        })
        const filteredItems = items.filter(item => item.categoryId ===  categoryId);

        return `
         <div class="filters"> 
            <div class="filter filter-size">
                <button onclick="myFunction()" class="filter-btn">Размер</button>
                <button onclick="myFunction()" class="filter-btn">Цвет</button>
                <button onclick="myFunction()" class="filter-btn">Цена</button>
                <button onclick="myFunction()" class="filter-btn">Сортировать по</button>
                
            </div>
        </div>

        <ul class="product-list">
        ${filteredItems.map((prod) => `
             <li class="product-card">
                <div class="card__image">
                    <a href="/#/product/${prod._id}">
                        <img src="${prod.url}" alt="${prod.name}">
                    </a>
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
        `;
    },
};

export default Category