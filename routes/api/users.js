const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const config = require('config');

//@route    POST api/users
//@desc     Register User
//@access   Public
router.post('/', [
    check('name', 'Nmae is required').not().isEmpty(),
    check('email', 'please enter a valid emial').isEmail(),
    check('password', 'password should be greater than 6 letters').isLength({min: 6})
], async (req, res) => {
        var error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() }); 
        }

        const { name, email, password } = req.body;
        try {

            //check if the user already exist
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ error: [{ msg: 'User Already exist' }] });
            }

            //Get users Gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            user = new User({
                name,
                email,
                avatar,
                password
            });

            //encrypt the password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();//save the user instance to the database

            //return JsonWebToken
            

            const payLoad = {
                user: {
                    id: user.id //this ID is fetched from the database as we already have an object "user" already defined above.
                }
            }

            jwt.sign(
                payLoad,
                config.get('jwtSecret'),
                {
                    expiresIn: 360000
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            )
            //res.send('User Registered');

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
    console.log(req.body);
});

module.exports = router;