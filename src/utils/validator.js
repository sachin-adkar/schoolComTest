const moment = require('moment');
const responseMessage = require('../constants/response-message');
const statusCode = require('../constants/status-codes');
const validator = require('validator');

class Validator {
    static async isValidEmail(email) {
        try {
            if (!validator.isEmail(email.trim())) {
                throw {
                    status_code: statusCode.BAD_REQUEST,
                    message: responseMessage.INVALID_EMAIL
                };
            }
        } catch (error) {
            throw error;
        }
    }

    static async isParamExist(data) {
        try {
            for (let item of data) {
                item != undefined && item != 0 && (item = item.trim());
                if (!item) {
                    throw {
                        status_code: statusCode.BAD_REQUEST,
                        message: responseMessage.PARAMS_MISSING
                    };
                }
            }
        } catch (error) {
            throw error;
        }
    }

    static async isValidDate(date) {
        try {
            if (!moment(date, 'DD-MM-YYYY').isValid()) {
                throw { message: responseMessage.INVALID_DOB, status_code: statusCode.BAD_REQUEST };
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Validator;
