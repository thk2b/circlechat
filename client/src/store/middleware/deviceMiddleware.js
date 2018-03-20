import { setDevice } from '../modules/device'

export default window => ({ dispatch }) => {
    const set = () => {
        const isDesktop = window.innerWidth >= 768
        const isMobile = window.innerWidth <= 425

        dispatch(setDevice({
            isDesktop,
            isMobile,
            isTablet: !isDesktop && !isMobile
        }))
    }
    window.addEventListener('resize', set)
    set()

    return next => action => {
        return next(action)
    }
}