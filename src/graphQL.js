"use strict";

import { randomUUID } from "crypto";

export const schema = `
  type Post {
    id: ID!
    title: String!
    content: String!
  }

  input PostCreate {
    title: String!
    content: String!
  }

  input PostUpdate {
    id: ID!
    title: String
    content: String
  }

  type Query {
    getPosts: [Post!]!
    getPost(id: ID!): Post
  }

  type Mutation {
    createPost(newPost: PostCreate!): Post!
    deletePost(id: ID!): [Post!]!
    updatePost(updatedPost: PostUpdate!): Post!
  }
`;

export const resolvers = {
  Query: {
    getPosts: (_parent, args, { app }) => {
      return app.db.posts;
    },
    getPost: (_parent, args, { app }) => {
      const { id } = args;
      return app.db.posts.find((post) => post.id === id);
    },
  },
  Mutation: {
    createPost: (_parent, { newPost }, { app }) => {
      const { title, content } = newPost;

      const post = {
        id: randomUUID(),
        title,
        content,
      };
      app.db.posts.push(post);
      return post;
    },
    deletePost: (_parent, { id }, { app }) => {
      const index = app.db.posts.findIndex((post) => post.id === id);
      if (index > -1) {
        app.db.posts.splice(index, 1);
      } else {
        throw new Error("Post not found");
      }
      return app.db.posts;
    },
    updatePost: (_parent, { updatedPost }, { app }) => {
      const { id, title, content } = updatedPost;
      const post = app.db.posts.find((post) => post.id === id);
      if (!post) {
        throw new Error("Post not found");
      }
      if (title !== undefined) {
        post.title = title;
      }
      if (content !== undefined) {
        post.content = content;
      }

      return post;
    },
  },
};

export const loaders = {};
