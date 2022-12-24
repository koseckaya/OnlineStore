// @ts-nocheck
import { categories } from '../data.ts';

class Main {
    bind= () => {}
    render = () => {
        return (`
        <div class="main-container">
            
            <p>Go to <a href="#/product/1">Product Card</a></p>
            <p>Go to <a href="#/cart">Cart</a></p>
            <p>Go to <a href="#/error404">404</a></p>
             <div class="categories">
                ${categories.map((cat) => `
                    <div class="category">
                        <a class="category__item" href="#/category/${cat.name.toLowerCase()}">
                            <img src="${cat.url}">
                        </a>
                         <div class="product-name">
                            <a href="/#/category/${cat.id}">
                                ${cat.name}
                            </a>
                        </div>
                    </div>
                   `
                ).join('')}
            </div>
        </div>
        `)
    }
};

export default Main;