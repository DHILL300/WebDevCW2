const express = require('express');
const router = express.Router();
const {login}  = require('../auth/auth');
const {verify} = require('../auth/auth');

const controller = require('../controllers/appController');

router.get("/", controller.about);
router.get('/about', controller.about);

router.get('/nutrition', verify, controller.nutrition);

router.get('/lifestyle', verify,  controller.lifestyle);

router.get('/fitness', verify, controller.fitness);

router.get('/goals', verify, controller.displayGoals);

router.get('/new', verify, controller.newGoal);
router.post('/new', verify, controller.post_new_goal);

router.get('/register', controller.show_register_page);
router.post('/register', controller.post_new_user);

router.get('/login', controller.show_login_page);
router.post('/login', login, controller.handle_login);

router.get('/logout', controller.logout);


router.get('/editGoal', controller.show_edit_goal_page);
router.post('/editGoal', controller.post_edited_goal);

router.get('/deleteGoal', controller.show_delete_page);
router.post('/deleteGoal', controller.post_deleted_goal);


router.use(function(req,res){
    res.status(404);
    res.type('text-plain');
    res.send('404 not found.');
})
router.use(function(req,res){
    res.status(500);
    res.type('text-plain');
    res.send('Internal Server Error');
})
module.exports = router;