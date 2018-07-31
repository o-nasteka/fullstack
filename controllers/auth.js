const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')

module.exports.login = function(req, res) {
    const candidate = await User.findOne({email: req.body.email})

    if (candidate){
        // If User exist => Check password
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult){
            // Generate Token, password ok
            const token = jwt.sign({
                email: candidate.email,
                Userid: candidate._id
            }, 'keys.jwt', {expiresIn: 60 * 60})

            res.status(200).json({
                token: token
            })
        } else {
            // Error, incorrect password
            res.status(401).json({
                message: 'Пароли не совпадают, попробуйте снова'
            })
        }
    } else {
        // Usr doesn't exist => Error
        res.status(404).json({
            message: 'Пользователь с таким email не найден.'
        })
    }
}

module.exports.register = async function(req, res){
    // email password
    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        // If User has in DB, need send error
        res.status(409).json({
            message: 'Такой email уже занят. Попробуйте другой.'
        })
    } else {
        // Need add new user
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })

        try{
            await user.save()
            res.status(201).json(user)
        } catch(e){
            // error
        }

    }
}