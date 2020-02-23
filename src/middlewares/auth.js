const UserModel = require('../model/users');

const authorization = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!['/register', '/login'].includes(req.path)) {
            const user = await UserModel.getUserById(req.headers.id);
            if (user.token != token) {
                res.status(401).send({ message: 'Unauthorized' });
            }
        }
        next();
    } catch (error) {
        res.status(401).send({ message: 'Unauthorized' });
    }
};

module.exports = authorization;
