// @ts-nocheck
import data from '../data.json';

const Category= {
    render: () => {
        console.log(data )

        return `
        <p>Go to <a href="./">Main</a></p>
         <div class="filters"> 
            <div class="filter filter-size">
                <button onclick="myFunction()" class="filter-btn">Размер</button>
                <div id="filter-size" class="filter-sizes">
                    <a href="#small">S</a>
                    <a href="#medium">M</a>
                    <a href="#large">L</a>
                </div>
            </div>
        </div>

        <ul class="product-list">
        ${data.map((prod) => `
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