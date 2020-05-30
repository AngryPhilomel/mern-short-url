const expess = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')

const authRouter = require('./routes/auth.routes')
const linkRouter = require('./routes/link.routes')
const redirectRouter = require('./routes/redirect.roures')

const app = expess()

app.use(expess.json({extended:true}))

app.use('/api/auth', authRouter)
app.use('/api/link', linkRouter)
app.use('/t', redirectRouter)

if (process.env.NODE_ENV === 'production') {
  app.use('/', expess.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}


const PORT = config.get('port') || 5000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(PORT, () => {
      console.log(`App has been started on port ${PORT}...`)
    })
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()

