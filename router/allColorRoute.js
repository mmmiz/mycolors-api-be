const express = require('express');
const AllColor = require('../models/AllColors.js');
const jwt = require('jsonwebtoken');
const { verifyToken, SECRET_KEY } = require('../middleware/middleware');

const router = express.Router();


// Register a new color 
router.post('/colors', verifyToken, async (req, res) => {
  const { mainColor, aboutUsColor, productsColor, newsColor, contactColor } = req.body;

  const token = req.header('Authorization').replace('Bearer ', '');
  const decodedToken = jwt.verify(token, SECRET_KEY);
  const userId = decodedToken.userId;

  try {
    const latestColor = await AllColor.findOne().sort({ orderNumber: -1 });
    let orderNumber = 1;

    if (latestColor){
      orderNumber = latestColor.orderNumber + 1;
    }
    const newColor = new AllColor({
      orderNumber,
      mainColor, // for pic
      aboutUsColor,
      productsColor,
      newsColor,
      contactColor,
      user: userId 
    });
    await newColor.save();
    res.status(201).json({ message: 'Color data saved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// get All colors
router.get('/getColors', async (req, res) => {
    try {
        const colors = await AllColor.find()
        res.json(colors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Detail color page
router.get('/getColors/:orderNumber', verifyToken, async (req, res) => {
  try {
    const orderNumber = req.params.orderNumber;
    const colorDetails = await AllColor.findOne({ orderNumber: orderNumber });
    if (!colorDetails) {
      return res.status(404).json({ error: 'Color not found' });
    } 
    res.json(colorDetails);
    } catch (error)  {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// color page for a specific user (MY COLORS PAGE)
router.get('/user/colors', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const colors = await AllColor.find({ user: userId });
    res.json(colors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// DELETE
router.delete('/user/colors/:orderNumber/delete', verifyToken, async (req, res) => {
  const { orderNumber } = req.params;
  const userId = req.user.userId; // Use userId directly
  // const userId = mongoose.Types.ObjectId(req.user.userId); caution: DIDNOT WORK

  try {
      const deletedColor = await AllColor.findOneAndDelete({ orderNumber, user: userId });
      if (!deletedColor) {
        return res.status(404).json({ error: 'Color not found' });
      }
  
      await AllColor.updateMany(
        { orderNumber: { $gt: deletedColor.orderNumber }, user: userId },
        { $inc: { orderNumber: -1 } }
      );
    res.json({ message: 'Color deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// for user's liked color page (LIKED PAGE)
router.get('/user/colors/likes', verifyToken, async (req, res) => {
  const userId = req.user.userId; // Retrieve user ID from the authentication middleware

  try {
    const likedColors = await AllColor.find({ likes: userId });

    res.json(likedColors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Like or Unlike a color
router.post('/allColors/:orderNumber/like', verifyToken, async (req, res) => {
  const { orderNumber } = req.params; // orderNumber pertains to a specific color
    try {
    const color = await AllColor.findOne({ orderNumber });
    if (!color) {
      return res.status(404).json({ error: 'Color not found' });
    }

    const likedIndex = color.likes.indexOf(req.user.userId); // user liked already?
    if (likedIndex === -1) {
      color.likes.push(req.user.userId);
    } else {
      color.likes.splice(likedIndex, 1);
    }
    await color.save();

    const isLiked = color.likes.includes(req.user.userId);
    res.json({ message: isLiked ? 'Color liked successfully' : 'Color unliked successfully', isLiked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
