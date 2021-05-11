require("dotenv").config();
const { PORT_TEST, PORT, NODE_ENV, API_VERSION } = process.env;
const port = PORT;
// console.log(port);

// Express initialization
const express = require("express");
// const { reset } = require("nodemon");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/" + API_VERSION,
    [
        require("./server/routes/match_route")
    ]
);

// page not found
// app.use(function (req, res, next) {
//     res.status(404).sendFile(__dirname + "/public/404.html");
// });

if (NODE_ENV !== "production") {
    app.listen(port, () => {
        console.log(`App listening on port: ${port}`);
    });
}

module.exports = app;
