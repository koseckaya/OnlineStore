"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringsSortBy = void 0;
const types_1 = require("../types");
exports.stringsSortBy = {
    [types_1.SortByTypes.priceAsc]: 'Cheapest first',
    [types_1.SortByTypes.priceDesc]: 'Expensive first',
    [types_1.SortByTypes.rating]: 'Hot products',
};
