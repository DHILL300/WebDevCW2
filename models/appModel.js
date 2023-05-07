const nedb = require('nedb');

// goals class
// instantiate database in contructor of class
class AppGoals{
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new nedb({ filename: dbFilePath, autoload: true});
            console.log('DB connected to ' + dbFilePath);
        } else {
            this.db = new nedb();
        }
    }

    // first seed method adds inputs into database
    init(){
        this.db.insert({
            name: "goal1",
            contents: 'jog more',
            category: 'fitness',
            author:  'Jim',
            status: 'completed',
            published: '2021-01-17'
        });
        // for debugging
        console.log('DB entry Jim inserted');

        this.db.insert({
            name: 'newGoal',
            contents: 'eat less snacks',
            category: 'nitrition',
            author:  'David',
            status: 'failed',
            published: '1999-09-09'
        });
        // for debugging
        console.log('DB entry David inserted');
    }

    // get all entries method
    getAllEntries(){

        // return a promise object, which can be resolved or rejected
        return new Promise((resolve,reject) => {
            //use the find function of the database tp get data
            // error first callback function, err for error, entries for data
            this.db.find({}, function(err, entries) {
                // if error occurs reject promise
                if(err) {
                    reject(err);
                    // if no error, resole the promise and return data
                } else {
                    resolve(entries);
                    // to see what the returned data looks like
                    console.log('function all() returns: ', entries)}
            })
        })
    }
    //add goal to the database ssss
    addEntry( name,contents,category,status,author) {
        
        var entry = {
            name: name,
            contents: contents,
            category: category,       
            status: status,
            author: author,     
            published: new Date().toISOString().split('T')[0]
       }
       console.log('entry created', entry);
       this.db.insert(entry, function(err,doc) {
        if (err) {
            console.log('Error inserting document', subject);
        } else {
            console.log('document inserted into database', doc);
        }
       })
    }
// get goal function 
    getGoal(search){
        var goal = search;
        // return a promise object, which can be resolved or rejected
        return new Promise((resolve,reject) => {
            //use the find function of the database tp get data
            // error first callback function, err for error, entries for data
            this.db.find({contents:  goal}, function(err, entries) {
                // if error occurs reject promise
                if(err) {
                    reject(err);
                    // if no error, resole the promise and return data
                } else {
                    resolve(entries);
                    // to see what the returned data looks like
                    console.log('function all() returns: ', entries)}
            })
        })
    }
    // delete giol function
    deleteGoal(goalId){
        var goalInput = goalId;
        return new Promise((resolve, reject) => {
            this.db.remove({_id: goalInput}, function(err, docRemove){
                if(err) {
                    reject(err);
                    console.log('Error deleting Goal');
                }
                else {
                    resolve(docRemove);
                    console.log(docRemove, 'document removed form database');
                }
            })
        })
        
    }

    updateGoals(goalId, goalContents, goalStatus){
        return new Promise((resolve, reject) => {
            this.db.update(
            { _id: goalId },
            {$set: {contents: goalContents, status: goalStatus}},
             function(err, docs) {
                if(err) {
                reject(err)
                console.log("error updating documents", err);
                } else {
                    resolve(docs)
                    console.log(docs, "documents updated");
                }
             })
        })
    };
}






// make the module visible outside
module.exports = AppGoals;