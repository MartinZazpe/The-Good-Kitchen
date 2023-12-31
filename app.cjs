var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const methodOverride = require('method-override')
const session = require('express-session')
const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware')

var app = express()




var indexRouter = require('./routes/index.cjs')
var productsRouter = require('./routes/products.cjs')
var userRouter = require('./routes/users.cjs')



// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


require('dotenv').config()


// app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(methodOverride("_method"))
app.use(session({
  secret: "Security password =)",
  resave: false,
  saveUninitialized: false,
}))



// app.use(cors({
//   origin: '*',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,  // Enable credentials (cookies, authorization headers)
// }))

app.use(cors({
  origin: '*'
}))


app.use(userLoggedMiddleware)


app.use('/the-good-kitchen/', indexRouter)
app.use('/the-good-kitchen/user', userRouter)
app.use('/the-good-kitchen/recipes', productsRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).render('not-found')
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  // res.status(err.status || 500)
  // res.render('error')
})


module.exports = app
