// @ts-nocheck
import './index.html';
import './index.scss';
import Main from './pages/main';
import Product from './pages/product';
import Error404 from './pages/error404';
import Category from './pages/category';
import Cart from './pages/cart';
import { parseRequestURL } from './helpers/utils';
import Header from './modules/header';
import { Routes, storageItem } from './types'
import { ModuleInterface } from './pages/types';
import About from './pages/aboutUs';
import { items } from './data';




const router = () => {
    const routes: Routes = {
        '/': Main,
        '/product/:id': Product,
        '/category/:id': Category,
        '/category': Category,
        '/cart': Cart,
        '/about': About,
    }

    const request = parseRequestURL()

    const parseUrl =
        (request.resource ? `/${request.resource}` : '/') +
        (request.id ? `/:id` : '') +
        (request.action ? `/${request.action}` : '');
    const page: ModuleInterface = routes[parseUrl] ? new routes[parseUrl]() : new Error404();

    const main = document.getElementById('root') as HTMLInputElement | null
    if (main !== null) {
        main.innerHTML = page.render();
        page?.bind()
    }

    const HeaderModule = new Header();
    HeaderModule.init();

    if (!localStorage.getItem('fullCart')) {
        localStorage.setItem('fullCart', JSON.stringify([]))
    }
    const amount = document.querySelector('.cart-amount') as HTMLElement;
    if (amount && localStorage.getItem('fullCart')) {
        amount.textContent = `${JSON.parse(localStorage.getItem('fullCart') || '')?.length}`;
    }
    if (localStorage.getItem('fullCart') && JSON.parse(localStorage.getItem('fullCart') || '').length > 0) {
        const totalMoneyHeader = document.querySelector('.total-money') as HTMLElement;
        let arr: storageItem[] = JSON.parse(localStorage.getItem('fullCart') || '');
        let total = arr.reduce((acc: number, curr: storageItem) => acc + items[+curr.id].price * +curr.amount, 0);
        totalMoneyHeader.innerHTML = `$${total}`
    } else {
        const totalMoneyHeader = document.querySelector('.total-money') as HTMLElement;
        totalMoneyHeader.innerHTML = `$0`
    }
}

window.addEventListener('load', router)
window.addEventListener('hashchange', router)

