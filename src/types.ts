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

export interface Category {
  "id": number;
  "name": string;
  "url": string;
}

export enum SortByTypes {
  priceAsc = 'priceAsc',
  priceDesc = 'priceDesc',
  rating = 'rating'
}

export type StringsSortByType = {
    [key in SortByTypes]: string;
};