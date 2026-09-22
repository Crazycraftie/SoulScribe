import imagekit from "../configs/imagekit.js";
import fs from 'fs';
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import main from "../configs/gemini.js";

export const addBlog = async(req,res)=>{
    try{
        const {title,subTitle,description,category,isPublished,visibility}=JSON.parse(req.body.blog);
        const imageFile=req.file;




        if(!title || !description || !category || !imageFile){
            return res.json({success:false, message:"Missing required fields"})
        }

        const author=await User.findById(req.userId)
        if(!author){
            return res.json({success:false, message:"Author not found"})
        }

        //Upload image on imagekit
        const fileBuffer=fs.readFileSync(imageFile.path)
        const response= await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder:"/blogs"
        })

        //Optimize image
        const optimizedImageUrl=imagekit.url({
            path:response.filePath,
            transformation: [
                {quality:'auto'}, //auto compression
                {format:'webp'}, //modern format
                {width:'1280'} //width resizing
            ]
        })

        const image=optimizedImageUrl;
        await Blog.create({
            title,subTitle,description,category,image,isPublished,
            author:author._id,
            authorName:author.name,
            visibility: visibility==='private' ? 'private' : 'public',
        })



        res.json({success:true,message:"Blog added successfully"})

    }catch(error){
        res.json({success:false,message:error.message})

    }
}


export const getAllBlogs= async(req,res)=>{
    try{
        const blogs= await Blog.find({
            isPublished:true,
            $or:[
                {visibility:'public'},
                ...(req.userId ? [{visibility:'private',author:req.userId}] : []),
            ],
        }).sort({createdAt:-1})
        res.json({success:true,blogs})
    }catch(error){
        res.json({success:false,message:error.message})
    }

}

export const getBlogById= async(req,res)=>{
    try{
        const {id}= req.params;
        const blog= await Blog.findById(id)

        if(!blog){
            return res.json({success:false,message:"Blog not found"});
        }

        if(blog.visibility==='private' && String(blog.author)!==String(req.userId)){
            return res.json({success:false,message:"Blog not found"});
        }

        res.json({success:true,blog})
    }catch(error){
        res.json({success:false,message:error.message})
    }

}

export const deleteBlogById= async(req,res)=>{
    try{
        const {id}= req.body;
        const blog=await Blog.findById(id)
        if(!blog){
            return res.json({success:false,message:"Blog not found"});
        }
        if(String(blog.author)!==String(req.userId)){
            return res.json({success:false,message:"Not authorized to delete this blog"});
        }

       await Blog.findByIdAndDelete(id)

       //delete all comments with the blog
       await Comment.deleteMany({blog:id});

        res.json({success:true, message:"blog deleted"})
    }catch(error){
        res.json({success:false,message:error.message})
    }

}

export const togglePublish= async(req,res)=>{
    try{
        const {id}= req.body;
       const blog=await Blog.findById(id)
       if(!blog){
           return res.json({success:false,message:"Blog not found"});
       }
       if(String(blog.author)!==String(req.userId)){
           return res.json({success:false,message:"Not authorized to update this blog"});
       }
       blog.isPublished=!blog.isPublished;
       await blog.save();


        res.json({success:true, message:"blog status updated"})
    }catch(error){
        res.json({success:false,message:error.message})
    }

}

export const toggleVisibility= async(req,res)=>{
    try{
        const {id}= req.body;
       const blog=await Blog.findById(id)
       if(!blog){
           return res.json({success:false,message:"Blog not found"});
       }
       if(String(blog.author)!==String(req.userId)){
           return res.json({success:false,message:"Not authorized to update this blog"});
       }
       blog.visibility = blog.visibility==='public' ? 'private' : 'public';
       await blog.save();

        res.json({success:true, message:"blog visibility updated"})
    }catch(error){
        res.json({success:false,message:error.message})
    }

}

export const addComment= async(req,res)=>{
    try{
        const {blog,name,content}= req.body;
       
      
       await Comment.create({blog,name,content});
      
       res.json({success:true, message:"comment added for review"})
    }catch(error){
        res.json({success:false,message:error.message})
    }

}

export const getBlogComments= async(req,res)=>{
    try{
        const {blogid}= req.body;
       
      
       const comments=await Comment.find({blog:blogid,isApproved:true}).sort({createdAt:-1});
      
       res.json({success:true, comments})
    }catch(error){
        res.json({success:false,message:error.message})
    }

}

export const generateContent = async (req, res) => {
    try {
      const { prompt } = req.body;
  
      const content = await main(
        prompt + ' — generate a full blog article about this topic'
      );
  
      res.json({ success: true, content });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };
  



