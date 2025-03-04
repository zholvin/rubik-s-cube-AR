const express = require('express');
const app = express();
const path = require('path');

app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/01-homepage/junjiehome.html'));
});
app.listen(8080, () => {
    console.log("Listening on http://localhost:8080");
});
