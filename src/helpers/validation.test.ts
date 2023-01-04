import { visaCard, masterCard, amexCard, isValidCreditCard, isExpireValid } from './validation'

describe('testing validation', () => {
    describe('testing visaCard from helpers', () => {
        it('should return true for visa', () => {
            const number = '4444 4444 4444 4444'
            const result = visaCard(number)
            expect(result).toBeTruthy()
        });
        it('should return false for not visa', () => {
            const number = '5444 4444 4444 4444'
            const result = visaCard(number)

            expect(result).toBeFalsy()
        });
        it('should return false for not valid string', () => {
            const number = '4444g44444444444'
            const result = visaCard(number)
            expect(result).toBeFalsy()
        });
        it('should return false for  empty string', () => {
            const number = ''
            const result = visaCard(number)
            expect(result).toBeFalsy()
        });
    })

    describe('testing masterCard from helpers', () => {
        it('should return true for masterCard', () => {
            const number = '5444 4444 4444 4444'
            const result = masterCard(number)
            expect(result).toBeTruthy()
        });
        it('should return false for not masterCard', () => {
            const number = '4444 4444 4444 4444'
            const result = masterCard(number)

            expect(result).toBeFalsy()
        });
        it('should return false for not valid string', () => {
            const number = '5444g44444444444'
            const result = masterCard(number)
            expect(result).toBeFalsy()
        });
        it('should return false for  empty string', () => {
            const number = ''
            const result = masterCard(number)
            expect(result).toBeFalsy()
        });
    })
    describe('testing amexCard from helpers', () => {
        it('should return true for americanExpressCard', () => {
            const number = '3444 4444 4444 4444'
            const result = amexCard(number)
            expect(result).toBeTruthy()
        });
        it('should return false for not americanExpressCard', () => {
            const number = '4444 4444 4444 4444'
            const result = amexCard(number)

            expect(result).toBeFalsy()
        });
        it('should return false for not valid string', () => {
            const number = '3444g44444444444'
            const result = amexCard(number)
            expect(result).toBeFalsy()
        });
        it('should return false for  empty string', () => {
            const number = ''
            const result = amexCard(number)
            expect(result).toBeFalsy()
        });
    });
    describe('testing isValidCreditCard from helpers', () => {
        it('should return visa cardType for visa', () => {
            const number = '4444 4444 4444 4444'
            const result = isValidCreditCard(number)
            expect(result).toEqual('visa')
        });
        it('should return master cardType for master', () => {
            const number = '5444 4444 4444 4444'
            const result = isValidCreditCard(number)
            expect(result).toEqual('master')
        });
        it('should return americanExpress cardType for americanExpressCard', () => {
            const number = '3444 4444 4444 4444'
            const result = isValidCreditCard(number)
            expect(result).toEqual('americanExpress')
        });
         it('should return null for different cart type', () => {
            const number = '1111 1111 1111 1111'
            const result = isValidCreditCard(number)
            expect(result).toBeNull()
        });
    });
    describe('testing isExpireValid from helpers', () => { 
        it('should return false if expired empty', () => {
            const data = ''
            const result = isExpireValid(data)
            expect(result).toBeFalsy()           
        })
        it('should return false if expired has length not equal 5', () => {
            const data = '1223'
            const result = isExpireValid(data)
            expect(result).toBeFalsy()           
        })
        it('should return false if year less than 23', () => {
            const data = '12/22'
            const result = isExpireValid(data)
            expect(result).toBeFalsy()
        })
         it('should return false for not formatted data', () => {
            const data = '12*23'
            const result = isExpireValid(data)
            expect(result).toBeFalsy()
        })
        it('should return true for valid data', () => {
            const data = '12/23'
            const result = isExpireValid(data)
            expect(result).toBeTruthy()
        })
    })
})