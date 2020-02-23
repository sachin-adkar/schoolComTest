const UserModel = require('./schema');
const { isEmpty } = require('lodash');
const messages = require('../../constants/response-message');
const statusCodes = require('../../constants/status-codes');

class User {
    static async register(data) {
        try {
            const user = await UserModel.findOne({
                email: data.email,
                status: 'active'
            }).exec();
            if (!isEmpty(user)) throw { message: messages.TRY_LOGIN, status_code: statusCodes.CONFLICT };
            const userData = new UserModel(data);
            return new Promise((resolve, reject) => {
                userData.save((error, doc) => {
                    if (error) {
                        reject({ status_code: statusCodes.INTERNAL_SERVER_ERROR, message: messages.UNABLE_TO_REGISTER });
                    }
                    resolve({ id: doc.id });
                });
            });
        } catch (error) {
            throw error;
        }
    }

    static async getUser(email) {
        try {
            const user = await UserModel.findOne({
                email: email,
                status: 'active'
            }).exec();
            if (!isEmpty(user)) return user;
            throw { message: messages.USER_NOT_FOUND, status_code: statusCodes.BAD_REQUEST };
        } catch (error) {
            throw error;
        }
    }

    static async getUserById(id) {
        try {
            const user = await UserModel.findById(id).exec();
            if (!isEmpty(user)) return user;
            throw { message: messages.USER_NOT_FOUND, status_code: statusCodes.BAD_REQUEST };
        } catch (error) {
            throw error;
        }
    }

    static async updateToken(email, token) {
        try {
            await UserModel.updateOne({ email }, { token: token }).exec();
        } catch (error) {
            throw { status_code: statusCodes.INTERNAL_SERVER_ERROR, message: messages.USER_NOT_FOUND };
        }
    }

    static async listUsers() {
        try {
            return await UserModel.find({}, { name: 1, role: 1, dob: 1, email: 1 });
        } catch (error) {
            throw { status_code: statusCodes.BAD_REQUEST, message: messages.USERS_NOT_FOUND };
        }
    }

    static async deleteUser(email) {
        try {
            await UserModel.update({ email }, { status: 'in-active' });
        } catch (error) {
            throw { status_code: 500, message: messages.DELETE_FAILED };
        }
    }

    static async updateAttempts(email) {
        try {
            const update = await UserModel.updateOne({ email }, { $inc: { attempts: 1 } }).exec();
            if (update.nModified) {
                const user = await UserModel.findOne({ email }, { name: 1, attempts: 1, _id: 0 });
                if (isEmpty(user)) throw { status_code: statusCodes.BAD_REQUEST, message: messages.USER_NOT_FOUND };
                return user;
            }
            throw { status_code: 500, message: 'Unable to update attempts' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;
