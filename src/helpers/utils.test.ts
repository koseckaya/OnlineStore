import { getUrlParams, getUrlWithParams, parseRequestURL } from "./utils";

const state = require('./utils.ts');
describe('testing utils', () => {
    let windowSpy: any;

    beforeEach(() => {
        windowSpy = jest.spyOn(window, "window", "get");
    });

    afterEach(() => {
        windowSpy.mockRestore();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('testing parseRequestURL', () => {
        it('should return object', () => {
            let requestURL = parseRequestURL()

            expect(requestURL).toBeInstanceOf(Object)
        });
        it('should return structure: resource, id, action', () => {
            let requestURL = parseRequestURL()

            expect(Object.keys(requestURL)).toEqual(['resource', 'id', 'action'])
        });
        
        it('should return object with structure: resource, id, action, when href is not empty', () => {
            const newUrl = 'http://yanki.com/#/category/pants';

            windowSpy.mockImplementation(() => ({
                location: {
                    href: newUrl,
                    hash: '#/category/pants/buy'
                }
            }));

            const result = parseRequestURL();

            expect(window.location.href).toEqual(newUrl);
            expect(result.resource).toBe('category');
            expect(result).toEqual({ resource: 'category', id: 'pants', action: 'buy' });
        });
        it('should return object with structure: null, when href is empty', () => {
            windowSpy.mockImplementation(() => ({
                location: {
                    href: '',
                    hash: ''
                }
            }));

            const result = parseRequestURL();
            expect(result).toEqual({resource: undefined, id: undefined, action: undefined})
        });
    })

    describe('testing getUrlParams', () => {
        beforeEach(() => {
            const requestURL = state.getUrlParams()
        })

        it('should return URLSearchParams Object', () => {
            expect(getUrlParams()).toBeInstanceOf(URLSearchParams)
        });

        it('should return correct URLSearchParams string ', () => {
            windowSpy.mockImplementation(() => ({
                location: {
                    href: '',
                    hash: '',
                    search: '?search=string'
                }
            }));

            const result = getUrlParams();
            expect(result.toString()).toEqual('search=string')
        });
    })
    describe('testing getUrlWithParams', () => {
        it('should return correct URLSearchParams width empty params', () => {

            const result = getUrlWithParams({});
        
            expect(result.toString()).toEqual('');
        });
        it('should return correct URLSearchParams width not empty params', () => {
            const result = getUrlWithParams({ search: 'pants', price: '1000' });
        
            expect(result.toString()).toEqual('search=pants&price=1000');
        });
    });
});

