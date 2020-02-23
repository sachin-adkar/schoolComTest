const crypto = require('crypto');
const randomString = require('randomstring');

/**
 *
 * This class is used to encrypt the password
 * and to validate the password
 * @class passwordEncryption
 */
class passwordEncryption {
    /**
     *
     * This function is used to hash the password
     * when user is created
     * @static
     * @param {String} password
     * @returns {String} returns password with salt and hashed
     * @memberof passwordEncryption
     */
    static async createHash(password, salt = null) {
        try {
            if (!salt) {
                salt = await this.generateSalt(9);
            }
            const hash = await this.md5Encoding(password + salt);
            return salt + hash;
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * This function is used to validate the hashed password
     * during login and while resetting the password
     * @static
     * @param {String} hash
     * @param {String} password
     * @returns {Boolean} returns true or false password matches the hash
     * @memberof passwordEncryption
     */
    static async validateHash(hash, password) {
        try {
            hash = hash.password;
            const salt = hash.substring(0, 9);
            const hashedPassword = await this.createHash(password, salt);
            if (hashedPassword.toString().trim() == hash.toString().trim()) return true;
            return false;
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * This function is used to generate the salt to hash the password
     * @static
     * @param {String} saltLength
     * @returns {String} returns the random string from set
     * @memberof passwordEncryption
     */
    static async generateSalt(saltLength) {
        try {
            return await randomString.generate(saltLength);
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * this function is used to encrypt the password to md5
     * @static
     * @param {String} string
     * @returns {String} return encrypted password
     * @memberof passwordEncryption
     */
    static async md5Encoding(string) {
        try {
            return await crypto
                .createHash('md5')
                .update(string)
                .digest('hex');
        } catch (error) {
            throw error;
        }
    }
}

module.exports = passwordEncryption;
