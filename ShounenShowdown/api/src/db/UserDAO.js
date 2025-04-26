/** 
 * Mock database requests for auth requests
 * @author: Heath Dyer 
 * 
 */

const db = require('./DBConnection');
const User = require('./models/User');
const crypto = require('crypto');

const DEFAULT_COLLECTION = [14, 15, 18, 20, 27, 28, 29, 30, 31, 32];
const DEFAULT_DECK = [14, 18];

const generateSalt = () => {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Retrieves user from database by username
 * @param username Username to search for
 */
const getUserByUsername = (username) => {
    return db.query('SELECT * FROM user WHERE usr_username=?', [username]).then(rows => {
        if (rows.length === 1) { // we found our user
            const user = new User(rows[0]);
            return user;
        }
        // if no user with provided username
        throw new Error(`No user with username '${username}'`);
    });
}

/**
 * Retrieves user from database by id
 * @param username Username to search for
 * 
 * @author: Kanak Joshi 
 */
const getUserByID = (id) => {
    return db.query('SELECT * FROM user WHERE usr_id=?', [id]).then(rows => {
        if (rows.length === 1) { // we found our user
            const user = new User(rows[0]);
            return user;
        }
        // if no user with provided username
        throw new Error(`No user with id '${id}'`);
    });
}

/**
 * Gets user by their username and password
 * @param {*} username 
 * @param {*} password 
 * @returns promise
 */
const getUserByCredentials = (username, password) => {
    return db.query('SELECT * FROM user WHERE usr_username=?', [username]).then(rows => {
        if (rows.length === 1) { // we found our user
            const user = new User(rows[0]);
            return user.validatePassword(password);
        }
        // if no user with provided username
        throw new Error("No such user");
    });
}

/**
 * Updates username of user with userid in database
 * @param {Integer} userId user to update
 * @param {String} username username to assign to
 */
const updateUserUsername = (userId, currentPassword, username, conn = null) => {
    return db.query('SELECT * FROM user WHERE usr_username=?', [username], conn).then(rows => {
        if (rows.length === 1) { // username already in use
            throw new Error(`Username ${username} already in use.`);
        }
        return db.query('SELECT * FROM user WHERE usr_id=?', [userId], conn);
    })
    .then(rows => {
        if (rows.length === 1) { // we found our user
            const user = new User(rows[0]);
            return user.validatePassword(currentPassword);
        }
        // if no user with provided username
        throw new Error(`No user with id '${userId}'`);
    })
    .then((user) => {
        return db.query(
            'UPDATE `user` SET `usr_username`=? WHERE `usr_id`=?',
            [username, userId], conn
        );
    })
    .then(() => {
        return { message: "Username updated successfully." };
    })
    .catch(err => {
        throw new Error(err.message);
    });
};

/**
 * Updates password of user with userid in database
 * @param {Integer} userId user to update
 * @param {String} password password to assign to
 */
const updateUserPassword = (userId, currentPassword, newPassword, confirmPassword, conn = null) => {
    return db.query('SELECT * FROM user WHERE usr_id=?', [userId], conn)
        //check if the user exists
        .then(rows => {
            if (rows.length !== 1) {
                throw new Error(`No user with id '${userId}'`);
            }
            const user = new User(rows[0]);
            return user.validatePassword(currentPassword);
        })
        .then((user) => {
            if (newPassword == confirmPassword) {
                return user.hashPassword(newPassword);
            } else {
                throw new Error("Passwords do not match.");
            }
        })
        .then(hashedPassword => {
            return db.query(
                'UPDATE `user` SET `usr_password`=? WHERE `usr_id`=?',
                [hashedPassword, userId], conn
            );
        })
        .then(() => {
            return { message: "Password updated successfully." };
        })
        .catch(err => {
            throw new Error(err.message);
        });
};


/**
 * Updates email of user with userid in database
 * @param {Integer} userId user to update
 * @param {String} email email to assign to
 */
const updateUserEmail = (userId, currentPassword, email, conn = null) => {
    return db.query('SELECT * FROM user WHERE usr_email=?', [email], conn).then(rows => {
        if (rows.length === 1) { // email already in use
            throw new Error(`Email ${email} already in use.`);
        }
        return db.query('SELECT * FROM user WHERE usr_id=?', [userId], conn);
    })
    .then(rows => {
        if (rows.length === 1) { // we found our user
            const user = new User(rows[0]);
            return user.validatePassword(currentPassword);
        }
        // if no user with provided username
        throw new Error(`No user with id '${userId}'`);
    })
    .then((user) => {
        return db.query(
            'UPDATE `user` SET `usr_email`=? WHERE `usr_id`=?',
            [email, userId], conn
        );
    })
    .then(() => {
        return { message: "Email updated successfully." };
    })
    .catch(err => {
        throw new Error(err.message);
    });
};

/**
 * Updates the users avatar field which is the path to their avatar
 * @param {*} userId id of user to update
 * @param {*} imagePath path of avatar
 */
const updateUserAvatar = (userId, imagePath, conn = null) => {
    return db.query('SELECT * FROM user WHERE usr_id=?', [userId], conn)
        .then(rows => {
            if (rows.length === 1) {
                const user = new User(rows[0]);
                // Optional: Delete the old avatar file here if needed
                return db.query(
                    'UPDATE `user` SET `usr_avatar`=? WHERE `usr_id`=?',
                    [imagePath, userId], conn
                );
            }
            throw new Error(`No user with id '${userId}'`);
        })
        .then(() => {
            return { message: "Avatar updated successfully." };
        })
        .catch(err => {
            throw new Error(err.message);
        });
};

/**
 * Updates the users balance field 
 * @param {*} userId id of user to update
 * @param {*} coins the coins earned from the battle
 */
const updateUserBalance = (userId, coins) => {
    return db.query('SELECT * FROM user WHERE usr_id=?', [userId])
        .then(rows => {
            if (rows.length === 1) {
                const currentBalance = rows[0].usr_balance;
                const newBalance = currentBalance + coins;

                return db.query(
                    'UPDATE `user` SET `usr_balance`=? WHERE `usr_id`=?',
                    [newBalance, userId]
                );
            }

            throw new Error(`No user with id '${userId}'`);
        })
        .then(() => {
            return { message: "Balance updated successfully." };
        })
        .catch(err => {
            throw new Error(err.message);
        });
};

/**
 * Updates the users balance field 
 * @param {*} userId id of user to update
 * @param {*} xp the xp gained from the battle
 */
const updateUserXP = (userId, xp) => {
    return db.query('SELECT * FROM user WHERE usr_id=?', [userId])
        .then(rows => {
            if (rows.length === 1) {
                const currentXp = rows[0].usr_xp;
                const newXp = currentXp + xp;

                return db.query(
                    'UPDATE `user` SET `usr_xp`=? WHERE `usr_id`=?',
                    [newXp, userId]
                );
            }

            throw new Error(`No user with id '${userId}'`);
        })
        .then(() => {
            return { message: "XP updated successfully." };
        })
        .catch(err => {
            throw new Error(err.message);
        });
};

/**
 * Updates the users wins field 
 * @param {*} userId id of user to update
 */
const updateUserWins = (userId) => {
    return db.query('SELECT * FROM user WHERE usr_id=?', [userId])
        .then(rows => {
            if (rows.length === 1) {
                const newWins = rows[0].usr_wins + 1;

                return db.query(
                    'UPDATE `user` SET `usr_wins`=? WHERE `usr_id`=?',
                    [newWins, userId]
                );
            }

            throw new Error(`No user with id '${userId}'`);
        })
        .then(() => {
            return { message: "Wins updated successfully." };
        })
        .catch(err => {
            throw new Error(err.message);
        });
};

/**
 * Updates the users losses field 
 * @param {*} userId id of user to update
 */
const updateUserLosses = (userId) => {
    return db.query('SELECT * FROM user WHERE usr_id=?', [userId])
        .then(rows => {
            if (rows.length === 1) {
                const newLosses = rows[0].usr_losses + 1;

                return db.query(
                    'UPDATE `user` SET `usr_losses`=? WHERE `usr_id`=?',
                    [newLosses, userId]
                );
            }

            throw new Error(`No user with id '${userId}'`);
        })
        .then(() => {
            return { message: "Losses updated successfully." };
        })
        .catch(err => {
            throw new Error(err.message);
        });
};




/**
 * Hash password as promise
 * @param {*} password 
 * @param {*} salt 
 * @returns 
 */
const hashPassword = (password, salt) => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if (err) {
                reject(new Error("Error hashing password: " + err));
            } else {
                resolve(derivedKey.toString('hex'));
            }
        });
    });
};

/**
 * Retrieves user from database by username
 * @param data Data to search for
 */
const createUser = async (data) => {
    const conn = await db.getDatabaseConnection().getConnection();
    let salt = generateSalt();

    try {
        await conn.beginTransaction();

        const existingUsers = await conn.query(
            'SELECT * FROM user WHERE usr_username=? OR usr_email=?',
            [data.username, data.email]
        );

        if (existingUsers.length > 0) {
            let errorMessage = null;
            if (existingUsers.some(row => row.usr_username === data.username)) {
                errorMessage = `User with username '${data.username}' already exists. `;
            } else if (existingUsers.some(row => row.usr_email === data.email)) {
                errorMessage = `User with email '${data.email}' already exists.`;
            }
            throw new Error(errorMessage);
        }

        const hashedPassword = await hashPassword(data.password, salt);

        const insertUserResult = await conn.query(
            'INSERT INTO `user` (`usr_username`, `usr_email`, `usr_password`, `usr_salt`) VALUES (?, ?, ?, ?)',
            [data.username, data.email, hashedPassword, salt]
        );

        const userId = insertUserResult.insertId;

        // Build placeholders and flat array of values for bulk insert
        const cardValues = DEFAULT_COLLECTION.map(cardId => [
            userId,
            cardId,
            DEFAULT_DECK.includes(cardId) ? 1 : 0
        ]);

        const placeholders = cardValues.map(() => '(?, ?, ?)').join(', ');
        const flatValues = cardValues.flat();

        const insertCardsQuery = `
            INSERT INTO \`user_card\` (\`ucd_usr_id\`, \`ucd_crd_id\`, \`ucd_deck\`)
            VALUES ${placeholders}
        `;

        await conn.query(insertCardsQuery, flatValues);

        await conn.commit();

        return { message: "User created successfully" };

    } catch (err) {
        await conn.rollback();
        throw new Error(err.message);
    } finally {
        conn.release();
    }
};

/** Export DAO functions */
module.exports = {
    getUserByUsername,
    getUserByID,
    getUserByCredentials,
    updateUserUsername,
    updateUserPassword,
    updateUserEmail,
    updateUserAvatar,
    createUser,
    updateUserBalance,
    updateUserWins,
    updateUserLosses,
    updateUserXP
};