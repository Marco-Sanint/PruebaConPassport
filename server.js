//server.js

const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const PassportLocal = require('passport-local').Strategy;

// URL = http://localhost:3000/login

const app = express();

app.use(express.urlencoded({extended: true}));

app.use(cookieParser('mi ultra secreto'))

app.use(session({
    secret: 'mi ultra secreto',
    resave: true,
    saveUnitialized: true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(function(username, password, done){
    if(username === "marco" && password === "123")
        return done(null,{id: 1, name: "Cody"});
    done(null, false);
}));

passport.serializeUser(function(user,done){
    done(null, user.id);
});

passport.deserializeUser(function(id,done){
    done(null, {id: 1, name: "Cody"});
});

app.set('view engine', 'ejs');

app.get("/",(req, res, next)=>{
    if(req.isAuthenticated()) return next();
    res.redirect("/login");
},(req, res)=>{
    //Secion iniciada

    //Secion sin iniciar
    res.send("hola");
});

app.get("/login", (req, res) => {
    // Mostrar el formulario de login y pasar la variable message si es necesario
    res.render("login", { message: req.flash('error') });
});

app.post("/login", passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true 
}));

app.get("/signup", (req, res) => {
    // Mostrar el formulario de registro
    res.render("signup");
});

app.post("/signup", (req, res) => {
    res.redirect("/login");
});


app.listen(3000, () => console.log(`Servidor ON`));