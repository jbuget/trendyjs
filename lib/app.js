import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import hbs from 'hbs';

import index from './routes/index';
import users from './routes/users';
import services from './routes/services';
import snapshots from './routes/snapshots';
import histories from './routes/histories';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin@ds135820.mlab.com:35820/trendyjs');

const app = express();

// favicon.ico
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layouts/default' });
hbs.registerPartials(path.join(__dirname, '/views/partials'));

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Font Awesome
app.use('/node_modules/font-awesome', express.static('./node_modules/font-awesome'));

app.use('/', index);
app.use('/users', users);
app.use('/services', services);
app.use('/snapshots', snapshots);
app.use('/histories', histories);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  /* eslint-disable no-param-reassign */
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  /* eslint-enable no-param-reassign */

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error');
});

module.exports = app;
