const secret = 'sjdkahfjksdbfkjasdbfjbcksabdvljsbdlfkbadklsflsdbfklasdjbfklkcmnaslkdf3473&^*&#*^#*&yyddhfiub3#&(*(*$#Y*(Y$(9';
const jwt = require('jsonwebtoken');
/**
 * CREATE A JSON WEB TOKEN
 *
 * @class tokenGenerator
 */
class tokenGenerator {
    /**
     * This function is used generate token while
     * Login and Registration
     *
     * @static
     * @param {string} email
     * @param {object} msg
     * @param {string} userId
     * @memberof tokenGenerator
     */
    static async getToken(email) {
        return await jwt.sign({ email: email }, secret);
    }
}

module.exports = tokenGenerator;
