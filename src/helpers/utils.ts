
import { parseRequestURLType, getUrlWithParamsType, setUrlParamsType} from '../types'

export const parseRequestURL: parseRequestURLType = () => {
    const url:string = window.location.hash.toLocaleLowerCase();
    const request:string[] = url.split('/');
    return {
        resource: request[1],
        id: request[2],
        action: request[3],
    }
}

export const getUrlParams:() => URLSearchParams = () => {
    return new URLSearchParams(window.location.search);
}

export const getUrlWithParams: getUrlWithParamsType = (params) => {
    return Object.keys(params).reduce((acc, param) => {
        if (params[param]) {
            acc.set(param, params[param]);
        }
        return acc
    }, new URLSearchParams())
}

export const setUrlParams:setUrlParamsType = (params) => {
    const urlParams = getUrlWithParams(params);
    console.log(urlParams.toString());
    window.location.search = urlParams.toString();
}

