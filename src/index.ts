 // @ts-nocheck

import './index.html';
import './index.scss';
import Main from './pages/main.ts';
import Product from './pages/product.ts';
import Error404 from './pages/error404.ts';
import Category from './pages/category.ts';
import Cart from './pages/cart.ts';
import { parseRequestURL } from './helpers/utils.ts';



const router = () => {
    const routes = {
    '/': Main,
    '/product/:id': Product,
    '/category/:id': new Category(),
    '/category': new Category(),
    '/cart': Cart,
}

    const request = parseRequestURL()
    const parseUrl =
        (request.resource ? `/${request.resource}` : '/') +
        (request.id ? `/:id` : '') +
        (request.verb ? `/${request.verb}` : '');
    const page = routes[parseUrl] ? routes[parseUrl] : Error404;

    const main = document.getElementById('root')
    main?.innerHTML = page.render();
    page?.bind()
}


window.addEventListener('load', router)
window.addEventListener('hashchange', router)

