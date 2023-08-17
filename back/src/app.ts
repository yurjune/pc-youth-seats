import history from 'connect-history-api-fallback';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'path';

import apiRouter from './routes/api';
import enrollSchedules from './scheduler';
import launchSocketIO from './socket';

global.lateSeatIds = [];
global.absentSeatIds = [];

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());
app.use(history());
app.use(helmet());
app.set('port', process.env.PORT || 5000);

enrollSchedules();

export const expressServer = app.listen(app.get('port'), () => {
  console.log('WebServer Port: ' + app.get('port'));
});
launchSocketIO(expressServer);

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.use('/api', apiRouter);
