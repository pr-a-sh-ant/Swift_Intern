import postModel from "../model/post.model.mjs";

const createPost = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id; // Assuming user ID is stored in req.user after authentication

  try {
    const postDetail = {
      title,
      content,
      authorId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const post = await postModel.createPost(postDetail);

    res.status(201).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const posts = await postModel.getAllPosts(page, limit);
    if (!posts || posts.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No posts found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        posts,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getPostById = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await postModel.getPostById(postId);
    if (!post) {
      return res.status(404).json({
        status: "fail",
        message: "Post not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  try {
    const updatedPost = await postModel.updatePost(userId, req.body, postId);
    if (!updatedPost) {
      return res.status(404).json({
        status: "fail",
        message: "Post not found or update failed",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        post: updatedPost,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  try {
    const deletedPost = await postModel.deletePost(userId, postId);
    if (!deletedPost) {
      return res.status(404).json({
        status: "fail",
        message: "Post not found or deletion failed",
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const postController = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};

export default postController;
