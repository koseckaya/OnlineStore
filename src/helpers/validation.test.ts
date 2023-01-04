import { visaCard, masterCard, amexCard, isValidCreditCard } from './validation'

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
    })
    describe('testing isValidCreditCard from helpers', () => {


     })

})