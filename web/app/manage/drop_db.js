const drop = require('../db/drop')

if(process.env.NODE_ENV === 'prod'){
    console.error('refusing to drop production DB. Do it manually.')
    process.exit(0)
}
drop()