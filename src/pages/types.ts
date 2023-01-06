

export interface ModuleInterface {
    bind: () => void;
    render: () => string;
}

export interface CheckoutInterface {
    bind: () => void;
    render: () => void;
    init: () => void;
}
export interface HeaderInterface {
    bind: () => void;
}

export interface KeyboardEvent {
    keyCode: number;
}
export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
}
export interface defaultFiltersInterface {
    [key: string]: string 
}
export type defaultRangeType = {
    min: number;
    max: number;
}
export type filterParamType = string | null

export interface cartProductType {
    [key: string]: string | number;
    "id": number;
    "amount": number;
    "size": string;
}

export interface storageItem {
    [key: string]: string | number
}