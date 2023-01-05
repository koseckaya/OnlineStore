
import { items, categories, sizes, colors, sortBy } from '../data';
import { stringsSortBy } from '../helpers/strings';
import { setUrlParams } from '../helpers/url';
import { parseRequestURL, getUrlParams } from '../helpers/utils';
import { Item, ItemFieldsType, SortByTypes } from '../types';
import { defaultFiltersInterface, defaultRangeType, ModuleInterface } from './types'

const DEFAULT_FILTERS: defaultFiltersInterface = {
    categoryId: '0',
};
const DEFAULT_PRICES: defaultRangeType = { min: 0, max: 500 };
const DEFAULT_RATINGS: defaultRangeType = { min: 0, max: 5 };


class Category implements ModuleInterface {
    filters = { ...DEFAULT_FILTERS };
    prices = { ...DEFAULT_PRICES };
    ratings = { ...DEFAULT_RATINGS };
    filteredSize = new Set<string>()
    filteredColor = new Set<string>()
    filteredProductName = new Set<string>()
    items: Item[] = [];

    constructor() {
        let categoryId: number = this.getCategoryId();
        this.filters.categoryId = `${categoryId}`;
        this.prepareFilters()

        const urlParams: URLSearchParams = getUrlParams();
        this.filters.view = urlParams.has('view') ? 'grid' : '';

        this.initItems();
        this.initRangeFilters();
        this.sortItems();
    }

    prepareFilters = (): void => {
        const filtersName: string[] = ['size', 'color', 'sortBy', 'priceMin', 'priceMax', 'ratingMin', 'ratingMax', 'productName', 'search']
        filtersName.forEach(name => this.getUrlParam(name))
    }

    getUrlParam = (name: string): void => {
        const urlParams: URLSearchParams = getUrlParams();
        if (urlParams.has(name)) {
            const param = urlParams.get(name)
            if (param) this.filters[name] = param
        }
    }

    initRangeFilters = (): void => {
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

    getCategoryId = (): number => {
        const request = parseRequestURL()
        let categoryId = 0;
        categories.forEach(cat => {
            if (cat.name.toLowerCase() === request.id) {
                categoryId = cat.id;
            }
        })
        return categoryId
    }

    initItems = (): void => {
        const { categoryId, color, size, productName, search } = this.filters;

        let filteredItems = items;
        const catId = +categoryId
        if (catId === 0) {
            filteredItems = items;
        }
        if (catId !== 0) {
            filteredItems = items.filter(item => item.categoryId === catId);
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
                    acc += ' ' + item[field as ItemFieldsType];
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

    sortItems = (): void => {
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

    initItemsForRangeFilters = (): void => {
        const { priceMin, priceMax, ratingMin, ratingMax } = this.filters;
        let filteredItems = this.items;

        if (priceMin) {
            filteredItems = filteredItems.filter(item => item.price >= +priceMin)
        }
        if (priceMax) {
            filteredItems = filteredItems.filter(item => item.price <= +priceMax)
        }
        if (ratingMin) {
            filteredItems = filteredItems.filter(item => item.rating >= +ratingMin)
        }
        if (ratingMax) {
            filteredItems = filteredItems.filter(item => item.rating <= +ratingMax)
        }
        this.items = filteredItems;
    }
    handleChangeFilters = (e: Event): void => {
        const { name, value } = e.target as HTMLInputElement;
        this.filters[name] = value;
       
        this.updateUrlParams()
    }
    updateUrlParams = (): void => {
        const { categoryId, ...rest } = this.filters
        setUrlParams(rest)
    }
   
    resetFilters = (): void => {
        this.filters = { ...DEFAULT_FILTERS };
        this.updateUrlParams()
    }
    copyFilters = (): void => {
        const url = document.location.href;
        navigator.clipboard.writeText(url);
        const copyBtn = document.querySelector('.btn-copy')
        if (copyBtn) {
            copyBtn.innerHTML = 'Copied'
            setTimeout(() => copyBtn.innerHTML = 'Copy Filters', 2000)
        }
    }
    initRangePrice = (): void => {
        const that: this = this
        const lowerSlider = <HTMLInputElement>document.querySelector('#price-lower');
        const upperSlider = <HTMLInputElement>document.querySelector('#price-upper');
        const priceTwo = <HTMLInputElement>document.querySelector('#price-two')
        const priceOne = <HTMLInputElement>document.querySelector('#price-one')

        if (priceTwo && priceOne && lowerSlider && upperSlider) {
            priceTwo.value = String(that.filters.priceMax || that.prices.max);
            priceOne.value = String(that.filters.priceMin || that.prices.min);
            let lowerVal = parseInt(lowerSlider.value);
            let upperVal = parseInt(upperSlider.value);

            upperSlider.oninput = function (this: GlobalEventHandlers, e: Event): void {
                lowerVal = parseInt(lowerSlider.value);
                upperVal = parseInt(upperSlider.value);

                if (upperVal < lowerVal + 4) {
                    lowerSlider.value = String(upperVal - 4);
                    if (lowerVal == +lowerSlider.min) {
                        upperSlider.value = '4';
                    }
                }
                priceTwo.value = (e.target as HTMLInputElement).value
                that.filters.priceMax = (e.target as HTMLInputElement).value
            }

            lowerSlider.oninput = function (e: Event) {
                lowerVal = parseInt(lowerSlider.value);
                upperVal = parseInt(upperSlider.value);
                if (lowerVal > upperVal - 4) {
                    upperSlider.value = String(lowerVal + 4);
                    if (upperVal == +upperSlider.max) {
                        lowerSlider.value = `${parseInt(upperSlider.max) - 4}`;
                    }
                }
                priceOne.value = (e.target as HTMLInputElement).value
                that.filters.priceMin = (e.target as HTMLInputElement).value
            };
        }
    }
    initRangeRating = (): void => {
        const that = this
        const lowerSlider = <HTMLInputElement>document.querySelector('#rating-lower');
        const upperSlider = <HTMLInputElement>document.querySelector('#rating-upper');
        const ratingTwo = <HTMLInputElement>document.querySelector('#rating-two')
        const ratingOne = <HTMLInputElement>document.querySelector('#rating-one')

        if (ratingTwo && ratingOne && lowerSlider && upperSlider) {
            ratingTwo.value = String(that.filters.ratingMax || that.ratings.max);
            ratingOne.value = String(that.filters.ratingMin || that.ratings.min);
            let lowerVal = parseInt(lowerSlider.value);
            let upperVal = parseInt(upperSlider.value);

            upperSlider.oninput = function (this: GlobalEventHandlers, e: Event): void {
                lowerVal = parseInt(lowerSlider.value);
                upperVal = parseInt(upperSlider.value);

                if (upperVal < lowerVal + 1) {
                    lowerSlider.value = String(upperVal - 1);
                    if (lowerVal == +lowerSlider.min) {
                        upperSlider.value = '1';
                    }
                }
                ratingTwo.value = (e.target as HTMLInputElement).value
                that.filters.ratingMax = (e.target as HTMLInputElement).value
            };
            lowerSlider.oninput = function (e: Event) {
                lowerVal = parseInt(lowerSlider.value);
                upperVal = parseInt(upperSlider.value);
                if (lowerVal > upperVal - 1) {
                    upperSlider.value = String(lowerVal + 1);
                    if (upperVal == +upperSlider.max) {
                        lowerSlider.value = `${parseInt(upperSlider.max) - 1}`;
                    }
                }
                ratingOne.value = (e.target as HTMLInputElement).value
                that.filters.ratingMin = (e.target as HTMLInputElement).value
            };
        }
    }
    handleApply = (): void => {
        this.updateUrlParams()
    }

    handleProductView = (e: Event): void => {
        if ((e.target as HTMLInputElement).value === 'four') {
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
            const element = lists[i] as HTMLSelectElement;
            element.addEventListener('change', this.handleChangeFilters)
        }

        const resetBtn = document.querySelector('.btn-reset')
        resetBtn?.addEventListener('click', this.resetFilters)

        const copyBtn = document.querySelector('.btn-copy')
        copyBtn?.addEventListener('click', this.copyFilters)

        const applyPriceBtn = document.querySelector('.btn-applyPrice')
        applyPriceBtn?.addEventListener('click', this.handleApply)
        const applyRatingBtn = document.querySelector('.btn-applyRating')
        applyRatingBtn?.addEventListener('click', this.handleApply)

        const productViewBtn = <HTMLInputElement>document.querySelector('#filter-products-view')
        productViewBtn.addEventListener('change', this.handleProductView)

        const searchInput = <HTMLInputElement>document.querySelector('.search-input')
        searchInput.value = this.filters.search

        this.initRangePrice()
        this.initRangeRating()
    }
    isGridView = (): boolean => {
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