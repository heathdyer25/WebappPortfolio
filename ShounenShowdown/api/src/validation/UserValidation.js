/**
 * @author Heath Dyer (hadyer)
 * Validation functions for user data
 */


/**
 * Validates username. Returns true if valid, false if not.
 * @param {*} username Username to valdiate
 */
const validUsername = (username) => {
    let regex = new RegExp("^[a-zA-Z][a-zA-Z0-9_]*$");
    if (!username || username.length < 5 || username.length > 20 || !regex.test(username)) {
        return false;
    }
    return true;
}

/**
 * Validates email. Returns true if valid, false if not.
 * @param {*} email Username to valdiate
 */
const validEmail = (email) => {
    let regex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    console.log(regex.test(email));
    return (email && regex.test(email));
}

/**
 * Validates password. Returns true if valid, false if not.
 * @param {*} password Password to valdiate
 */
const validPassword = (password) => {
    let regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\(_\)=\+\-]).*$");
    if (!password || password.length < 8 || password.length > 20 || !regex.test(password)) {
        return false;
    }
    return true;
}

module.exports = {
    validUsername,
    validEmail,
    validPassword
}