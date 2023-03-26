const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/userauth');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const { json } = require('express');

// @ route      POST api/posts
// @ desc       Create a post
// @ access     Private
router.post(
    '/',
    [auth, [check('text', 'Text is required').not().isEmpty()]],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
                visibility: req.body.visibility
            });

            await newPost.save();

            res.json(newPost);
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error');
        }
    }
);

// @ route      GET api/posts
// @ desc       Get all posts
// @ access     Private
router.get('/', auth, async function (req, res) {
    try {
        const posts = await Post.find({ visibility: false }).sort({ date: -1 });
        res.json(posts);
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
});

// @ route      GET api/posts/my
// @ desc       Get all posts of user
// @ access     Private
router.get('/my', auth, async function (req, res) {
    try {
        const posts = await Post.find({ user: req.user.id }).sort({ date: -1 });
        res.json(posts);
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
});

// @ route      GET api/posts/userposts/:id
// @ desc       Get all posts of user
// @ access     Private
router.get('/userposts/:id', auth, async function (req, res) {
    try {
        const posts = await Post.find({ user: req.params.id, visibility: false }).sort({ date: -1 });
        res.json(posts);
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
});

// @ route      GET api/posts/:id
// @ desc       Get post by id
// @ access     Private
router.get('/:id', auth, async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (e) {
        console.error(e.message);
        if (e.kind == 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @ route      DELETE api/posts/:id
// @ desc       Delete a post
// @ access     Private
router.delete('/:id', auth, async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({ msg: 'Post not found' });
        }

        // Check user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        await post.remove();

        res.json({ msg: 'Post removed' });
    } catch (e) {
        console.error(e.message);
        if (e.kind == 'ObjectId') {
            res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @ route      PUT api/posts/public/:id
// @ desc       Public a post
// @ access     Private
router.put('/public/:id', auth, async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({ msg: 'Post not found' });
        }

        if (
            post.visibility === false
        ) {
            return res.status(400).json({ msg: 'Post already Public' });
        }

        post.visibility = false;
        await post.save();
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (e) {
        console.error(e.message);
        if (e.kind == 'ObjectId') {
            res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @ route      PUT api/posts/like/:id
// @ desc       Like a post
// @ access     Private
router.put('/like/:id', auth, async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({ msg: 'Post not found' });
        }

        if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length > 0
        ) {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);
    } catch (e) {
        console.error(e.message);
        if (e.kind == 'ObjectId') {
            res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @ route      PUT api/posts/unlike/:id
// @ desc       Like a post
// @ access     Private
router.put('/unlike/:id', auth, async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({ msg: 'Post not found' });
        }

        if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length === 0
        ) {
            return res.status(400).json({ msg: "Post hasn't been liked yet" });
        }

        const removeIndex = post.likes
            .map((like) => like.user.toString())
            .indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        await post.save();

        res.json(post.likes);
    } catch (e) {
        console.error(e.message);
        if (e.kind == 'ObjectId') {
            res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @ route      POST api/posts/comment/:id
// @ desc       Comment on a post
// @ access     Private
router.post(
    '/comment/:id',
    [auth, [check('text', 'Text is required').not().isEmpty()]],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            };

            post.comments.unshift(newComment);
            await post.save();

            res.json(post.comments);
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error');
        }
    }
);

// @ route      PUT api/posts/like/:id/:comment_id
// @ desc       Like a post
// @ access     Private
router.put('/like/:id/:comment_id', auth, async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({ msg: 'Post not found' });
        }
        const comment = post.comments.find(
            (comment) => comment.id === req.params.comment_id
        );

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        if (
            comment.likes.filter((like) => like.user.toString() === req.user.id)
                .length > 0
        ) {
            return res.status(400).json({ msg: 'comment already liked' });
        }

        comment.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(comment.likes);
    } catch (e) {
        console.error(e.message);
        if (e.kind == 'ObjectId') {
            res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @ route      PUT api/posts/unlike/:id/:comment_id
// @ desc       Like a post
// @ access     Private
router.put('/unlike/:id/:comment_id', auth, async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({ msg: 'Post not found' });
        }

        const comment = post.comments.find(
            (comment) => comment.id === req.params.comment_id
        );

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }
        if (
            comment.likes.filter((like) => like.user.toString() === req.user.id)
                .length === 0
        ) {
            return res.status(400).json({ msg: "Comment hasn't been liked yet" });
        }

        const removeIndex = comment.likes
            .map((like) => like.user.toString())
            .indexOf(req.user.id);
        comment.likes.splice(removeIndex, 1);
        await post.save();

        res.json(comment.likes);
    } catch (e) {
        console.error(e.message);
        if (e.kind == 'ObjectId') {
            res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @ route      DELETE api/posts/comment/:id/:comment_id
// @ desc       Delete a comment
// @ access     Private
router.delete('/comment/:id/:comment_id', auth, async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);
        const comment = post.comments.find(
            (comment) => comment.id === req.params.comment_id
        );

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        if (comment.user.toString() !== req.user.id) {
            return res
                .status(401)
                .json({ msg: 'You are not authorized to delete' });
        }

        const removeIndex = post.comments
            .map((comment) => comment.user.toString())
            .indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);
        await post.save();

        res.json(post.comments);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
