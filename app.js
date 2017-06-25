var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var settings = require('./settings');

var session = require('express-session');          /*引用第三方中间件把cookie存入数据库*/
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var multer = require('multer');

var app = express();

app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//文件上传
app.use(multer({
  dest:'./public/images',
  rename:function(filename,filename){
    return filename;
  }
}))

app.use(session({
  secret: settings.cookieSecret,
  key:settings.db,    
  cookie:{maxAge:1000 * 60 * 60 * 24 * 30},    
  store:new MongoStore({
    /*db:settings.db,
    host:settings.host,
    port:settings.port*/
    url:'mongodb://localhost/blog'
  }),
  resave: true,
  saveUninitialized: true
}))
//secret 用来防止篡改 cookie，key 的值为 cookie 的名字，通过设置 cookie 的 maxAge 值设定 cookie 的生存期，这里我们设置 cookie 的生存期为 30 天，设置它的 store 参数为 MongoStore 实例，把会话信息存储到数据库中，以避免丢失
//可以通过 req.session 获取当前用户的会话对象，获取用户的相关信息。
routes(app);

app.listen(app.get('port'),function(){
  console.log('Express server listening on port '+ app.get('port'));
})
