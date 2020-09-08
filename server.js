const express = require("express");
const app = express();
const session = require("express-session");
const db = require("./models");
const PORT = process.env.PORT || 5000;
const path = require("path");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const apiRoutes = require("./routes/api-routes");
app.use(apiRoutes);

app.use("/users", require("./routes/user-routes"));

const foodRoutes = require("./routes/food-routes");
app.use(foodRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("health-tracker/build"));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "health-tracker", "build", "index.html")
    );
  });
}

db.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`listening at: http://localhost:${PORT}`));
});
