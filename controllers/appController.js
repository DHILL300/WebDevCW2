//import appModel class
//instantiate appModel class
const { response } = require('express');
const appDAO = require('../models/appModel');
const userDAO = require('../models/userModel');

const db = new appDAO();
db.init();

// about view
exports.about = function(req, res) {
    res.render('about');
    
}

// fitness view
exports.fitness = function(req, res) {
     res.render('fitness', {
        'title': 'Fitness'
     });
}

// lifetstyle view
exports.lifestyle = function(req, res) {
    res.render('lifestyle',{
        'title': 'Lifestyle'
    });
}
//nutition view
exports.nutrition = function(req, res) {
    res.render('nutrition', {
        'title': 'Nutrition'
    });
}
// display goals view
exports.displayGoals = function(req, res) {
    db.getAllEntries()
    .then((list) => {
        res.render('goals' , {
            'title': 'Goals',
            'goals': list
        });
        console.log('promise resolved');
    })
    .catch((err) => {
        console.log('promise rejected', err);
    })
    
}
// new goal view
exports.newGoal = function(req,res) {
    res.render('new', {
        'title': 'New Goal'
    });
}
//new goal POST add new entry to database
exports.post_new_goal = function(req,res) {
    console.log('processing post-goal-entry controller');
    if (!req.body.author) {
        response.status(400).send('Goals must have an author');
        return;
    }  
    db.addEntry(req.body.name, req.body.contents,req.body.category,req.body.status, req.body.author,);
    res.redirect('/goals');
}
// register view
exports.show_register_page = function(req, res){
    res.render('user/register');
}
// new used POST
exports.post_new_user = function(req,res) {
    const user = req.body.username;
    const password = req.body.password;

    if (!user || !password) {
        res.send(401, 'no user or password');
        return;
    }
//searching the database for the passed in user
    userDAO.lookup(user, function(err, u) {
        
        if (u) {  
            res.send(401, "User exists:", user);
           res.redirect('/login');
            return;
        }
        userDAO.create(user, password);
        console.log("register user", user, "password", password);
        res.redirect('/login');
    });
}

// log in view
exports.show_login_page = function(req,res){
    res.render('user/login', {
        'title': 'Log In'
    });
}

// handle log in 
exports.handle_login = function(req, res) {
    res.render('about', {
        'title': 'home page',
        'user': 'user'
    });
}

// log out, clear cookie
exports.logout = function(req,res) {
    res.clearCookie("jwt").status(200).redirect("/");
    
}

// edit goal view
exports.show_edit_goal_page =  function (req, res) {
    res.render('editGoal');
}
// post edit goal, update database
exports.post_edited_goal = function (req, res) {
    const goalId = req.body._id;
    const goalContents = req.body.contents;
    const goalStatus = req.body.status;

    db.updateGoals(goalId, goalContents,goalStatus,  function(err, u) {
        if(u) {
            res.redirect('/goals');
            return;
        }
    });
    res.redirect('/goals');
        
}
// delete goal view
exports.show_delete_page = function (req,res) {
    res.render('deleteGoal', {
        'title': 'Delete Goal'
    });
}
// delete goal post
exports.post_deleted_goal = function (req, res) {
    const goalDelete = req.body._id;
    console.log(goalDelete);
    db.deleteGoal(goalDelete, function(err, u) {
        if(u) {
            res.send("Goal Deleted");
            return;
        }
    });
    res.redirect('/goals');
}
