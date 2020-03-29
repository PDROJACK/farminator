const functions = require('firebase-functions');

const firebase = require('firebase');

const app = require('express')();

var admin = require("firebase-admin");
var {firebaseConfig} = require('./utils/config');
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

firebase.initializeApp(firebaseConfig);
/**
 * Post request for 
 * 
 */
app.post('/farmer/create',async (req,res)=>{
    try {
        //console.log(loc)
        let newJob = {
            amount: req.body.amount,
            pickup_location: new admin.firestore.GeoPoint(req.body._latitude,req.body._longitude),
            price: req.body.price,
            title: req.body.title,
            type: ['fruit']
        };
        //console.log(loc)
        await db.collection('job').add(newJob)
        //console.log(loc)
        res.status(201).json({
            message: 'Job created succesfully'
        })
    } catch (error) {
        res.status(500).json(error);
    }
});

/**
 * GET request for consumers
 * 
 */

app.get('/consumer',async(req,res)=>{
    try {
        const data = await db.collection('consumers').get();
        let consumer = [];
        data.forEach( (c)=>
            consumer.push({
                name : c.data().name,
                email: c.data().email
            })
        );
        res.status(200).json(consumer);
    } catch (error) {
        res.status(500).json(error)
    }
});

/**
 * 
 * 
 */
app.post('/signup',async (req,res)=>{
    try {
        const user = {
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            role: req.body.email
        };
        await firebase.auth().createUserWithEmailAndPassword(user.email,user.password);
        res.status(201).json({
            message: "User Created"
        })
    } catch (error) {
        res.status(500).json(error);
    }
});



/**
 * GET request for jobs
 * 
 */
app.get('/jobs',async(req,res)=>{
    try {
        const data = await db.collection('job').get();
        let jobs = [];
        data.forEach( (c)=>
            jobs.push({
                name : c.data().name,
                email: c.data().email
            })
        );
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json(error)
    }
});


app.get('/farmers',async(req,res)=>{
    try {
        const data = await db.collection('farmers').get();
        let farmers = [];
        data.forEach( (c)=>
            farmers.push({
                name : c.data().name,
                email: c.data().email,
                location: c.data().location
            })
        );
        res.status(200).json(farmers);
    } catch (error) {
        res.status(500).json(error)
    }
});

exports.api = functions.https.onRequest(app);