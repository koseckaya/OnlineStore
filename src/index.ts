// @ts-nocheck

import './index.html';
import './index.scss';
import { multiple } from './modules/calc.ts';
import Main from './pages/main.ts';
import Product from './pages/product.ts';
import Error404 from './pages/error404.ts';
import Category from './pages/category.ts';
import Cart from './pages/cart.ts';
import { parseRequestURL } from './helpers/utils.ts';

const routes = {
    '/': Main,
    '/product/:id': Product,
    '/category/:id': Category,
    '/cart': Cart,
}

const router = () => {
    const request = parseRequestURL()
    const parseUrl =
        (request.resource ? `/${request.resource}` : '/') +
        (request.id ? `/:id` : '') +
        (request.verb ? `/${request.verb}` : '');
    const page = routes[parseUrl] ? routes[parseUrl] : Error404;

    const main = document.querySelector('.main')
    main?.innerHTML = page.render();
}

window.addEventListener('load', router)
window.addEventListener('hashchange', router)

console.log(multiple(3, 4));