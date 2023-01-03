 
    export const visaCard = (num: string): boolean => {
        const cardRe = /^(?:4\d{3}\s\d{4}\s\d{4}\s\d{4})$/;
        return cardRe.test(num);
    }
     export const masterCard = (num: string): boolean => {
        const cardRe = /^(?:5\d{3}\s\d{4}\s\d{4}\s\d{4})$/;
        return cardRe.test(num);
    }
     export const amexCard = (num: string): boolean=> {
        const cardRe = /^(?:3\d{3}\s\d{4}\s\d{4}\s\d{4})$/;
        return cardRe.test(num);
    }
     export const  isValidCreditCard = (cardNumber: string): string | null => {
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