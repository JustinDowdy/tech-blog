const express = require("express");
const path = require("path");
//requiring controllers
const controller = require("./controllers");
//requiring handlebars
const exphbs = require("express-handlebars");
//requiring sequelize
const sequelize = require("./connection");
//requiring the session
const session = require("express-session");
const SequelizingTheStore = require("connect-session-sequelize")(session.Store);

//session set up
const sess = {
  secret: "top secret!",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizingTheStore({
    db: sequelize,
  }),
};
//start up the server
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sess));

app.use("/", controller);

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});