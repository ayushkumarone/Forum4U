const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @ route      Post api/users
// @ desc       Register User
// @ access     Public
router.post(
    '/',
    [
        check('name', 'Name is not valid').not().isEmpty(),
        check('email', 'Enter a valid email').isEmail(),
        check('password', 'min length of 6 characters').isLength({
            min: 6,
        }),
    ],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            // Send if user exists
            const myerrors = [];
            myerrors.push({ msg: 'User already exists' });
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    errors: myerrors,
                });
            }

            // Get user's gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm',
            });

            user = new User({
                name,
                email,
                avatar,
                password,
            });

            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            // Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                function (err, token) {
                    if (err) throw err;
                    res.json({ token });
                }
            );

            // res.send('User Registered');
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
