// @ts-nocheck

import { categories } from '../data';
import { ModuleInterface } from './types'
import video from '../img/video.mp4';
import { parseRequestURL } from '../helpers/utils';
class Main implements ModuleInterface {

    bind = () => { }
    render = () => {
        return (`
        <div class="container-main">
            <video autoplay muted preload loop="true" playsinline="" webkit-playsinline="true" data-overlay-video="true">
                 <source src="${video}" type="video/mp4">
                Your browser doesn't support HTML5 video tag.
            </video>
            
           
             <div class="categories">
                ${categories.map((cat) => `
                    <div class="category">
                        <a class="category__item" href="#/category/${cat.name.toLowerCase()}">
                            <img src="${cat.url}">
                        </a>
                         <div class="product-name">
                            <a href="/#/category/${cat.id}">
                                ${cat.name}
                            </a>
                        </div>
                    </div>
                   `
        ).join('')}

            </div>

            <div class="jackets">
                <div class="jackets__annok">
                    <div class="jackets__title">Dope Annok W</div>
                    <div class="jackets__desc">SNOWBOARD JACKET</div>
                    <a class="btn btn-jackets" href="#/category/jacket">Snow Jackets</a>
                </div>
                <div class="jackets__img"></div>
            </div>

            <div class="bottom-desc">
                <div class="bottom__title">Dope Snow - Snow, Ski & Outdoor Wear For Everyday Adventurers</div>
                <div class="bottom__text">Find the perfect snow, ski, and outdoor wear at Dope Snow. We have a huge range of ski jackets, snowboard jackets, and hiking jackets to choose from, in a range of colours and sizes. Our snowboard pants and ski pants are high-performance and stylish, and all orders receive free shipping and returns, all over the world. If you need to layer up, we also offer a wide selection of technical base layers and recycled fleeces to keep you warm and comfortable while you’re out on the mountain.</div>
            </div>
        </div>
        `)
    }
};

export default Main;