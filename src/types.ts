
import Main from "./pages/main";
import Product from './pages/product';
import Cart from './pages/cart';
import About from './pages/aboutUs';
import { default as CategoryClass } from './pages/category';

export interface Item {
  "id": number;
  "categoryId": number;
  "brand": string;
  "name": string;
  "colorHTML": string,
  "availableColors": string[],
  "color": string,
  "type": string;
  "gender": string;
  "price": number;
  "rating": number;
  "sizes": string[];
  "description": string;
  "url": string[];
}

export type ItemFieldsType = keyof Item;

export interface Category {
  "id": number;
  "name": string;
  "url": string;
}

export enum SortByTypes {
  priceAsc = 'priceAsc',
  priceDesc = 'priceDesc',
  rating = 'rating',
  ratingDesc = 'ratingDesc'
}

export type StringsSortByType = {
  [key in SortByTypes]: string;
};

export interface Routes {
  [key: string]: typeof Main | typeof Product | typeof CategoryClass | typeof Cart | typeof About;
}

type parseRequestURLResultType = {
  resource: string;
  id: string;
  action: string;
}
export type parseRequestURLType = () => parseRequestURLResultType

type UrlParams = {
  [key in string]: string;
};
export type getUrlWithParamsType = (params: UrlParams) => URLSearchParams
export type setUrlParamsType = (params: UrlParams) => void

export interface storageItem {
  [key: string]: string | number
}