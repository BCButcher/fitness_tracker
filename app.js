const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var routes = require("./controller/controller.js");

app.use(routes);

app.listen(PORT, () => {
    console.log(`Program running on port ${PORT}!`)
});