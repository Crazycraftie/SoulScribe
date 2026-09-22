import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email?.toLowerCase() });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.json({ success: false, message: "Invalid Credentials" });
      }
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  }

  export const registerAdmin = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing required fields" });
      }

      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.json({ success: false, message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email: email.toLowerCase(), password: hashedPassword });
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  }

  export const getAllBlogsAdmin = async (req, res) => {
    try {
      const blogs = await Blog.find({author:req.userId}).sort({createdAt:-1});
      res.json({ success: true, blogs });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  }

  export const getAllComments = async (req, res) => {
    try {
      const ownBlogIds = await Blog.find({author:req.userId}).distinct('_id');
      const comments = await Comment.find({blog:{$in:ownBlogIds}}).populate("blog").sort({createdAt:-1});
      res.json({ success: true, comments });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  }

  export const getDashboard = async (req, res) => {
    try {
      const recentBlogs = await Blog.find({author:req.userId}).sort({createdAt:-1}).limit(5);
      const ownBlogIds = await Blog.find({author:req.userId}).distinct('_id');
      const blogs = ownBlogIds.length;
      const comments = await Comment.countDocuments({blog:{$in:ownBlogIds}});
      const drafts = await Blog.countDocuments({author:req.userId,isPublished:false});

      const dashboardData={
        blogs,comments,drafts,recentBlogs
      }
      res.json({success:true,dashboardData})
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  }

  export const deleteCommentById = async (req, res) => {
    try {
      const {id} = req.body;
      const comment = await Comment.findById(id).populate("blog");
      if (!comment || String(comment.blog.author) !== String(req.userId)) {
        return res.json({ success: false, message: "Not authorized to delete this comment" });
      }
      await Comment.findByIdAndDelete(id)
      res.json({ success: true, message:"Comment deleted successfully" });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  }

  export const approveCommentById = async (req, res) => {
    try {
      const {id} = req.body;
      const comment = await Comment.findById(id).populate("blog");
      if (!comment || String(comment.blog.author) !== String(req.userId)) {
        return res.json({ success: false, message: "Not authorized to approve this comment" });
      }
      await Comment.findByIdAndUpdate(id,{isApproved:true});
      res.json({ success: true, message:"Comment approved successfully" });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  }


  