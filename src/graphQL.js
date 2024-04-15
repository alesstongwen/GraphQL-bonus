"use strict";

import { randomUUID } from "crypto";

export const schema = `
  type Post {
    id: ID!
    title: String!
    content: String!
    tag: Tag!
  }

  type Tag {
    id: ID!
    name: String!
  }

  input PostCreate {
    title: String!
    content: String!
    tagId: ID!
  }

  input PostUpdate {
    id: ID!
    title: String
    content: String
  }

  type Query {
    getPosts: [Post!]!
    getPost(id: ID!): Post
    getTags: [Tag!]!  
    getPostsByTag(tagId: ID!): [Post!]!  
  }

  type Mutation {
    createPost(newPost: PostCreate!): Post!
    deletePost(id: ID!): [Post!]!
    updatePost(updatedPost: PostUpdate!): Post!
    createTag(name: String!): Tag!
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
    getTags: (_parent, args, { app }) => {
      return app.db.tags;
    },
    getPostsByTag: (_parent, { tagId }, { app }) => {
      return app.db.posts.filter((post) => post.tagId === tagId);
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
      const { id, title, content, tagId } = updatedPost;
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
      if (tagId !== undefined && app.db.tags.find((tag) => tag.id === tagId)) {
        post.tagId = tagId;
      }
      return post;
    },
    createTag: (_parent, { name }, { app }) => {
      const tag = {
        id: randomUUID(),
        name,
      };
      app.db.tags.push(tag);
      return tag;
    },
  },
};

export const loaders = {};
