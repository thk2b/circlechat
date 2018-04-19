import api from '../../../api'
import MockAdapter from 'axios-mock-adapter'
import { runAsync } from '../../../../testUtil'

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

    test('create error', done => {
        const data = { message: 'test error' }
        mock.onPost('/channel').reply(403, data)
        store.dispatch(actions.create({ name: 'test name' }))
        expect(store.getState().loading.channels.new).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.errors.channels.new).toEqual(data)
            expect(state.loading.channels.new).toBe(false)
        })
    })
    test('create success', done => {
        const data = { name: 'test name' }
        const responseData = {...data, id: '123'}
        mock.onPost('/channel', data).reply(201, {
            channel: responseData
        })
        store.dispatch(actions.create(data))
        expect(store.getState().loading.channels.new).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.channels['123']).toEqual(responseData)
            expect(state.loading.channels.new).toBe(false)
        })
    })
    test('getAll success', done => {
        const data = {
            '123': { id: '123', name: 'test name 1' },
            '234': { id: '234', name: 'test name 2' }
        }
        mock.onGet('/channel/all').reply(200, {channels: data})
        store.dispatch(actions.getAll())
        expect(store.getState().loading.channels.all).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.channels).toEqual(data)
            expect(state.loading.channels.all).toBe(false)
        })
    })
    test('getAll error', done => {
        const data = { message: 'test error '}
        mock.onGet('/channel/all').reply(500, data)
        store.dispatch(actions.getAll())
        expect(store.getState().loading.channels.all).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.errors.channels.all).toEqual(data)
            expect(state.loading.channels.all).toBe(false)
        })
    })
    test('update success', done => {
        const channel = {
            id: '123', name: 'test name', other: 'data'
        }
        store.dispatch(basicActions.set('123', channel))
        const newChannel = {
            name: 'new name'
        }

        mock.onAny().reply( config => {
            try {
                expect(config.params).toEqual({ id: '123' })
                expect(config.data).toEqual(JSON.stringify(newChannel))
                return [202, newChannel]
            } catch (e){
                done.fail(e)
            }
        })
        store.dispatch(actions.update('123', { name: 'new name' }))

        expect(store.getState().loading.channels['123']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.channels['123']).toEqual({ ...channel, ...newChannel })
            expect(state.loading.channels['123']).toBe(false)
        })
    })
    test('update error', done => {
        const data = { message: 'test error '}
        const channel = {
            id: '123', name: 'test name', other: 'data'
        }
        store.dispatch(basicActions.set('123', channel))
        mock.onPut('/channel').reply(500, data)
        store.dispatch(actions.update('123', { name: 'new name' }))

        expect(store.getState().loading.channels['123']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.channels['123']).toEqual(channel)
            expect(state.errors.channels['123']).toEqual(data)
            expect(state.loading.channels['123']).toBe(false)
        })
    })
    test('remove success', done => {
        const channel = {
            id: '123', name: 'test name', other: 'data'
        }
        store.dispatch(basicActions.set('123', channel))

        mock.onDelete('/channel', { params: { id: '123' }}).reply(202)
        store.dispatch(actions.remove('123'))

        expect(store.getState().loading.channels['123']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.channels['123']).toBe(undefined)
            expect(state.loading.channels['123']).toBe(false)
        })
    })
    test('remove error', done => {
        const channel = {
            id: '123', name: 'test name', other: 'data'
        }
        store.dispatch(basicActions.set('123', channel))
        const data = { message: 'test error' }
        mock.onDelete('/channel', { params: { id: '123' }}).reply(500, data)
        store.dispatch(actions.remove('123'))

        expect(store.getState().loading.channels['123']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.channels['123']).toEqual(channel)
            expect(state.errors.channels['123']).toEqual(data)
            expect(state.loading.channels['123']).toBe(false)
        })
    })
})