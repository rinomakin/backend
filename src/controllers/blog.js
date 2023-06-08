const { validationResult } = require("express-validator");
const BlogPost = require("../models/blog");

exports.createBlogPost = (req, res, next) => {
  const errors = validationResult(res);
  if (!errors.isEmpty()) {
    const err = new Error("Input tidak Sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error("Image Harus Diupload");
    err.errorStatus = 422;
    throw err;
  }

  const title = req.body.title;
  const image = req.file.path;
  const body = req.body.body;

  const Posting = new BlogPost({
    title: title,
    image: image,
    body: body,
    author: { uid: 1, name: "Rino Makin" },
  });

  Posting.save().then((result) => {
    res.status(201).json({
      message: "tambah data sukses",
      data: result,
    });
  });
};

exports.getAllBlogPost = (req, res, next) => {
  BlogPost.find()
    .then((result) => {
      res.status(200).json({
        message: "Data Blog Post Berhasil di panggil",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getBlogPostById = (req, res, next) => {
  const postId = req.params.postId;
  BlogPost.findById(postId)
    .then((result) => {
      if (!result) {
        const error = new Error("Blog Post tidak di temukan");
        error.errorStatus = 404;
        throw error;
      }
      res.status(200).json({
        message: "Data Blog Post Berhasil Di Panggil",
        data: result,
      });
    })
    .catch((err) => {
      next();
    });
};

exports.updateBlogPost = (req, res, next) => {
  const errors = validationResult(res);
  if (!errors.isEmpty()) {
    const err = new Error("Input tidak Sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error("Image Harus Diupload");
    err.errorStatus = 422;
    throw err;
  }

  const title = req.body.title;
  const image = req.file.path;
  const body = req.body.body;
  const postId = req.params.postId;

  BlogPost.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("blog post tidak di temukan");
        err.errorStatus = 404;
        throw err;
      }
      post.title = title;
      post.body = body;
      post.image = image;

      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Update Data Berhasil",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

// exports.deleteBlogPost = (req, res, next) => {

// }
