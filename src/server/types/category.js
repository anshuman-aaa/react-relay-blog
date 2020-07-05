/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import _ from 'lodash';
import { globalIdField } from 'graphql-relay';
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

import { nodeInterface } from '../node';
import { dateField } from '../utils';

export const CategoryType = new GraphQLObjectType({
  name: 'Category',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    categoryId: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    categoryName: {
      type: new GraphQLNonNull(GraphQLString),
    },

    categoryDesc: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        truncate: { type: GraphQLInt },
      },
      resolve(self, args) {
        return args.truncate
          ? _.truncate(self.categoryDesc, { length: args.truncate })
          : self.categoryDesc;
      },
    },

    categoryUri: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(self) {
        return self.categoryUri;
      },
    },
    createdAt: dateField(self => self.created_at),
    updatedAt: dateField(self => self.updated_at),
  },
});
