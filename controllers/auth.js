const User = require('../models/User')
const express = require('express')
const jwt = require('jsonwebtoken')

const router = express.Router()


router.post('/sign-up', (req, res) => {
  User.findOne({ username: req.body.username }, async (err, userExists) => {
    if (err) return res.status(500).send(err)
    if (userExists) return res.status(400).send('username already exists')

    const user = await User.signUp(req.body.username, req.body.password)
    res.status(201).send(user.sanitize())
  })
})

router.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }, async (err, user) => {
    if (err) return res.status(500).send(err)

    const matchingPassword = await user.comparePassword(req.body.password)

    if (!user || !matchingPassword) return res.status(400).send('Invalid login info') 

    const token = jwt.sign({
      _id: user._id
    }, 'CHANGEME!')

    res.send({ token })
  })
})

module.exports = router
