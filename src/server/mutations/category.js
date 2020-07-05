/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import uuid from 'uuid';
import slugify from 'slugify';
import validator from 'validator';
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

export const upsertblog = mutationWithClientMutationId({
  name: 'Upsertblog',
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

      // Only the author of the blog or admins can edit it
      ctx.ensureIsAuthorized(
        user => blog.author_id === user.id || user.isAdmin,
      );
    } else {
      ctx.ensureIsAuthorized();
    }

    // Validate and sanitize user input
    const data = await ctx.validate(
      input,
      id ? 'update' : 'create',
    )(x =>
      x
        .field('title', { trim: true })
        .isRequired()
        .isLength({ min: 5, max: 80 })

        .field('text', { alias: 'URL or text', trim: true })
        .isRequired()
        .isLength({ min: 10, max: 1000 })

        .field('text', {
          trim: true,
          as: 'is_url',
          transform: x => validator.isURL(x, { protocols: ['http', 'https'] }),
        })

        .field('approved')
        .is(() => ctx.user.isAdmin, 'Only admins can approve a blog.'),
    );

    if (data.title) {
      data.slug = `${slug(data.title)}-${(id || newId).substr(29)}`;
    }

    if (id && Object.keys(data).length) {
      [blog] = await db
        .table('stories')
        .where({ id })
        .update({ ...data, updated_at: db.fn.now() })
        .returning('*');
    } else {
      [blog] = await db
        .table('stories')
        .insert({
          id: newId,
          ...data,
          author_id: ctx.user.id,
          approved: ctx.user.isAdmin ? true : false,
        })
        .returning('*');
    }

    return { blog };
  },
});

export const likeblog = mutationWithClientMutationId({
  name: 'Likeblog',
  description: 'Marks the blog as "liked".',

  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },

  outputFields: {
    blog: { type: BlogType },
  },

  async mutateAndGetPayload(input, ctx) {
    // Check permissions
    ctx.ensureIsAuthorized();

    const id = fromGlobalId(input.id, 'blog');
    const keys = { blog_id: id, user_id: ctx.user.id };

    const points = await db
      .table('blog_points')
      .where(keys)
      .select(1);

    if (points.length) {
      await db
        .table('blog_points')
        .where(keys)
        .del();
    } else {
      await db.table('blog_points').insert(keys);
    }

    const blog = db
      .table('stories')
      .where({ id })
      .first();

    return { blog };
  },
});
