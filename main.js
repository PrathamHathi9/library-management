require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const userSchema = require("./userSchema");
const bookSchema = require('./bookSchema');
const passport = require("passport");
const PORT = process.env.PORT || 3000;
const LocalStratagy = require('passport-local').Strategy;
const {jwtAuthMiddleware, generateToken} = require('./jwt');
// const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const fs = require('fs');
const db = mongoose.connection;
const collection = db.collection('users');
app.use(express.json())
// console.log(collection);
//creating user
// {
//     "name" : "{{$randomFullName}}",
//     "email" : "{{$randomEmail}}",
//     "password" : "{{$randomPassword}}"
// }
app.post('/api/user/register', async (req, res) => {
    try {
        console.log(req.body); // Log the request body
        let dataBody = req.body;    
        let data = userSchema.create(dataBody);
        console.log('data saved', data);
        const salt = await bcrypt.hash(data.password, saltRounds);
        const payload = {email : dataBody.email};
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("token : ", token);
        return res.status(200).json({ response: dataBody, token: token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "internal server error" });
    }
});

//checking user when logs in
app.post ("/api/user/login", async ( req, res) => {
    try{
        let {username, password} = req.body;
        const user = await userSchema.findOne({name : username}).select(+password);
        console.log(user);
        // const pwd =  await bcrypt.compare(password , user.password);
        if(!user) return res.status(401).json({error : "invalid username or password"});
        const payload = {email : user.email};
        const token = generateToken(payload);
        console.log(token);
        let data = token.parse;
        console.log(data);
        res.json({user, token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : "internal server error"});
    }
    
})

//creating book
// app.post('/api/book', async ( req, res) => {
//     let dataBody = req.body;
//     let data = await bookSchema.create(dataBody);
//     if(!data)
//         {
//             res.status(404).json({message : "cannot add data"});
//         }
//     console.log(dataBody);
//     res.status(200).json({message : "data added successfully"});
// })

//sending data to the user
app.get('/data', jwtAuthMiddleware, async (req, res) => {
    // let user = req.user;
    try{
        let data = req.user;
        let user = await userSchema.findOne({email : data.userData.email});
        console.log(user);
        res.json({user});
    }catch(err){
        console.log(err);
        res.status(500).json({error : "internal server error"});
    }
})

//getting all data
app.get('/', async ( req, res) => {
    let data = await userSchema.find({});
    res.send(data);
})

//connecting database
mongoose.connect('mongodb://localhost:27017/libreary_management')
    .then(() => console.log('connnected to the database successfully'))
    .catch(() => console.log('not connected to the database'))


//creating server
app.listen(PORT, () => {
    console.log("server connected successfully", PORT);
})