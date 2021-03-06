/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import { Router } from 'express';

import passport from './passport';
import login from './login';
import api from './api';
import ssr from './ssr';
import pwa from './pwa';

const router = new Router();

router.use(passport.initialize());
router.use(passport.session());

router.use(login);
router.use(api);
router.use(ssr);
router.use(pwa);

export default router;
