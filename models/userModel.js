const Datastore = require("nedb");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// user class
class UserDAO{
    // constructor for user class
    constructor(dbFilePath) {
        if (dbFilePath){
        // embedded
        this.db = new Datastore({filename: dbFilePath, autoload: true});
        } else {
            // in memory
            this.db = new Datastore();
        }
    }
    // initialize seed users
    init() {
        this.db.insert({
            user: 'joke',
            password: 'a'
        });
        this.db.insert({
            user: 'Ann',
            password: '2'
        });
        return this;
    }
    // create user method
    create(username, password) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function(hash) {
            var entry = {
                user: username,
                password: hash,
            };
            that.db.insert(entry, function (err) {
                if (err) {
                    console.log("Can't insert user: ", username);
                }
            });
        });
    }
    // search // look up user method
    lookup(user, cb){
        this.db.find({'user': user}, function (err, entries){
           if (err) {
            return cb(null, null);
           } else {
            if (entries.length == 0) {
                return cb(null, null);
            }
            return cb(null, entries[0]);
           }
        })
    }
}

// create instance of user class and initialize 
const dao = new UserDAO();
dao.init();
// export
module.exports = dao;