import api from '../../../api'
import MockAdapter from 'axios-mock-adapter'

import createStore from '../../../'
import actions from '../networkActions'
import { actions as basicActions } from '../'

describe('channels api actions', () => {
    let store
    const mock = new MockAdapter(api)

    beforeEach(() => {
        mock.reset()
        store = createStore()
    })

    test('create error', () => {
        const data = { message: 'test error' }
        mock.onPost('/channel').reply(403, {
            data
        })
        store.dispatch(actions.create({ name: 'test name' }))
        expect(store.getState().loading.channels.new).toBe(true)
        setTimeout(() => {
            const state = store.getState()
            expect(state.errors.channels.new).toEqual(data)
            expect(state.loading.channels.new).toBe(false)
            done()
        }, 0)
    })
    test('create success', done => {
        const data = { id: '123', name: 'test name' }
        mock.onPost('/channel').reply(201, {
            channel: data
        })
        store.dispatch(actions.create({ name: data.name }))
        expect(store.getState().loading.channels.new).toBe(true)
        setTimeout(() => {
            const state = store.getState()
            expect(state.channels['123']).toEqual(data)
            expect(state.loading.channels.new).toBe(false)
            done()
        }, 0)
    })
    test('getAll error', done => {
        const data = { message: 'test error '}
        mock.onGet('/channel/all').reply(500, data)
        store.dispatch(actions.getAll())
        expect(store.getState().loading.channels.all).toBe(true)
        setTimeout(() => {
            const state = store.getState()
            expect(state.errors.channels.all).toEqual(data)
            expect(state.loading.channels.all).toBe(false)
            done()
        }, 0)
    })
    test('update success', done => {
        const channel = {
            id: '123', name: 'test name', other: 'data'
        }
        store.dispatch(basicActions.set('123', channel))
        const newChannel = {
            id: '123', name: 'new name'
        }
        mock.onPut('/channel').reply(202, newChannel)
        store.dispatch(actions.update('123', { name: 'new name' }))

        expect(store.getState().loading.channels['123']).toBe(true)
        setTimeout(() => {
            const state = store.getState()
            expect(state.channels['123']).toEqual({ ...channel, ...newChannel })
            expect(state.loading.channels['123']).toBe(false)
            done()
        }, 0)
    })
    test('update error', done => {
        const data = { message: 'test error '}
        const channel = {
            id: '123', name: 'test name', other: 'data'
        }
        store.dispatch(basicActions.set('123', channel))
        const newChannel = {
            id: '123', name: 'new name'
        }
        mock.onPut('/channel').reply(500, data)
        store.dispatch(actions.update('123', { name: 'new name' }))

        expect(store.getState().loading.channels['123']).toBe(true)
        setTimeout(() => {
            const state = store.getState()
            expect(state.channels['123']).toEqual(channel)
            expect(state.errors.channels['123']).toEqual(data)
            expect(state.loading.channels['123']).toBe(false)
            done()
        }, 0)
    })
    test('remove success', done => {
        const channel = {
            id: '123', name: 'test name', other: 'data'
        }
        store.dispatch(basicActions.set('123', channel))

        mock.onDelete('/channel').reply(202)
        store.dispatch(actions.remove('123'))

        expect(store.getState().loading.channels['123']).toBe(true)
        setTimeout(() => {
            const state = store.getState()
            expect(state.channels['123']).toBe(undefined)
            expect(state.loading.channels['123']).toBe(false)
            done()
        }, 0)
    })
    test('remove error', done => {
        const channel = {
            id: '123', name: 'test name', other: 'data'
        }
        store.dispatch(basicActions.set('123', channel))
        const data = { message: 'test error' }
        mock.onDelete('/channel').reply(500, data)
        store.dispatch(actions.remove('123'))

        expect(store.getState().loading.channels['123']).toBe(true)
        setTimeout(() => {
            const state = store.getState()
            expect(state.channels['123']).toEqual(channel)
            expect(state.errors.channels['123']).toEqual(data)
            expect(state.loading.channels['123']).toBe(false)
            done()
        }, 0)
    })
})