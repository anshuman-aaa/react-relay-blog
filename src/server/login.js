/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import Router from 'express';
import db from './db';

const router = new Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const [userInfo] = await db
      .table('users')
      .returning('*')
      .insert({
        email,
        password,
        username,
      });
    res.json(userInfo);
  } catch (error) {
    console.log(error);
  }
});

export default router;
