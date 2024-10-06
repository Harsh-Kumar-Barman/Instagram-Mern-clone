const express = require('express');
const { getUserAndPosts, getFollowing, following, updateProfile, addToReelHistory } = require('../controllers/userController');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.get('/:username', getUserAndPosts);
router.post('/edit/:id', upload.single('media'), updateProfile);
router.get('/:id/following', getFollowing);
router.put('/:id/following', following);
router.post('/reelHistory/:userId/:postId', addToReelHistory);

module.exports = router;