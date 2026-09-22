import express from 'express';
import { addBlog, addComment, deleteBlogById, generateContent, getAllBlogs, getBlogById, getBlogComments, togglePublish, toggleVisibility } from '../controllers/blogController.js';
import upload from '../middleware/multer.js';
import auth, { optionalAuth } from '../middleware/auth.js';


const blogRouter = express.Router();

blogRouter.post("/add",auth,upload.single('image'),addBlog)
blogRouter.get('/all',optionalAuth,getAllBlogs);
blogRouter.get('/:id',optionalAuth,getBlogById);
blogRouter.post('/delete',auth,deleteBlogById);
blogRouter.post('/toggle-publish',auth,togglePublish);
blogRouter.post('/toggle-visibility',auth,toggleVisibility);

blogRouter.post('/add-comment',addComment);
blogRouter.post('/comments',getBlogComments);
blogRouter.post('/generate',auth,generateContent);

export default blogRouter;