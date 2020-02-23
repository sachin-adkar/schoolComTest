const helper = require('./helper');
const UserModel = require('../../model/users');
const passwordEncryption = require('../../utils/password-encryption');
const tokenGenerator = require('../../utils/token-genrator');
const messages = require('../../constants/response-message');
const openBraces = ['{', '[', '('];
const closeBraces = ['}', ']', ')'];
const braces = '{([])}';
const ADMIN = 'admin';
const SUCCESS = 'SUCCESS';
const FAILED = 'FAILED';

class User {
    static async register(req, res) {
        try {
            const params = req.body;
            await helper.validateRegestration(params);
            params.token = await tokenGenerator.getToken(params.email);
            params.password = await passwordEncryption.createHash(params.password.trim());
            const result = await UserModel.register(params);
            result.token = params.token;
            res.status(200).send(result);
        } catch (error) {
            if (error.status_code) res.status(error.status_code);
            else res.status(500);
            res.send(error);
        }
    }

    static async login(req, res) {
        try {
            const params = req.body;
            const user = await UserModel.getUser(params.email);
            if (await passwordEncryption.validateHash(user, params.password)) {
                const token = await tokenGenerator.getToken(params.email);
                await UserModel.updateToken(params.email, token);
                res.send({ token, id: user._id });
            }
        } catch (error) {
            if (error.status_code) res.status(error.status_code);
            else res.status(500);
            res.send(error);
        }
    }

    static async listUsers(req, res) {
        try {
            const user = await UserModel.getUser(req.query.email);
            if (user.role != ADMIN) {
                throw { message: messages.MUST_BE_ADMIN, status_code: 400 };
            }
            const result = await UserModel.listUsers();
            res.send(result);
        } catch (error) {
            if (error.status_code) res.status(error.status_code);
            else res.status(500);
            res.send(error);
        }
    }

    static async deleteUser(req, res) {
        try {
            const user = await UserModel.getUser(req.query.email);
            const targetUser = await UserModel.getUser(req.query.targetEmail);
            if (user.role == ADMIN || targetUser.role == ADMIN) {
                throw { message: messages.CANNOT_DELETE, status_code: 400 };
            }
            await UserModel.deleteUser(req.query.targetEmail);
            res.send({ status_code: 200, message: messages.DELETE_SUCCESS });
        } catch (error) {
            if (error.status_code) res.status(error.status_code);
            else res.status(500);
            res.send(error);
        }
    }

    static async validate(req, res) {
        try {
            const paranthesis = req.query.paranthesis;
            let valid = true;
            let message;
            const stack = [];
            for (let i = 0; i < paranthesis.length; i++) {
                if (braces.includes(paranthesis[i])) {
                    if (openBraces.indexOf(paranthesis[i]) > -1) {
                        stack.push(paranthesis[i]);
                    } else {
                        if (stack.length === 0 || stack.pop() != openBraces[closeBraces.indexOf(paranthesis[i])]) {
                            valid = false;
                        }
                    }
                } else {
                    valid = false;
                }
            }
            const { name, attempts } = await UserModel.updateAttempts(req.query.email);
            if (!stack.length && valid) {
                message = SUCCESS;
            } else message = FAILED;
            res.send({ name, attempts, message });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;
