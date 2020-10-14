const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3000

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.use(authenticateToken)

app.get('/', (req, res) => {
  res.send('Hello World! ' + JSON.stringify(req.user))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
