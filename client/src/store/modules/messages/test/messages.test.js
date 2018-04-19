import api from '../../../api'
import MockAdapter from 'axios-mock-adapter'
import { runAsync } from '../../../../testUtil'

import createStore from '../../../'
import { authActions } from '../../auth'

import actions from '../networkActions'
import { actions as basicActions } from '../base'

describe('messages api actions', () => {
    let store
    const mock = new MockAdapter(api)

    beforeEach(() => {
        mock.reset()
        store = createStore()
    })
    test('getAll success', done => {
        store.dispatch(authActions.set('lastLogoutAt', 1000))
        const data = {
            '123': { id: '123', channelId: '987', text: 'test text 1', createdAt: 800 },
            '234': { id: '234', channelId: '987', text: 'test text 2', createdAt: 1200 }
        }
        mock.onGet('/message/all').reply(200, {messages: data})
        store.dispatch(actions.getAll())
        expect(store.getState().loading.messages.all).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.notifications.channels['987']).toBe(1)
            expect(state.messages).toEqual(data)
            expect(state.loading.messages.all).toBe(false)
        })
    })
    test('getAll error', done => {
        const data = { message: 'test error '}
        mock.onGet('/message/all').reply(500, data)
        store.dispatch(actions.getAll())
        expect(store.getState().loading.messages.all).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.errors.messages.all).toEqual(data)
            expect(state.loading.messages.all).toBe(false)
        })
    })
    test('getInChannel success', done => {
        store.dispatch(authActions.set('lastLogoutAt', 1000))
        const initialMessage = { id: '0', text: 'initial message' }
        store.dispatch(basicActions.set('0', initialMessage))
        const data = {
            '123': { id: '123', channelId: '987', text: 'test text 1', createdAt: 800 },
            '234': { id: '234', channelId: '987', text: 'test text 2', createdAt: 1200 }
        }
        mock.onGet('/message/all', { channelId: '987', after: '0' })
        .reply(200, { messages: data, hasMore: true })
        
        store.dispatch(actions.getInChannel('987', '0'))
        expect(store.getState().loading.channels['987']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.hasMore.channels['987']).toBe(true)
            expect(state.notifications.channels['987']).toBe(1)
            expect(state.messages).toEqual({ '0': initialMessage, ...data })
            expect(state.loading.channels['987']).toBe(false)
        })
    })
    test('update success', done => {
        const message = {
            id: '123', text: 'test text', other: 'data'
        }
        store.dispatch(basicActions.set('123', message))
        const newMessage = {
            text: 'new text'
        }
        
        mock.onAny().reply( config => {
            try {
                expect(config.url).toBe('message')
                expect(config.method).toBe('put')
                expect(config.params).toEqual({ id: '123' })
                expect(config.data).toEqual(JSON.stringify(newMessage))
                return [202, newMessage]
            } catch (e){
                done.fail(e)
                return [500]
            }
        })
        store.dispatch(actions.update('123', { text: 'new text' }))

        expect(store.getState().loading.messages['123']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.messages['123']).toEqual({ ...message, ...newMessage })
            expect(state.loading.messages['123']).toBe(false)
        })
    })
    test('update error', done => {
        const data = { message: 'test error '}
        const message = {
            id: '123', text: 'test text', other: 'data'
        }
        store.dispatch(basicActions.set('123', message))
        mock.onPut('/message').reply(500, data)
        store.dispatch(actions.update('123', { text: 'new text' }))

        expect(store.getState().loading.messages['123']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.messages['123']).toEqual(message)
            expect(state.errors.messages['123']).toEqual(data)
            expect(state.loading.messages['123']).toBe(false)
        })
    })
    test('remove success', done => {
        const message = {
            id: '123', text: 'test text', other: 'data'
        }
        store.dispatch(basicActions.set('123', message))

        mock.onDelete('/message', { params: { id: '123' }}).reply(202)
        store.dispatch(actions.remove('123'))

        expect(store.getState().loading.messages['123']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.messages['123']).toBe(undefined)
            expect(state.loading.messages['123']).toBe(false)
        })
    })
    test('remove error', done => {
        const message = {
            id: '123', message: 'test message', other: 'data'
        }
        store.dispatch(basicActions.set('123', message))
        const data = { message: 'test error' }
        mock.onDelete('/message', { params: { id: '123' }}).reply(500, data)
        store.dispatch(actions.remove('123'))

        expect(store.getState().loading.messages['123']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.messages['123']).toEqual(message)
            expect(state.errors.messages['123']).toEqual(data)
            expect(state.loading.messages['123']).toBe(false)
        })
    })
})