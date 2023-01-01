"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUrlParams = exports.getUrlWithParams = exports.getUrlParams = exports.parseRequestURL = void 0;
const parseRequestURL = () => {
    const url = document.location.hash.toLocaleLowerCase();
    const request = url.split('/');
    return {
        resource: request[1],
        id: request[2],
        action: request[3],
    };
};
exports.parseRequestURL = parseRequestURL;
const getUrlParams = () => {
    return new URLSearchParams(window.location.search);
};
exports.getUrlParams = getUrlParams;
const getUrlWithParams = (params) => {
    return Object.keys(params).reduce((acc, param) => {
        if (params[param]) {
            acc.set(param, params[param]);
        }
        return acc;
    }, new URLSearchParams());
};
exports.getUrlWithParams = getUrlWithParams;
const setUrlParams = (params) => {
    const urlParams = (0, exports.getUrlWithParams)(params);
    window.location.search = urlParams.toString();
};
exports.setUrlParams = setUrlParams;
