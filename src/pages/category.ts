// @ts-nocheck
import { items, categories, sizes, colors, sortBy } from '../data.ts';
import { stringsSortBy } from '../helpers/strings';
import { setUrlParams } from '../helpers/url';
import { parseRequestURL, getUrlParams } from '../helpers/utils.ts';

const DEFAULT_FILTERS = {
    categoryId: 0,
};
const DEFAULT_PRICES = { min: 0, max: 500 };
const DEFAULT_RATINGS = { min: 0, max: 5 };


class Category {
    filters = { ...DEFAULT_FILTERS };
    prices = { ...DEFAULT_PRICES };
    ratings = { ...DEFAULT_RATINGS };
    filteredSize = new Set()
    filteredColor = new Set()
    filteredProductName = new Set()
    items = [];

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
        if (urlParams.has('productName')) {
            this.filters.productName = urlParams.get('productName');
        }

        this.filters.view = urlParams.has('view') ? 'grid' : '';
        if (urlParams.has('search')) {
            this.filters.search = urlParams.get('search');
        }

        this.initItems();
        this.initRangeFilters();
        this.sortItems();
    }

    initRangeFilters = () => {
        let min = 0, max = 0, minR = 0, maxR = 0;
        this.items.forEach(i => {
            if (min === 0) {
                min = i.price;
            } else if (min > i.price) {
                min = i.price;
            }

            if (max === 0) {
                max = i.price;
            } else if (max < i.price) {
                max = i.price;
            }

            if (minR === 0) {
                minR = i.rating;
            } else if (minR > i.rating) {
                minR = i.rating;
            }

            if (maxR === 0) {
                maxR = i.rating;
            } else if (maxR < i.rating) {
                maxR = i.rating;
            }
        });

        this.prices = { min, max };

        this.ratings = {
            min: minR,
            max: maxR,
        }

        this.initItemsForRangeFilters();
    };

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

    initItems = () => {
        const { categoryId, color, size, productName, search } = this.filters;

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

        if (productName) {
            filteredItems = filteredItems.filter(item => item.name.toLowerCase().includes(productName.toLowerCase()))
        }
        if (search) {
            const searchString = search.toLowerCase();
            const fields = ['brand', 'name', 'colorHTML', 'type', 'description']
            filteredItems = filteredItems.filter(item => {
                const searchFields = fields.reduce((acc, field) => {
                    acc += ' ' + item[field];
                    return acc;
                }, '');

                return searchFields.toLowerCase().includes(searchString);
            });
        }
        this.items = filteredItems;
        filteredItems.forEach(item => this.filteredProductName.add(item.name))
        filteredItems.forEach(item => this.filteredColor.add(item.color))
        filteredItems.forEach(item => item.sizes.forEach(i => this.filteredSize.add(i)))
    }

    sortItems = () => {
        const { sortBy } = this.filters;

        if (sortBy) {
            if (sortBy === 'priceAsc') {
                this.items = this.items.sort((a, b) => a.price > b.price ? 1 : -1)
            }
            if (sortBy === 'priceDesc') {
                this.items = this.items.sort((a, b) => a.price < b.price ? 1 : -1)
            }
            if (sortBy === 'rating') {
                this.items = this.items.sort((a, b) => a.rating < b.rating ? 1 : -1)
            }
        }
    };

    initItemsForRangeFilters = () => {
        const { priceMin, priceMax, ratingMin, ratingMax } = this.filters;
        let filteredItems = this.items;

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

        this.items = filteredItems;
    }
    updateUrlParams = () => {
        const { categoryId, ...rest } = this.filters
        setUrlParams(rest)
    }
    handleChangeFilters = (e) => {
        const { name, value } = e.target;
        this.filters[name] = value;
        this.updateUrlParams()
    }
    resetFilters = () => {
        this.filters = { ...DEFAULT_FILTERS };
        this.updateUrlParams()
    }
    copyFilters = () => {
        const url = document.location.href;
        navigator.clipboard.writeText(url);
        const copyBtn = document.querySelector('.btn-copy')
        copyBtn?.innerHTML = 'Copied'
        setTimeout(() => copyBtn?.innerHTML = 'Copy Filters', 2000)
    }
    initRangePrice = () => {
        const that = this
        const lowerSlider = document.querySelector('#price-lower');
        const upperSlider = document.querySelector('#price-upper');

        document.querySelector('#price-two').value = that.filters.priceMax || that.prices.max;
        document.querySelector('#price-one').value = that.filters.priceMin || that.prices.min;
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

        document.querySelector('#rating-two').value = that.filters.ratingMax || that.ratings.max;
        document.querySelector('#rating-one').value = that.filters.ratingMin || that.ratings.min;
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
    }

    handleProductView = (e) => {
        if (e.target.value === 'four') {
            document.querySelector('.product-list')?.classList.add('four')
            this.filters.view = 'grid'
        } else {
            document.querySelector('.product-list')?.classList.remove('four')
            delete this.filters.view;
        }
        this.updateUrlParams()
    }

    bind = () => {
        const lists = document.querySelectorAll(".filters select");
        for (let i = 0; i < lists.length; i++) {
            lists[i].addEventListener('change', this.handleChangeFilters)
        }

        const resetBtn = document.querySelector('.btn-reset')
        resetBtn?.addEventListener('click', this.resetFilters)

        const copyBtn = document.querySelector('.btn-copy')
        copyBtn?.addEventListener('click', this.copyFilters)

        const applyPriceBtn = document.querySelector('.btn-applyPrice')
        applyPriceBtn?.addEventListener('click', this.handleApply)
        const applyRatingBtn = document.querySelector('.btn-applyRating')
        applyRatingBtn?.addEventListener('click', this.handleApply)

        const productViewBtn = document.querySelector('#filter-products-view')
        productViewBtn?.addEventListener('change', this.handleProductView)

        const searchInput = document.querySelector('.search-input')
        searchInput.value = this.filters.search

        this.initRangePrice()
        this.initRangeRating()
        
        const btnsCategory = document.querySelectorAll('.btn-category');
        btnsCategory.forEach((el) => {
            let idOfButton = el.getAttribute('data-id');
            let smallestSize = items[+(idOfButton)]['sizes'][0];
            if (JSON.parse(localStorage.getItem('fullCart')).filter(el => +(el.id) === +(idOfButton) && el.size === smallestSize).length > 0) {
            let neededItem = JSON.parse(localStorage.getItem('fullCart')).filter(el => +(el.id) === +(idOfButton) && el.size === smallestSize)[0];
                if (neededItem) {
                    el.style.background = `green`;
                    el.innerHTML = `ALREADY IN CART`;
                    el.style.pointerEvents = `none`;
                } 
            } else {
                el.addEventListener('click', (e) => {
                    let arr = JSON.parse(localStorage.getItem('fullCart'));
                    arr.push({id: +(idOfButton), amount: 1, size: smallestSize});
                    localStorage.setItem('fullCart', JSON.stringify(arr))
                    e.target.style.background = `green`;
                    e.target.innerHTML = `ALREADY IN CART`;
                    e.target.style.pointerEvents = `none`;
                    document.querySelector('.cart-amount')?.innerHTML = `${JSON.parse(localStorage.getItem('fullCart')).length}`;
                    const totalMoneyHeader = document.querySelector('.total-money') as HTMLElement;
                    arr = JSON.parse(localStorage.getItem('fullCart'));
                    let total = arr.reduce((acc, curr) => acc + items[curr.id].price * curr.amount, 0);
                    totalMoneyHeader.innerHTML = `$${total}`
                })
            }
        })
    }

    isGridView = () => {
        return this.filters.view === 'grid';
    }

    render = () => {
        return `
        <div class="categories container">
            <div class="bread-crumbs"></div>

            <div class="categories-side">
                <div class="filters"> 
                    
                    <select name="productName" class="filter filter-productName" id="filter-productName">
                        <option class="filter-productName__val" value="">Product Name</option>
                        ${[...this.filteredProductName].map(name => `
                            <option class="filter-productName__val" value="${name}" ${this.filters.productName === name ? 'selected="selected"' : ''} 
                            >${name}</option>
                        `).join('')}  
                    </select>

                    <select name="size" class="filter filter-size" id="filter-size">
                        <option class="filter-size__val" value="">Size</option>
                        ${[...this.filteredSize].map(s => `
                            <option class="filter-size__val" value="${s}" ${this.filters.size === s ? 'selected="selected"' : ''} 
                            >${s.toUpperCase()}</option>
                        `).join('')}  
                    </select>
                    
                    <select name="color" class="filter filter-color"  id="filter-color">
                        <option class="filter-color__val" value="">Color</option>
                        ${[...this.filteredColor].map(c => `
                            <option class="filter-color__val" value="${c}"
                            ${this.filters.color === c ? ' selected="selected" ' : ''}
                            >${c}</option>
                        `).join('')} 
                    </select>

                    <fieldset class="filter filter-price">
                        <div class="price-title">Price</div>
                        <div class="price-field">
                            <input type="range" min="${this.prices.min}" max="${this.prices.max}" value="${this.filters.priceMin || this.prices.min}" id="price-lower">
                            <input type="range" min="${this.prices.min}" max="${this.prices.max}" value="${this.filters.priceMax || this.prices.max}" id="price-upper">
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
                            <input type="range" step="0.01" min="${this.ratings.min}" max="${this.ratings.max}" value="${this.filters.ratingMin || this.ratings.min}" id="rating-lower">
                            <input type="range" step="0.01" min="${this.ratings.min}" max="${this.ratings.max}" value="${this.filters.ratingMax || this.ratings.max}" id="rating-upper">
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
            <button class="btn btn-copy">Copy filters </button>
        </div>
            </div>

        <div class="categories-main">
        <div class='sortBy'>
             <div class="filters"> 
                <select name='sortBy' class="filter filter-sortBy" id="filter-sortBy">
                    <option class="filter-sortBy" value="">Sort by</option>
                     ${sortBy.map((s: SortByTypes) => `
                            <option class="filter-sortBy" value="${s}"
                            ${this.filters.sortBy === s ? ' selected="selected" ' : ''}
                            >${stringsSortBy[s]}</option>
                    `).join('')} 
                </select>
            </div>
            
        </div>
        <div class='filter-categories'>
            <ul class="categ-list">
                <li class="categ-item"><a href="/#/category">All</a></li>
                ${categories.map(cat => `
                    <li class="categ-item">
                        <a href="/#/category/${cat.name.toLowerCase()}">
                            ${cat.name}</a></li>
                `).join('')}
            </ul>
            <div>Found: ${this.items.length}</div>
            <select name='products-view' class="filter filter-products-view" id="filter-products-view">
                <option class="filter-products-view" value="three">:::</option>
                <option class="filter-products-view" value="four" ${this.filters.view ? 'selected="selected"' : ''}}>
                    ::::</option>
            </select>
            
        </div>

        <ul class="product-list ${this.isGridView() ? 'four' : ''}">
        ${this.items.length === 0 ? '<div class="no-products">Sorry, we have no products in this category right now</div>' : ''}
        ${this.items.map((prod) => `
             <li class="product-card">
                <div class="card__image">
                    <a href="/#/product/${prod.id}">
                        <img src="${prod.url}" alt="${prod.name}">
                    </a>
                    <button class="btn btn-category" data-id="${prod.id}">Add to cart</button>
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