
export const visaCard = (num: string): boolean => {
    const cardRe = /^(?:4\d{3}\s\d{4}\s\d{4}\s\d{4})$/;
    return cardRe.test(num);
}
export const masterCard = (num: string): boolean => {
    const cardRe = /^(?:5\d{3}\s\d{4}\s\d{4}\s\d{4})$/;
    return cardRe.test(num);
}
export const amexCard = (num: string): boolean => {
    const cardRe = /^(?:3\d{3}\s\d{4}\s\d{4}\s\d{4})$/;
    return cardRe.test(num);
}
export const isValidCreditCard = (cardNumber: string): string | null => {
    var cardType = null;
    if (visaCard(cardNumber)) {
        cardType = 'visa';
    } else if (masterCard(cardNumber)) {
        cardType = 'master';
    } else if (amexCard(cardNumber)) {
        cardType = 'americanExpress';
    }
    return cardType;
}
export const isExpireValid = (cardExpire: string): boolean => {
    if (cardExpire === '' || cardExpire.length !== 5) {
        return false;
    }
    const year = +cardExpire.split('/')[1]
    if (year < 23) {
        return false;
    }
    return /(0[1-9]|1[012])\/(\d\d)/.test(cardExpire);
}
export const phoneNumberFormat = (phone: string): string => {
    let x = phone.replace(/\D/g, "")
        .match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})/);
    if (!x) return ''
    return `+${x[1]}(${x[2]}) - ${x[3]}` + (!x[4] ? "" : ` - ${x[4]}`)
}
export const dataFormat = (data: string): string => {
    let x = data.replace(/\D/g, "").match(/(0[1-9]|1[012])(\d\d)/);
    if (!x) return ''
    return `${x[1]}\/${x[2]}`
}