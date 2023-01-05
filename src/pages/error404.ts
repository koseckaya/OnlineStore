import { categories } from '../data';
import { ModuleInterface } from './types'

class Error404 implements ModuleInterface {
    bind =  () => {}
    render = () => {

        return `
        <div class="error-container">
            <div class='error-title'>404</div>
            <div class='error-message'>Page you are trying to find is not available or has been removed.</div>
            <div class="categories">
                ${categories.map((cat) => `
                    <div class="category">
                        <a class="category__item" href="/#/category/${cat.id}">
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
        
        `
    }
}

export default Error404