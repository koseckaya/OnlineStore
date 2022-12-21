// @ts-nocheck
import { items, categories, sizes, colors , sortBy} from '../data.ts';
import { stringsSortBy } from '../helpers/strings';
import { parseRequestURL, getUrlParams, setUrlParams } from '../helpers/utils.ts';

class Category {
    filters = {
        size: '',
        color: '',
        categoryId: 0,
        sortBy: '',
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
         if (urlParams.has('sortBy')) {
            this.filters.sortBy = urlParams.get('sortBy');
        }
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
        const { categoryId, color, size, sortBy } = this.filters;
        let filteredItems = items;

        if (categoryId === 0) {
           filteredItems = items;
        } 
        if (categoryId !== 0) {
            filteredItems = items.filter(item => item.categoryId === categoryId);
        }
        if (color) {
          filteredItems = filteredItems.filter(item => item.color.toLowerCase() === color.toLowerCase());  
        }
        if (size) {
            filteredItems = filteredItems.filter(item => item.sizes.includes(size.toUpperCase()));   
        }
        if (sortBy) {
            if (sortBy === 'priceAsc') {
                filteredItems = filteredItems.sort((a, b) => a.price > b.price ? 1 : -1)
            }
            if (sortBy === 'priceDesc') {
                filteredItems = filteredItems.sort((a, b) => a.price < b.price ? 1 : -1)
            }
            if (sortBy === 'rating') {
                filteredItems = filteredItems.sort((a, b) => a.rating < b.rating ? 1 : -1)
            }
            
        }

        return filteredItems
    }
    
    handleChangeFilters = (e) => {
        const { name, value } = e.target;
        this.filters[name] = value;
        this.updateUrlParams()
    }
    updateUrlParams = () => {
        const { categoryId, ...rest} = this.filters
        setUrlParams(rest)
    }
   resetFilters = () => {
    this.filters.size = '';
    this.filters.color = '';
    this.filters.categoryId = 0;
    this.filters.sortBy = '';
    this.updateUrlParams()
    }

    bind = () => {

        const lists = document.querySelectorAll(".filters select");
        for (let i = 0; i < lists.length; i++) {
            lists[i].addEventListener('change', this.handleChangeFilters)
        }

        const resetBtn = document.querySelector('.btn-reset')
        resetBtn?.addEventListener('click', this.resetFilters)
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
                <div class="filters"> 
                    
                    <select name="size" class="filter filter-size" id="filter-size">
                        <option class="filter-size__val" value="">Размер</option>
                        ${sizes.map(s => `
                            <option class="filter-size__val" value="${s}" ${this.filters.size === s ? 'selected="selected"' : ''} 
                            >${s.toUpperCase()}</option>
                        `).join('')}  
                    </select>
                    
                    <select name="color" class="filter filter-color"  id="filter-color">
                        <option class="filter-size__val" value="">Цвет</option>
                        ${colors.map(c => `
                            <option class="filter-color__val" value="${c}"
                            ${this.filters.color === c ? ' selected="selected" ' : ''}
                            >${c}</option>
                        `).join('')} 
                    </select>

            <button class="btn btn-reset">Сбросить фильтры</button>
        </div>
            </div>

        <div class="categories-main">
        <div class='sortBy'>
             <div>Найдено: ${filteredItems.length}</div>
             <div class="filters"> 
                <select name='sortBy' class="filter filter-sortBy" id="filter-sortBy">
                    <option class="filter-sortBy" value="">Сортировать по</option>
                     ${sortBy.map((s:SortByTypes)  => `
                            <option class="filter-sortBy" value="${s}"
                            ${this.filters.sortBy === s ? ' selected="selected" ' : ''}
                            >${stringsSortBy[s]}</option>
                    `).join('')} 
                </select>
            </div>
            
        </div>
        <ul class="product-list">
        ${filteredItems.length === 0 ? '<div class="no-products">Товары не найдены</div>' : ''}
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