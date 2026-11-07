const express = require('express');
const mongoose = require('mongoose');

const Post = require('../models/Post');

const router = express.Router();

function isValidObjectId(id) {
  return /^[a-fA-F0-9]{24}$/.test(id) &&
    mongoose.Types.ObjectId.isValid(id);
}

function handleError(res, error) {
  if (
    error.name === 'ValidationError' ||
    error.name === 'CastError'
  ) {
    return res.status(400).json({
      error: error.message
    });
  }

  console.error(error);

  return res.status(500).json({
    error: 'An unexpected server error occurred.'
  });
}

// Create a post.
router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body || {};

    const post = new Post({
      title,
      content,
      author
    });

    await post.save();

    return res.status(201).json(post);
  } catch (error) {
    return handleError(res, error);
  }
});

// Fetch all posts.
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();

    return res.status(200).json(posts);
  } catch (error) {
    return handleError(res, error);
  }
});

// Fetch one post.
router.get('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({
      error: 'Invalid post id'
    });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    return res.status(200).json(post);
  } catch (error) {
    return handleError(res, error);
  }
});

// Update a post using all three required fields.
router.put('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({
      error: 'Invalid post id'
    });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    const { title, content, author } = req.body || {};

    post.title = title;
    post.content = content;
    post.author = author;

    await post.save();

    return res.status(200).json(post);
  } catch (error) {
    return handleError(res, error);
  }
});

// Delete a post.
router.delete('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({
      error: 'Invalid post id'
    });
  }

  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    return res.status(200).json({
      message: 'Post deleted successfully'
    });
  } catch (error) {
    return handleError(res, error);
  }
});

module.exports = router;