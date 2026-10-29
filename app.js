// tasks that we are going to perform:-
// (I) create user account: 1.mongoose 2.schema 3.model 4.usercreate->password->hash 5. jwt token->cookie
// (II) login->token->dcrypt->email


const express = require('express');
const app = express();
const userModel = require("./models/user");
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')

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
                password:hash,
                age
            })

            let token=jwt.sign({email},"shhhhhhh");
            res.cookie("token",token);
            res.send(createdUser);
        })
    })
});

app.listen(3000); 



//25:00-frist create mongodb compass
