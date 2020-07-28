import * as actionTypes from '../actions/actionTypes'
const { default: reducer } = require("./auth")


describe('authjs reducer', () => {
    it('should return initial state', () => {
        expect(reducer(undefined, {})).toEqual({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        })

    })
    it('should store token upon login', () => {
        expect(reducer({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        }, {
            type: actionTypes.AUTH_SUCCESS,
            idToken: "tokenn",
            userId: 'userid'
        })).toEqual({
            token: "tokenn",
            userId: 'userid',
            error: null,
            loading: false,
            authRedirectPath: '/'
        })
    })
})