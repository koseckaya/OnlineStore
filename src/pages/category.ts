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
        priceMin: 0,
        priceMax: 259,
        ratingMin: 0,
        ratingMax: 5,
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
         if (urlParams.has('priceMin')) {
            this.filters.priceMin = urlParams.get('priceMin');
        }
         if (urlParams.has('priceMax')) {
            this.filters.priceMax = urlParams.get('priceMax');
        }
         if (urlParams.has('ratingMin')) {
            this.filters.ratingMin = urlParams.get('ratingMin');
        }
         if (urlParams.has('ratingMax')) {
            this.filters.ratingMax = urlParams.get('ratingMax');
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
        const { categoryId, color, size, sortBy, priceMin, priceMax, ratingMin, ratingMax } = this.filters;
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
        if (priceMin) {
            filteredItems = filteredItems.filter(item => item.price >= priceMin)
        }
        if (priceMax) {
            filteredItems = filteredItems.filter(item => item.price <= priceMax)
        }
        if (ratingMin) {
            filteredItems = filteredItems.filter(item => item.rating >= ratingMin)
        }
        if (ratingMax) {
            filteredItems = filteredItems.filter(item => item.rating <= ratingMax)
        }
        console.log('filteredItems', filteredItems);
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
        this.filters.priceMax = 500;
        this.filters.priceMin = 0;
        this.filters.ratingMax = 5;
        this.filters.ratingMin= 0;
        this.updateUrlParams()
    }
    initRangePrice = () => {
        const that = this
        const lowerSlider = document.querySelector('#price-lower');
        const upperSlider = document.querySelector('#price-upper');
        
        document.querySelector('#price-two').value= that.filters.priceMax;
        document.querySelector('#price-one').value = that.filters.priceMin ; 
        let lowerVal = parseInt(lowerSlider.value);
        let upperVal = parseInt(upperSlider.value);

        upperSlider.oninput = function () {
            lowerVal = parseInt(lowerSlider.value);
            upperVal = parseInt(upperSlider.value);

            if (upperVal < lowerVal + 4) {
                lowerSlider.value = upperVal - 4;
                if (lowerVal == lowerSlider.min) {
                upperSlider.value = 4;
                }
            }
            document.querySelector('#price-two').value = this.value
            that.filters.priceMax = this.value
        };
        lowerSlider.oninput = function () {
            lowerVal = parseInt(lowerSlider.value);
            upperVal = parseInt(upperSlider.value);
            if (lowerVal > upperVal - 4) {
                upperSlider.value = lowerVal + 4;
                if (upperVal == upperSlider.max) {
                    lowerSlider.value = parseInt(upperSlider.max) - 4;
                }
            }
            document.querySelector('#price-one').value = this.value
            that.filters.priceMin = this.value
        }; 
    }
      initRangeRating = () => {
        const that = this
        const lowerSlider = document.querySelector('#rating-lower');
        const upperSlider = document.querySelector('#rating-upper');
        
        document.querySelector('#rating-two').value= that.filters.ratingMax;
        document.querySelector('#rating-one').value = that.filters.ratingMin ; 
        let lowerVal = parseInt(lowerSlider.value);
        let upperVal = parseInt(upperSlider.value);

        upperSlider.oninput = function () {
            lowerVal = parseInt(lowerSlider.value);
            upperVal = parseInt(upperSlider.value);

            if (upperVal < lowerVal + 1) {
                lowerSlider.value = upperVal - 1;
                if (lowerVal == lowerSlider.min) {
                upperSlider.value = 1;
                }
            }
            document.querySelector('#rating-two').value = this.value
            that.filters.ratingMax = this.value
        };
        lowerSlider.oninput = function () {
            lowerVal = parseInt(lowerSlider.value);
            upperVal = parseInt(upperSlider.value);
            if (lowerVal > upperVal - 1) {
                upperSlider.value = lowerVal + 1;
                if (upperVal == upperSlider.max) {
                    lowerSlider.value = parseInt(upperSlider.max) - 1;
                }
            }
            document.querySelector('#rating-one').value = this.value
            that.filters.ratingMin = this.value
        }; 
    }
    handleApply = () => {
        this.updateUrlParams()
        this.getFilterItems()
    }

    bind = () => {

        const lists = document.querySelectorAll(".filters select");
        for (let i = 0; i < lists.length; i++) {
            lists[i].addEventListener('change', this.handleChangeFilters)
        }

        const resetBtn = document.querySelector('.btn-reset')
        resetBtn?.addEventListener('click', this.resetFilters)

        const applyPriceBtn = document.querySelector('.btn-applyPrice')
        applyPriceBtn?.addEventListener('click', this.handleApply)
        const applyRatingBtn = document.querySelector('.btn-applyRating')
        applyRatingBtn?.addEventListener('click', this.handleApply)

        this.initRangePrice()
        this.initRangeRating()
    }

    render = () => {
   
        const filteredItems = this.getFilterItems()
        
        return `
        <div class="categories">
            <div class="bread-crumbs"></div>

            <div class="categories-side">
                <h2 class="side__title">Categories</h2>
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
                        <option class="filter-size__val" value="">Size</option>
                        ${sizes.map(s => `
                            <option class="filter-size__val" value="${s}" ${this.filters.size === s ? 'selected="selected"' : ''} 
                            >${s.toUpperCase()}</option>
                        `).join('')}  
                    </select>
                    
                    <select name="color" class="filter filter-color"  id="filter-color">
                        <option class="filter-size__val" value="">Color</option>
                        ${colors.map(c => `
                            <option class="filter-color__val" value="${c}"
                            ${this.filters.color === c ? ' selected="selected" ' : ''}
                            >${c}</option>
                        `).join('')} 
                    </select>

                    <fieldset class="filter filter-price">
                        <div class="price-title">Price</div>
                        <div class="price-field">
                            <input type="range" min="0" max="500" value="${this.filters.priceMin}" id="price-lower">
                            <input type="range" min="0" max="500" value="${this.filters.priceMax}" id="price-upper">
                        </div>
                        <div class ="price-wrap">
                            <div class="price-container">
                                <div class="price-wrap-1">
                                    <input id="price-one">
                                    <label for="price-one">$</label>
                                    
                                </div>
                                <div class="price-wrap-2">
                                    <input id="price-two">
                                    <label for="price-two">$</label>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-applyPrice">Apply</button>
                    </fieldset>

                    <fieldset class="filter filter-rating">
                        <div class="rating-title">Rating</div>
                        <div class="rating-field">
                            <input type="range" min="0" max="5" value="${this.filters.ratingMin}" id="rating-lower">
                            <input type="range" min="0" max="5" value="${this.filters.ratingMax}" id="rating-upper">
                        </div>
                        <div class ="rating-wrap">
                            <div class="rating-container">
                                <div class="rating-wrap-1">
                                    <input id="rating-one">
                                    <label for="rating-one"></label>
                                    
                                </div>
                                <div class="rating-wrap-2">
                                    <input id="rating-two">
                                    <label for="rating-two"></label>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-applyRating">Apply</button>
                    </fieldset>

            <button class="btn btn-reset">Clear filters</button>
        </div>
            </div>

        <div class="categories-main">
        <div class='sortBy'>
             <div>Found: ${filteredItems.length}</div>
             <div class="filters"> 
                <select name='sortBy' class="filter filter-sortBy" id="filter-sortBy">
                    <option class="filter-sortBy" value="">Sort by</option>
                     ${sortBy.map((s:SortByTypes)  => `
                            <option class="filter-sortBy" value="${s}"
                            ${this.filters.sortBy === s ? ' selected="selected" ' : ''}
                            >${stringsSortBy[s]}</option>
                    `).join('')} 
                </select>
            </div>
            
        </div>
        <ul class="product-list">
        ${filteredItems.length === 0 ? '<div class="no-products">Products not found</div>' : ''}
        ${filteredItems.map((prod) => `
             <li class="product-card">
                <div class="card__image">
                    <a href="/#/product/${prod.id}">
                        <img src="${prod.url}" alt="${prod.name}">
                    </a>
                    <button class="btn btn-category">Add to cart</button>
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