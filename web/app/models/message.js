module.exports = function(db, types){
    return db.define('Message', {
        id: { 
            type: types.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        text: {
            type: types.STRING,
            allowNull: false,
        }
    })
}