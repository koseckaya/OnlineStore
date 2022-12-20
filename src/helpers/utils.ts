// @ts-nocheck

export const parseRequestURL = () => {
    const url = document.location.hash.toLocaleLowerCase();
    const request = url.split('/');
    return {
        resource: request[1],
        id: request[2],
        action: request[3],
    }
}

export const getUrlParams = () => {
    return new URLSearchParams(window.location.search);
}

export const setUrlParams = (params) => {
    const urlParams = Object.keys(params).reduce((acc, param) => {
        if (params[param]) {
            acc.set(param, params[param]);
        }

        return acc
    }, new URLSearchParams())

    window.location.search = urlParams;
}