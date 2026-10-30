// tasks that we are going to perform:-
// (I) create user account: 1.mongoose 2.schema 3.model 4.usercreate->password->hash 5. jwt token->cookie
// (II) login->token->dcrypt->email


const express = require('express');
const app = express();
const userModel = require("./models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const path = require('path');
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/create', (req, res) => {
    let { username, email, password, age } = req.body; //user bahar nikalna

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            // console.log(hash);
            let createdUser = await userModel.create({
                username,
                email,
                password: hash, //instead of password, we show hash
                age
            })


            //we are using the below code to keep us logged in
            let token = jwt.sign({ email }, "shhhhhhh"); //we want to store email and we have also provided a secret key
            res.cookie("token", token); //now we are sending this token to the frontend as a cookie
            res.send(createdUser);
        })
    })
});

app.get("/login", function (req, res) {
    res.render('login');
});

app.post("/login", async function (req, res) {
    let user = await userModel.findOne({ email: req.body.email })
    if (!user) return res.send("something went wrong");

    //req.body.password->what the user is now typing
    //user.password->what we have hashed
    bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result){
            //we have to create this token again bcoz since the user is now logged in,we need to send this cookie to the browser again so the user has to not login again
            let token=jwt.sign({email:user.email},"shhhhhhh"); //we want to store email and we have also provided a secret key
            res.cookie("token",token); //now we are sending this token to the frontend as a cookie
            res.send("yes you can login");
        } 
        else res.send("something is wrong")
    })
});

//ideally this should have been a post request as we are logging out, we are making a change
app.get("/logout", function (req, res) {
    res.cookie("token", ""); //we are removing the token that we set earlier
    res.redirect("/");
})

app.listen(3000); 
