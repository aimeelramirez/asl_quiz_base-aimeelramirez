const express = require("express");
const path = require("path");
const error = require("debug")("server:error");
const expressSession = require('express-session');
const FileStore = require('session-file-store')(expressSession);

// running app
const app = express();
app.use(express.static(path.join(__dirname, "/public")));
const API = require("./utils/api");
const publicRoutes = require("./routes/public");
const quizRoutes = require("./routes/quizzes");
const questionRoutes = require("./routes/questions");
const choiceRoutes = require("./routes/choices");
const authRoutes = require("./routes/auths");
const protectedRoute = require('./utils/protectedRoute');

app.use(express.static("public"));
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));
app.use(express.static('public'));

// app.use("/static", express.static(path.resolve("public")));
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new FileStore(),
}));

app.use((req, res, next) => {

    console.log(req.sessions)
    const { loggedIn = false, token = null } = req.session;
    res.locals.loggedIn = loggedIn;
    res.locals.token = token;
    res.locals.userId = ""
    next();
});

//apply api
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     next();
// })
app.use(API);
//engine
app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);
//get routes
app.use("/", publicRoutes);
app.use('/quizzes', publicRoutes);
app.use("/quiz", quizRoutes);
app.use("/admin/auth", authRoutes);

app.use("/admin/quizzes", protectedRoute, quizRoutes);
app.use("/admin/questions", protectedRoute, questionRoutes);
app.use("/admin/choices", protectedRoute, choiceRoutes);
// app.use(express.json());

//eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    error("error found: ", err);
    res.sendStatus(500);
});
module.exports = app;
