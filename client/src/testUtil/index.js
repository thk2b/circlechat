export function runAsync(done, fn){
    setTimeout(() => {
        try {
            fn()
            done()
        } catch(e){
            done.fail(e)
        }
    }, 0)
}