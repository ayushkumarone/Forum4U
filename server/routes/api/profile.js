const express = require('express');
const router = express.Router();
const auth = require('../../middleware/userauth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @ route      GET api/profile/me
// @ desc       Get current users profile
// @ access     Private
router.get('/me', auth, async function (req, res) {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
            'name',
            'avatar',
        ]);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @ route      GET api/profile/online
// @ desc       Make online
// @ access     Private
router.post('/online', auth, async function (req, res) {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        profile.online.status = true;
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @ route      GET api/profile/offline
// @ desc       Make online
// @ access     Private
router.post('/offline', auth, async function (req, res) {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        let options = {  
            weekday: "long", year: "numeric", month: "short",  
            day: "numeric", hour: "2-digit", minute: "2-digit"  
        };
        profile.online.status = false;
        profile.online.lastvisited = (new Date()).toLocaleString('en-IN', options);
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @ route      POST api/profile
// @ desc       Create of update user profile
// @ access     Private
router.post(
    '/',
    [
        auth
    ],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            avatar,
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin,
        } = req.body;

        // Build profile object
        const profileFields = {};
        if (avatar) {
            await User.findOneAndUpdate({ _id: req.user.id }, {$set: {avatar: avatar}}, {new: true});
        }
        profileFields.user = req.user.id;
        if (company) {
            profileFields.company = company;
        }
        if (website) {
            profileFields.website = website;
        }
        if (location) {
            profileFields.location = location;
        }
        if (bio) {
            profileFields.bio = bio;
        }
        if (status) {
            profileFields.status = status;
        }
        if (githubusername) {
            profileFields.githubusername = githubusername;
        }
        if (skills) {
            profileFields.skills = skills.split(',');
        }

        profileFields.social = {};
        if (youtube) {
            profileFields.social.youtube = youtube;
        }
        if (facebook) {
            profileFields.social.facebook = facebook;
        }
        if (twitter) {
            profileFields.social.twitter = twitter;
        }
        if (instagram) {
            profileFields.social.instagram = instagram;
        }
        if (linkedin) {
            profileFields.social.linkedin = linkedin;
        }

        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            }

            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        } catch (e) {
            console.log(e.message);
            res.status(500).send('Server Error');
        }
    }
);

// @ route      GET api/profile
// @ desc       Get all profiles
// @ access     Public
router.get('/', async function (req, res) {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (e) {
        console.log(e.message);
        res.status(500).send('Server Error');
    }
});

// @ route      GET api/profile/user/:user_id
// @ desc       Get profile by user_id
// @ access     Public
router.get('/user/:user_id', async function (req, res) {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for the entered user' });
        }
        res.json(profile);
    } catch (e) {
        console.log(e.message);
        if (e.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'There is no profile for the entered user' });
        }
        res.status(500).send('Server Error');
    }
});

// @ route      DELETE api/profile
// @ desc       Delete profile, user & posts
// @ access     Private
router.delete('/', auth, async function (req, res) {
    try {
        // To remove the posts
        await Post.deleteMany({ user: req.user.id });
        // To remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // To remove user
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'user deleted' });
    } catch (e) {
        console.log(e.message);
        res.status(500).send('Server Error');
    }
});

// @ route      PUT api/profile/experience
// @ desc       Add profile experience
// @ access     Private
router.put(
    '/experience',
    [
        auth,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('company', 'Company is required').not().isEmpty(),
            check('from', 'From date is required').not().isEmpty(),
        ],
    ],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, company, location, from, to, current, description } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp);
            await profile.save();
            res.json(profile);
        } catch (e) {
            console.log(e.message);
            res.status(500).send('Server Error');
        }
    }
);

// @ route      DELETE api/profile/experience/:exp_id
// @ desc       Delete experience from profile
// @ access     Private
router.delete('/experience/:exp_id', auth, async function (req, res) {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        const removeIndex = profile.experience.map((item) => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (e) {
        console.log(e.message);
        res.status(500).send('Server Error');
    }
});

// @ route      PUT api/profile/education
// @ desc       Add profile education
// @ access     Private
router.put(
    '/education',
    [
        auth,
        [
            check('school', 'School is required').not().isEmpty(),
            check('degree', 'Degree is required').not().isEmpty(),
            check('fieldofstudy', 'Field of study date is required').not().isEmpty(),
            check('from', 'From date is required').not().isEmpty(),
        ],
    ],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { school, degree, fieldofstudy, from, to, current, description } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newEdu);
            await profile.save();
            res.json(profile);
        } catch (e) {
            console.log(e.message);
            res.status(500).send('Server Error');
        }
    }
);

// @ route      DELETE api/profile/education/:edu_id
// @ desc       Delete education from profile
// @ access     Private
router.delete('/education/:edu_id', auth, async function (req, res) {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        const removeIndex = profile.education.map((item) => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (e) {
        console.log(e.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
