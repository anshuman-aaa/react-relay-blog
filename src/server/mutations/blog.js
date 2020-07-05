/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import uuid from 'uuid';
import slugify from 'slugify';
// import validator from 'validator';
import { mutationWithClientMutationId } from 'graphql-relay';
import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

import db from '../db';
import { BlogType } from '../types';
import { fromGlobalId } from '../utils';

function slug(text) {
  return slugify(text, { lower: true });
}

export const upsertBlog = mutationWithClientMutationId({
  name: 'UpsertBlog',
  description: 'Creates or updates a blog.',

  inputFields: {
    id: { type: GraphQLID },
    categoryId: { type: GraphQLInt },
    blogTitle: { type: GraphQLString },
    blogDesc: { type: GraphQLString },
    blogLogo: { type: GraphQLString },
    approved: { type: GraphQLBoolean },
    validateOnly: { type: GraphQLBoolean },
  },

  outputFields: {
    blog: { type: BlogType },
  },

  async mutateAndGetPayload(input, ctx) {
    const id = input.id ? fromGlobalId(input.id, 'Blog') : null;
    const newId = uuid.v4();
    let blog;

    if (id) {
      blog = await db
        .table('blogs')
        .where({ id })
        .first();

      if (!blog) {
        throw new Error(`Cannot find the blog # ${id}.`);
      }

      // Only the author of the story or admins can edit it
      // ctx.ensureIsAuthorized(
      //   user => blog.author_id === user.id || user.isAdmin,
      // );
    }
    // else {
    //   ctx.ensureIsAuthorized();
    // }

    // Validate and sanitize user input
    const data = await ctx.validate(
      input,
      id ? 'update' : 'create',
    )(
      x =>
        x
          .field('categoryId')
          .field('blogTitle', { trim: true })
          .isRequired()
          .isLength({ min: 5, max: 80 })

          .field('blogLogo', { alias: 'URL or text', trim: true })
          .isRequired()
          .isLength({ min: 10, max: 1000 })
          .field('blogDesc', {
            trim: false,
          }),
      // .field('approved')
      // .is(() => ctx.user.isAdmin, 'Only admins can approve a story.'),
    );
    console.log('data', data, newId);
    if (data.blogTitle) {
      data.slug = `${slug(data.blogTitle)}-${(id || newId).substr(29)}`;
    }

    if (id && Object.keys(data).length) {
      [blog] = await db
        .table('blogs')
        .where({ id })
        .update({ ...data, updated_at: db.fn.now() })
        .returning('*');
    } else {
      [blog] = await db
        .table('blogs')
        .insert({
          id: newId,
          ...data,
          // author_id: ctx.user.id,
          approved: true,
        })
        .returning('*');
    }

    return { blog };
  },
});

export const likeStory = mutationWithClientMutationId({
  name: 'LikeStory',
  description: 'Marks the story as "liked".',

  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },

  outputFields: {
    story: { type: BlogType },
  },

  async mutateAndGetPayload(input, ctx) {
    // Check permissions
    // ctx.ensureIsAuthorized();

    const id = fromGlobalId(input.id, 'Story');
    const keys = { story_id: id, user_id: ctx.user.id };

    const points = await db
      .table('story_points')
      .where(keys)
      .select(1);

    if (points.length) {
      await db
        .table('story_points')
        .where(keys)
        .del();
    } else {
      await db.table('story_points').insert(keys);
    }

    const story = db
      .table('stories')
      .where({ id })
      .first();

    return { story };
  },
});
