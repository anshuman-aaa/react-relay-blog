/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

/* eslint-disable global-require */

import { nodeDefinitions, fromGlobalId } from 'graphql-relay';
import { assignType, getType } from './utils';

export const { nodeInterface, nodeField, nodesField } = nodeDefinitions(
  (globalId, context) => {
    const { type, id } = fromGlobalId(globalId);

    switch (type) {
      case 'User':
        return context.userById.load(id).then(assignType('User'));
      case 'Blog':
        return context.blogById.load(id).then(assignType('Blog'));
      case 'Category':
        return context.categoryById.load(id).then(assignType('Category'));
      default:
        return null;
    }
  },
  obj => {
    switch (getType(obj)) {
      case 'User':
        return require('./types').UserType;
      case 'Blog':
        return require('./types').StoryType;
      case 'Comment':
        return require('./types').CommentType;
      default:
        return null;
    }
  },
);
