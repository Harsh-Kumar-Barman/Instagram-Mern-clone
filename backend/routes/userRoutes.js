const express = require('express');
const { getUserAndPosts, getFollowing, following, updateProfile, addToReelHistory } = require('../controllers/userController');
const upload = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/:username',authMiddleware , getUserAndPosts);
router.post('/edit/:id',authMiddleware , upload.single('media'), updateProfile);
router.get('/:id/following',authMiddleware , getFollowing);
router.put('/:id/following',authMiddleware , following);
router.post('/reelHistory/:userId/:postId',authMiddleware , addToReelHistory);

module.exports = router;
