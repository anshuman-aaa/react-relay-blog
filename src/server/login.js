/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import Router from 'express';
import { toGlobalId } from 'graphql-relay';
import db from './db';
import passport from './passport';
const router = new Router();

function authenticate(provider) {
  return (req, res, next) => {
    function send(err, user) {
      const data = {
        type: 'LOGIN',
        error: err ? err.message : undefined,
        user: user
          ? {
              id: toGlobalId('User', user.id),
              username: user.username,
              email: user.email,
              emailVerified: user.email_verified,
              phone: user.phone,
              phoneVerified: user.phone_verified,
              displayName: user.display_name,
              photoURL: user.photo_url,
              isRegistered: user.is_registered,
              isAdmin: user.is_admin,
              isAdvisor: user.is_advisor,
            }
          : null,
      };

      res.send(`
<script>
  if (window.opener) {
    window.opener.postMessage(${JSON.stringify(data)}, '${process.env.APP_ORIGIN}');
    window.opener.focus();
    window.close();
  } else {
    window.opener.postMessage(${JSON.stringify(data.error)}, '${process.env.APP_ORIGIN}')
    window.opener.focus();
    window.close();
    // window.location.href = '${data.error ? `/login?error=${encodeURIComponent(data.error)}` : '/'}';
  }
</script>`); // prettier-ignore
    }

    passport.authenticate(provider, (err, user) => {
      if (err) {
        send(err);
      } else if (user) {
        req
          .logIn(user)
          .then(() => {
            send(null, user);
          })
          .catch(err => {
            send(err);
            console.log(err);
          });
      } else {
        send(null, null);
      }
    })(req, res, next);
  };
}

router.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/login/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email'],
  }),
);

router.get('/login/google/return', authenticate('google'));
router.get('/login/facebook/return', authenticate('facebook'));

router.post('/login/clear', (req, res) => {
  req.logOut();
  res.sendStatus(200);
});
router.post('/register', async (req, res) => {
  try {
    console.log(req.body);
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
