const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // 允许前端请求
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express backend!');
});

app.listen(8080, () => {
    console.log('Backend running at http://localhost:8080');
});