import { SortByTypes, StringsSortByType } from "../types";

export const stringsSortBy: StringsSortByType = {
    [SortByTypes.priceAsc]: 'Cheapest first',
    [SortByTypes.priceDesc]: 'Expensive first',
    [SortByTypes.rating]: 'Highest rating',
    [SortByTypes.ratingDesc]: 'Lowest rating',
}