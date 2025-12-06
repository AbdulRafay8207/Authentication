const http = require('http')
const fsPromises = require('fs/promises')
const validation = require('./validation.js')
const express = require('express')
const path = require('path')
const app = express()
app.set("view engine", "ejs")
app.use(express.json({extended:true}))
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'Assets')))

app.get("/login",(req,res) =>{
    const successMsg = req.query.success || null;
    const errorMsg = req.query.error || null
    res.render('Pages/login',{errorMsg,successMsg})
})
app.post('/login', async(req,res) => {
    const {email, password} = req.body
    const content = await fsPromises.readFile('./database.json', {encoding: 'utf8'})
    const data = JSON.parse(content)
    const user = data.users.find(user => user.email === email && user.password === password)
    if(user){
        console.log('successfully login');
        return res.render('Pages/dashboard')
    }else{
        res.redirect('/login?error=Credential%20dont\'t%20match')
    }
})
app.get("/signin",(req,res) =>{
    res.render('Pages/signin',{
        errors: [],
        errorMsg: null,
        successMsg: null
    });
})

app.post('/signin',validation.createNewUser,async (req,res) => {
    user = req.body
    try{
        const content = await fsPromises.readFile('./database.json',{encoding: 'utf8'})
        const data = JSON.parse(content)
        const newUser = {
            id: data.users.length + 1,
            created_at: new Date(),
            ...user
        }
        data.users.push(newUser)
        await fsPromises.writeFile('./database.json',JSON.stringify(data))
        res.redirect("/login?success=Account%20created%20successfully")
     }
    catch(err){
        console.error("err.message");
    }
})

const PORT = 3200
app.listen(PORT,()=> console.log("Server started at port",PORT))