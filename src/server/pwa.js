const express = require('express');
const router = new express.Router();

const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
router.get('/check', async (req, res) => {
  try {
    console.log('hit', req);
    res.json({ done: true });
  } catch (e) {
    res.status(400).send(e);
  }
});

//post request to add data
router.post('/save-post', async (req, res) => {
  console.log(req.body);
  const { id, title, location, image } = req.body;
  try {
    await admin
      .database()
      .ref('posts')
      .push({
        id,
        title,
        location,
        image,
      });
    // console.log(post);
    res.send({ done: true });
  } catch (err) {
    console.log(err);
  }
});

export default router;
