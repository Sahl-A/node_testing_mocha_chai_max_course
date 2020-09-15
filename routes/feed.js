const express = require("express");

const feedController = require("../controllers/feed");

// To validate the routes
const { body } = require("express-validator");
// To authenticate routes
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

// GET /feed/posts
router.get("/posts", isAuth, feedController.getPosts);
// POST /feed/posts
router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);
// GET /feed/posts/t345zj#342
router.get("/post/:postId", isAuth, feedController.getOnePost);
// PUT /feed/posts/34fgD#@%sg
router.put(
  "/post/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);
// DELETE /feed/posts/483HF#$fd
router.delete("/post/:postId", isAuth, feedController.deletePost);
module.exports = router;
