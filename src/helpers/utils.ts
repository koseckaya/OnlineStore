
import { parseRequestURLType, getUrlWithParamsType, setUrlParamsType} from '../types'

export const parseRequestURL: parseRequestURLType = () => {
    const url:string = document.location.hash.toLocaleLowerCase();
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
    console.log('params',params);
    return Object.keys(params).reduce((acc, param) => {
        if (params[param]) {
            acc.set(param, params[param]);
        }
        return acc
    }, new URLSearchParams())
}

export const setUrlParams:setUrlParamsType = (params) => {
    const urlParams = getUrlWithParams(params);
    window.location.search = urlParams.toString();
}

