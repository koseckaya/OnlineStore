import './index.html';
import './index.scss';
import Main from './pages/main';
import Product from './pages/product';
import Error404 from './pages/error404';
import Category from './pages/category';
import Cart from './pages/cart';
import { parseRequestURL } from './helpers/utils';
import Header from './modules/header';
import { Routes } from './types'
import { ModuleInterface } from './pages/types';
import About from './pages/aboutUs';




const router = () => {
    const routes: Routes = {
    '/': new Main(),
    '/product/:id': new Product(),
    '/category/:id': new Category(),
    '/category': new Category(),
    '/cart': new Cart(),
    '/about' : new About(),
    }

    const request = parseRequestURL()
 
    const parseUrl =
        (request.resource ? `/${request.resource}` : '/') +
        (request.id ? `/:id` : '') +
        (request.action ? `/${request.action}` : '');
    const page: ModuleInterface = routes[parseUrl] ? routes[parseUrl] : new Error404();

    const main = document.getElementById('root') as HTMLInputElement | null
    if (main !== null) {
        main.innerHTML = page.render();
        page?.bind()
    }

    const HeaderModule = new Header();
    HeaderModule.init();

    const amount = document.querySelector('.cart-amount') as HTMLElement;
    if (amount && localStorage.getItem('fullCart')) {
        amount.textContent = `${JSON.parse(localStorage.getItem('fullCart')!)?.length}`;
    }
}

window.addEventListener('load', router)
window.addEventListener('hashchange', router)

