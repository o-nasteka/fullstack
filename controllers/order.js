const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

// (get) localhost:5000/api/order?offset=2&limit=5
module.exports.getAll = async function(req, res) {
    const query = {
        user: req.user.id
    }

    // Дата старта
    if (req.query.start) {
        query.date = {
            // Больше или равно
            $gte: req.query.start
        }
    }

    // Дата конца
    if (req.query.end) {
        if (!query.date) {
            query.date = {}
        }

        // Меньше или
        query.date['$lte'] = req.query.end
    }

    // order
    if (req.query.order) {
        query.order = +req.query.order // + приведение к числу
    }

    try {
        const orders = await Order
            .find(query)
            .sort({date: -1})
            .skip(+req.query.offset) // + приведение к числу
            .limit(+req.query.limit) // + приведение к числу
        res.status(200).json(orders)

    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function(req, res) {
    try {
        // Get Last Order by Date
        const lastOrder = await Order
            .findOne({user: req.user.id})
            .sort({date: -1})

        // Max Order
        const maxOrder = lastOrder ? lastOrder.order : 0

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