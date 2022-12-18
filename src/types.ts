export interface Item {
  "id": number;
  "categoryId": number;
  "brand": string;
  "name": string;
  "color": string;
  "type": string;
  "gender": string;
  "price": number;
  "description": string;
  "url": string[];
}

export interface Category {
  "id": number;
  "name": string;
  "url": string;
}