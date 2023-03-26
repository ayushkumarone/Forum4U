const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/userauth');
const User = require('../../models/User');

// @ route      GET api/auth
// @ desc       Test route
// @ access     Public
router.get('/', auth, async function (req, res) {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @ route      Post api/auth
// @ desc       Authenticate user and get token
// @ access     Public
router.post(
    '/',
    [
        check('email', 'Enter a valid email').isEmail(),
        check('password', 'Password is required').exists().not().isEmpty(),
    ],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Send if user exists
            const myerrors = [];
            myerrors.push({ msg: 'Invalid credentials' });
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    errors: myerrors,
                });
            }

            // To find the password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    errors: myerrors,
                });
            }

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
