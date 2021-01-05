/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import { commitMutation, graphql } from 'react-relay';

function commit(environment, input, done) {
  return commitMutation(environment, {
    mutation: graphql`
      mutation UpsertBlogMutation($input: UpsertBlogInput!) {
        upsertBlog(input: $input) {
          blog {
            id
            categoryId
            blogTitle
            blogDesc
            blogLogo
            slug
            createdAt
          }
        }
      }
    `,

    variables: { input },

    onCompleted({ upsertBlog }, errors) {
      done(
        errors ? errors[0].state || { '': [errors[0].message] } : null,
        upsertBlog && upsertBlog.blog,
      );
    },
  });
}

export default { commit };
