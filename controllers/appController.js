//import appModel class
//instantiate appModel class
const { response } = require('express');
const appDAO = require('../models/appModel');
const userDAO = require('../models/userModel');

const db = new appDAO();
db.init();


exports.about = function(req, res) {
    res.render('about');
    
}

exports.fitness = function(req, res) {
     res.render('fitness', {
        'title': 'Fitness'
     });
}

exports.lifestyle = function(req, res) {
    res.render('lifestyle',{
        'title': 'Lifestyle'
    });
}

exports.nutrition = function(req, res) {
    res.render('nutrition', {
        'title': 'Nutrition'
    });
}

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

exports.newGoal = function(req,res) {
    res.render('new', {
        'title': 'New Goal'
    });
}

exports.post_new_goal = function(req,res) {
    console.log('processing post-goal-entry controller');
    if (!req.body.author) {
        response.status(400).send('Goals must have an author');
        return;
    }  
    db.addEntry(req.body.name, req.body.contents,req.body.category,req.body.status, req.body.author,);
    res.redirect('/goals');
}

exports.show_register_page = function(req, res){
    res.render('user/register');
}
exports.post_new_user = function(req,res) {
    const user = req.body.username;
    const password = req.body.password;

    if (!user || !password) {
        res.send(401, 'no user or password');
        return;
    }

    userDAO.lookup(user, function(err, u) {
        
        if (u) {          
            //res.status("User Exists:").send(user).render('/user/login');
            //res.send(401, "User exists:", user);
           res.redirect('/login');
            return;
        }
        userDAO.create(user, password);
        console.log("register user", user, "password", password);
        res.redirect('/login');
    });
}

exports.show_login_page = function(req,res){
    res.render('user/login', {
        'title': 'Log In'
    });
}

exports.handle_login = function(req, res) {
    res.render('about', {
        'title': 'home page',
        'user': 'user'
    });
}

exports.logout = function(req,res) {
    res.clearCookie("jwt").status(200).redirect("/");
    
}


exports.show_edit_goal_page =  function (req, res) {
    res.render('editGoal');
}

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

exports.show_delete_page = function (req,res) {
    res.render('deleteGoal', {
        'title': 'Delete Goal'
    });
}

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
