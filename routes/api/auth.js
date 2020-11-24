const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');

//@route    GET api/auth
//@desc     Test route
//@access   Public
router.get('/', auth, async (req, res) => {
    try {
        //res.send('Auth Route');
        const user = await User.findById(req.user.id).select('-password');// ".select('-password')" this selects everything except password
        res.send(user);
        
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
});

//@route    POST api/auth
//@desc     Authenticate User
//@access   Public
router.post('/', [
    check('email', 'please enter a valid emial').isEmail(),
    check('password', 'password neeed').exists()
], async (req, res) => {
        var error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() }); 
        }

        const { email, password } = req.body;
        try {

            //check if the user exists
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: [{ msg: 'invalid credentials' }] });
            }

            //check if the password matches
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ error: [{ msg: 'invalid credentials' }] });
            }            
         
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