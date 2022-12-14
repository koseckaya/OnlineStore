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