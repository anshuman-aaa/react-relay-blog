/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import db from '../db';
import { BlogType } from '../types';

export const story = {
  type: BlogType,

  args: {
    slug: { type: new GraphQLNonNull(GraphQLString) },
  },

  async resolve(root, { slug }, ctx) {
    let story = await db
      .table('blogs')
      .where({ slug })
      .first();

    // Attempts to find a story by partial ID contained in the slug.
    if (!story) {
      const match = slug.match(/[a-f0-9]{7}$/);
      if (match) {
        story = await db
          .table('stories')
          .whereRaw(`id::text LIKE '%${match[0]}'`)
          .first();
      }
    }

    return story;
  },
};

export const stories = {
  type: new GraphQLList(BlogType),

  resolve(self, args, ctx) {
    return db
      .table('blogs')
      .orderBy('created_at', 'desc')
      .limit(100)
      .select();
  },
};
