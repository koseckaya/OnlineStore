// @ts-nocheck
import { categories } from '../data.ts';



const Error404 = {
    render: () => {
        return `
        <div class="error-container">
            <div class='error-title'>404</div>
            <div class='error-message'>Page you are trying to find is not available or has been removed.</div>

            <div class="categories">
                ${categories.map((cat) => `
                    <div class="category">
                        <a class="category__item" href="/#/category/${cat._id}">
                            <img src="${cat.url}">
                        </a>
                         <div class="product-name">
                            <a href="/#/category/${cat._id}">
                                ${cat.name}
                            </a>
                        </div>
                    </div>
                   `
                ).join('')}
            </div>

        </div>
        
        `
    }
}

export default Error404