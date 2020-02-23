const validator = require('../../utils/validator');

class Helper {
    static async validateRegestration(params) {
        try {
            await validator.isParamExist([params.name, params.email, params.password, params.dob]);
            await validator.isValidEmail(params.email);
            await validator.isValidDate(params.dob);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Helper;
