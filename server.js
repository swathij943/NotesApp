// load .env data into process.env
require("dotenv").config();

// Web server config
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const helmet = require("helmet");
const path = require("path");

// User Made Functions

const PORT = process.env.PORT || 8080;
const app = express();

//Setting up EJS and views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Getting the static files
app.use(express.static(path.join(__dirname, "public"))); // replace 'public' with the path to your static files directory

// helmet for security
app.use(helmet());

// Cookie Options
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);
app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require("./routes/users-api");
const widgetApiRoutes = require("./routes/widgets-api");

const chatRoutes = require("./routes/chat");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const tasksRoutes = require("./routes/tasks");

const { updateuserProfile } = require("./db/queries/profile");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use("/api/users", userApiRoutes);
app.use("/api/widgets", widgetApiRoutes);

app.use("/api/openai", chatRoutes);
app.use("/chat", chatRoutes);

app.use("/users", usersRoutes);

app.use("/", authRoutes);
app.use("/profile", profileRoutes);


app.use("/tasks", tasksRoutes);

// Note: mount other resources here, using the same pattern above

//const taskQueries = require("./db/queries/tasks");

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

//Login
app.get("/login", (req, res) => {
  res.render("login", { user: req.user || {} });
});

app.post('/gotochat', (req, res) => {
  const userTask = req.body.taskarea;
  console.log(userTask);
  res.render('chat', { message: userTask });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
