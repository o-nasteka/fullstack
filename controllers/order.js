const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = function(req, res) {

}

module.exports.create = async function(req, res) {
    try {


        const order = await new Order({
            list: req.body.list,
            user: req.user.id,
            order: maxOrder + 1
        }).save()

        res.status(201).json(order)
    } catch (e) {
        errorHandler(res, e)
    }
}