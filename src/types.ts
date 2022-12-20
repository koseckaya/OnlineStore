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