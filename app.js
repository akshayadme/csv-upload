//--------- Configure Environment Variables Gloally on Project --------- //
require("dotenv").config();

// --------Importing DB Configuration----------- //
require("./config/mongoose");

//----------- Importing Modules -----------//
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");

const PORT = process.env.PORT || 3000;

const app = express();

//-----EJS---------//
app.use(expressLayouts);
app.use("/assets", express.static("./assets"));
app.set("view engine", "ejs");

//------BodyParser--------//
app.use(express.urlencoded({ extended: true }));

//------Method Override--------//
app.use(methodOverride("_method"));

//---------Express Session----------//
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

//---------Connect Flash for message flash----------//
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.server_error = req.flash("server_error");
  next();
});

//-----Routes---------//
app.use("/", require("./routes/filesRoutes"));

app.listen(
  PORT,
  console.log(
    `Server started on port ${PORT}, on this link: http://localhost:${PORT}`
  )
);
