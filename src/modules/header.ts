// @ts-nocheck

import { getUrlWithParams } from '../helpers/utils.ts';

class Header {
    search = '';
    isActive = false;

    initSearch = () => {
        const searchInput = document.querySelector('.search-input')
        if (this.isActive) {
            searchInput?.classList.add('visible');
        } else {
            searchInput?.classList.remove('visible');
        }
    }

    handleSearch = (e) => {
        e.stopPropagation();
        const searchInput = document.querySelector('.search-input')

        if (this.isActive) {
            if (this.search.length > 2) {
                const url = window.location.origin + '/?' + getUrlWithParams({ search: this.search }) + '#/category'
                window.location.href = url;
                window.location.reload();
            }
        } else {
            searchInput?.classList.add('visible');
            this.isActive = true;
        }
    }
    handleSearchInput = (e) => {
        e.stopPropagation();
        this.search = e.target.value;
    }
    
    bind = () => {
        const search = document.querySelector('.settings__search .settings__btn')
        console.log(search);
        search?.addEventListener('click', this.handleSearch)
        const searchInput = document.querySelector('.search-input')
        searchInput?.addEventListener('input', this.handleSearchInput)

        document.getElementsByTagName('body')[0].addEventListener('click', (e) => {
            if (!e.target.classList.contains('search-input')) {
                if (this.isActive) {
                    this.isActive = false;
                    this.initSearch();
                }
            }
        });
    }

    init = () => {
        this.bind();
    }
}

export default Header;