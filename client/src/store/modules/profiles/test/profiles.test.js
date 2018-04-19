import api from '../../../api'
import MockAdapter from 'axios-mock-adapter'
import { runAsync } from '../../../../testUtil'

import createStore from '../../../'
import actions from '../networkActions'
import { actions as basicActions } from '../'

describe('profiles api actions', () => {
    let store
    const mock = new MockAdapter(api)

    beforeEach(() => {
        mock.reset()
        store = createStore()
    })

    test('create error', done => {
        const data = { message: 'test error' }
        mock.onPost('/profile').reply(403, data)
        store.dispatch(actions.create({ name: 'test name' }))
        expect(store.getState().loading.profiles.new).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.errors.profiles.new).toEqual(data)
            expect(state.loading.profiles.new).toBe(false)
        })
    })
    test('create success', done => {
        const data = { name: 'test name' }
        const responseData = {...data, id: '123'}
        mock.onPost('/profile', data).reply(201, {
            profile: responseData
        })
        store.dispatch(actions.create(data))
        expect(store.getState().loading.profiles.new).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.profiles['123']).toEqual(responseData)
            expect(state.loading.profiles.new).toBe(false)
        })
    })
    test('get success', done => {
        const data = { id: '123', name: 'test name 1' }
        mock.onGet('/profile', { params: { id: '123' }}).reply(200, {profile: data})
        store.dispatch(actions.get('123'))
        expect(store.getState().loading.profiles['123']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.profiles['123']).toEqual(data)
            expect(state.loading.profiles['123']).toBe(false)
        })
    })
    test('get error', done => {
        const data = { message: 'test error'}
        mock.onGet('/profile', { params: { id: '123' }}).reply(500, data)
        store.dispatch(actions.get('123'))
        expect(store.getState().loading.profiles['123']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.profiles['123']).toBe(undefined)
            expect(state.errors.profiles['123']).toEqual(data)
            expect(state.loading.profiles['123']).toBe(false)
        })
    })
    test('getAll success', done => {
        const data = {
            '123': { id: '123', name: 'test name 1' },
            '234': { id: '234', name: 'test name 2' }
        }
        mock.onGet('/profile/all').reply(200, {profiles: data})
        store.dispatch(actions.getAll())
        expect(store.getState().loading.profiles.all).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.profiles).toEqual(data)
            expect(state.loading.profiles.all).toBe(false)
        })
    })
    test('getAll error', done => {
        const data = { message: 'test error '}
        mock.onGet('/profile/all').reply(500, data)
        store.dispatch(actions.getAll())
        expect(store.getState().loading.profiles.all).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.errors.profiles.all).toEqual(data)
            expect(state.loading.profiles.all).toBe(false)
        })
    })
    test('update success', done => {
        const profile = {
            id: '123', name: 'test name', other: 'data'
        }
        store.dispatch(basicActions.set('123', profile))
        const newProfile = {
            name: 'new name'
        }
        
        mock.onAny().reply( config => {
            try {
                expect(config.method).toBe('put')
                expect(config.params).toEqual({ id: '123' })
                expect(config.data).toEqual(JSON.stringify(newProfile))
                return [202, newProfile]    
            } catch (e){
                done.fail(e)
                return [500]
            }

        })
        store.dispatch(actions.update('123', { name: 'new name' }))

        expect(store.getState().loading.profiles['123']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.profiles['123']).toEqual({ ...profile, ...newProfile })
            expect(state.loading.profiles['123']).toBe(false)
        })
    })
    test('update error', done => {
        const data = { message: 'test error '}
        const profile = {
            id: '123', name: 'test name', other: 'data'
        }
        store.dispatch(basicActions.set('123', profile))
        mock.onPut('/profile').reply(500, data)
        store.dispatch(actions.update('123', { name: 'new name' }))

        expect(store.getState().loading.profiles['123']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.profiles['123']).toEqual(profile)
            expect(state.errors.profiles['123']).toEqual(data)
            expect(state.loading.profiles['123']).toBe(false)
        })
    })
    test('remove success', done => {
        const profile = {
            id: '123', name: 'test name', other: 'data'
        }
        store.dispatch(basicActions.set('123', profile))

        mock.onDelete('/profile', { params: { id: '123' }}).reply(202)
        store.dispatch(actions.remove('123'))

        expect(store.getState().loading.profiles['123']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.profiles['123']).toBe(undefined)
            expect(state.loading.profiles['123']).toBe(false)
        })
    })
    test('remove error', done => {
        const profile = {
            id: '123', name: 'test name', other: 'data'
        }
        store.dispatch(basicActions.set('123', profile))
        const data = { message: 'test error' }
        mock.onDelete('/profile', { params: { id: '123' }}).reply(500, data)
        store.dispatch(actions.remove('123'))

        expect(store.getState().loading.profiles['123']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.profiles['123']).toEqual(profile)
            expect(state.errors.profiles['123']).toEqual(data)
            expect(state.loading.profiles['123']).toBe(false)
        })
    })
    test('getProfileOfUser success', done => {
        const data = { id: '123', name: 'test name 1', userId: '987' }
        mock.onGet('/profile', { params: { userId: '987' }}).reply(200, {profile: data})
        store.dispatch(actions.getProfileOfUser('987'))
        
        // expect(store.getState().loading.profiles['123']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            expect(state.profiles['123']).toEqual(data)
            // expect(state.loading.profiles['123']).toBe(false)
        })
    })
    test.skip('getProfileOfUser error', done => {
        const data = { message: 'test error' }
        mock.onGet('/profile', { params: { userId: '987' }}).reply(500, data)
        store.dispatch(actions.getProfileOfUser('987'))
        
        // expect(store.getState().loading.profiles['123']).toBe(true)
        runAsync(done, () => {
            const state = store.getState()
            // expect(state.profiles['123']).toEqual(data)
            // expect(state.loading.profiles['123']).toBe(false)
        })
    })
})