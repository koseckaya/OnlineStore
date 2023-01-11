
import { getUrlWithParams } from '../helpers/utils';
import { HeaderInterface } from '../pages/types';
import burgerLogic from '../helpers/handleBurger';
class Header implements HeaderInterface {
    search = '';
    isActive = false;

    initSearch = (): void => {
        const searchInput = document.querySelector('.search-input')
        if (this.isActive) {
            searchInput?.classList.add('visible');
        } else {
            searchInput?.classList.remove('visible');
        }
    }

    handleSearch = (e: Event): void => {
        e.stopPropagation();
        const searchInput = document.querySelector('.search-input')
        if (this.isActive) {
            if (this.search.length > 1) {
                const url = window.location.origin + '/?' + getUrlWithParams({ search: this.search }) + '#/category'
                window.location.href = url;
                if (window.location.href === url) {
                    window.location.reload();
                }
            }
        } else {
            searchInput?.classList.add('visible');
            this.isActive = true;
        }
    }
    handleSearchInput: EventListener = (e: Event): void => {
        e.stopPropagation();
        if (e.target) this.search = (e.target as HTMLInputElement).value;
    }
    handleSearchInputKeyPress = (e: KeyboardEvent): void => {
        if (e.key === 'Enter') {
            this.handleSearch(e);
        }
    }
    // burgerLogic: EventListener = (e: Event): void => {

    //     console.log(e)
    //     const burgerIcon = document.getElementById('nav-icon4') as HTMLDivElement;
    //     const nav = document.querySelector('.nav');
    //     if (burgerIcon.classList.contains('open')) {
    //         burgerIcon.removeAttribute('class');
    //         nav?.classList.remove('openMenu');
    //     } else {
    //         burgerIcon.classList.add('open');
    //         nav?.classList.add('openMenu');
    //     }
    // }
    bind = (): void => {
        const search = document.querySelector('.settings__search .settings__btn')
        if (search) search.addEventListener('click', this.handleSearch)
        const searchInput = document.querySelector<HTMLInputElement>('.search-input')
        if (searchInput) {
            searchInput?.addEventListener('input', this.handleSearchInput)
            searchInput?.addEventListener('keypress', this.handleSearchInputKeyPress)
        }

        document.getElementsByTagName('body')[0].addEventListener('click', (e: Event) => {
            if (e.target && !(e.target as HTMLElement).classList.contains('search-input')) {
                if (this.isActive) {
                    this.isActive = false;
                    this.initSearch();
                }
            }
        });
        
        const burgerIcon = document.getElementById('nav-icon4');
        burgerIcon?.addEventListener('click', burgerLogic)
        if (burgerIcon) {
        const nav = document.querySelector('.nav');
        const headerLinks = document.querySelectorAll('.header-link');
        headerLinks.forEach(el => el.addEventListener('click', (e) => {
            if (window.innerWidth <= 922) {
                burgerIcon.classList.remove('open');
                nav?.classList.remove('openMenu');
                burgerIcon?.removeEventListener('click', burgerLogic)
                setTimeout(() => {
                    burgerIcon?.addEventListener('click', burgerLogic)
                }, 50)
            }
        }))
        }
    }

    init = () => {
        this.bind();
    }
}

export default Header;