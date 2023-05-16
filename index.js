const connectToMongo = require('./db');
const express = require('express');

connectToMongo()

const app = express()
const port = 3500

app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/category', require('./routes/category'))
app.use('/api/blogs', require('./routes/blogs'))


app.get('/', (req, res) => {
  res.send('Hello Blogger!')
})

app.listen(port, () => {
  console.log(`Blog Server listening on port ${port}`)
})