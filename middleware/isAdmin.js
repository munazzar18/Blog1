const isAdmin = (req, res, next) => {
    const role = req.user.role

    if (role !== 'admin'){
        res.status(401).send({message: 'You are not authorized by us'})
    }
    next()
}

module.exports = isAdmin