const router = require('express').Router();
const User = require('../models/user');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/register', async (req, res) => {

  const {error} = registerValidation(req.body);
  if(error){
    return res.status(400).send(error.details[0].message);
  }

  const userExists = await User.findOne({name: req.body.name});
  if (userExists) {
    return res.status(400).send('Username already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    password: hashPassword
  });

  try{
    const savedUser = await user.save();
    res.send(savedUser);
  }catch(err){
    res.status(400).send(err);
  }

});

router.post('/login', async (req, res) => {
  const {error} = loginValidation(req.body);
  if(error){
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findOne({name: req.body.name});
  if (!user) {
    return res.status(400).send('Username or password is wrong');
  }

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if(!validPass){
    return res.status(400).send('Username or password is wrong');
  }

  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
  res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 });

})

module.exports = router;
