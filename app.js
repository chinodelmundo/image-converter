const express = require('express');
const app = express();

const indexRouter = require('./routes/index');

app.set('view engine', 'ejs');
app.use(express.static('public'));

// ROUTES
app.use('/', indexRouter);

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Hey I'm running on port ${PORT}`));
