const {Router} = require('express')
const config = require('config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

// api/auth
router.post(
  '/register',
  [
    check('email', 'Invalid Email').isEmail(),
    check('password', '6 symbols minimum in password').isLength({min: 6})
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid Credentions'
      })
    }

    const {email, password} = req.body

    const candidate = await User.findOne({email})
    
    if (candidate) {
      return res.status(400).json({message: 'User already exist.'})
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({email, password: hashedPassword})

    await user.save()

    res.status(201).json({message: 'User been created'})

  } catch (e) {
    res.status(500).json({message: "Something went wrong. Try again."})
    console.log(e.message)
  }
})



router.post(
  '/login',
  [
    check('email', 'Invalid Email').normalizeEmail().isEmail(),
    check('password', 'Invalid password').exists()
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid Login'
      })
    }

    const {email, password} = req.body

    const user = await User.findOne({email})

    if (!user) {
      return res.status(400).json({message: "User is not exist"})
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({message: 'Wrong password'})
    }

    const token = jwt.sign(
      { userId: user.id },
      config.get('jwtSecret'),
      { expiresIn: '1h' }
    )

    res.json({ token, userId: user.id })



  } catch (e) {
    res.status(500).json({message: "Something went wrong. Try again."})
  }
})

module.exports = router