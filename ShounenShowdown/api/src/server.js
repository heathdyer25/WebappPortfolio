const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
//WebSockets
const expressWs = require('express-ws')(app);

const PORT = process.env.SHOUNEN_PORT;

app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Here we attach all of our routers
const authRouter = require('./routers/AuthRouter');
app.use(authRouter);

const cardRouter = require('./routers/CardRouter');
app.use(cardRouter);

const userSettingsRouter = require('./routers/UserSettingsRouter');
app.use(userSettingsRouter);

const userCardRouter = require('./routers/UserCardRouter');
app.use(userCardRouter);

const userDeckRouter = require('./routers/UserDeckRouter');
app.use(userDeckRouter);

const packRouter = require('./routers/PackRouter');
app.use(packRouter);

const websocketRouter = require('./routers/WebSocketRoutes');
app.use(websocketRouter);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));