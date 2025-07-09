import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Moment from "moment";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Blog = () => {
  const { id } = useParams();
  const { axios } = useAppContext();

  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      data.success ? setData(data.blog) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.post("/api/blog/comments", { blogid: id });
      data.success ? setComments(data.comments) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/blog/add-comment", {
        blog: id,
        name,
        content,
      });
      if (data.success) {
        toast.success(data.message);
        setName("");
        setContent("");
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, []);

  return data ? (
    <div className="relative">
      {/* Background */}
      <img
        src={assets.gradientBackground}
        alt="SoulScribe Gradient"
        className="absolute -top-50 -z-10 opacity-50"
      />

      <Navbar />

      {/* Blog Header */}
      <div className="text-center mt-20 text-gray-700">
        <p className="text-primary py-4 font-medium">
          Published on {Moment(data.createdAt).format("MMMM Do YYYY")}
        </p>
        <h1 className="text-2xl sm:text-5xl font-bold max-w-2xl mx-auto text-gray-900">
          {data.title}
        </h1>
        <h2 className="my-4 max-w-lg truncate mx-auto italic text-gray-500">
          {data.subTitle}
        </h2>
        <p
          className="inline-block py-1 px-4 rounded-full mb-6 border text-sm
          border-primary/35 bg-primary/5 font-medium text-primary"
        >
          Author
        </p>
      </div>

      {/* Blog Content */}
      <div className="mx-5 max-w-5xl md:mx-auto mt-8 mb-14">
        <img
          src={data.image}
          alt="Blog thumbnail"
          className="rounded-3xl mb-6"
        />
        <div
          className="rich-text max-w-3xl mx-auto"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>
      </div>

      {/* Comments Section */}
      <div className="max-w-3xl mx-auto mb-16">
        <p className="font-semibold text-gray-800 mb-4">
          Reader Comments ({comments.length})
        </p>
        <div className="flex flex-col gap-4">
          {comments.map((item, index) => (
            <div
              key={index}
              className="relative bg-primary/5 border border-primary/10 max-w-xl p-4 rounded text-gray-700"
            >
              <div className="flex items-center gap-2 mb-2">
                <img src={assets.user_icon} alt="User" className="w-6" />
                <p className="font-medium">{item.name}</p>
              </div>
              <p className="text-sm ml-8">{item.content}</p>
              <div className="absolute right-4 bottom-3 text-xs text-gray-500">
                {Moment(item.createdAt).fromNow()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Form */}
      <div className="max-w-3xl mx-auto mb-24">
        <p className="font-semibold mb-4 text-gray-800">Leave a comment</p>
        <form
          onSubmit={addComment}
          className="flex flex-col items-start gap-4 max-w-lg"
        >
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            required
            className="w-full p-2 border border-gray-300 rounded outline-none"
          />
          <textarea
            onChange={(e) => setContent(e.target.value)}
            value={content}
            placeholder="Share your thoughts..."
            className="w-full p-2 border border-gray-300 rounded outline-none h-40"
            required
          />
          <button
            type="submit"
            className="bg-primary text-white rounded p-2 px-8 hover:scale-105 transition-all cursor-pointer"
          >
            Post Comment
          </button>
        </form>
      </div>

      {/* Share Options */}
      <div className="my-20 max-w-3xl mx-auto text-gray-700">
        <p className="font-semibold mb-4">Share this story</p>
        <div className="flex gap-4">
          <img src={assets.facebook_icon} width={50} alt="Share on Facebook" />
          <img src={assets.twitter_icon} width={50} alt="Share on Twitter" />
          <img
            src={assets.googleplus_icon}
            width={50}
            alt="Share on Google Plus"
          />
        </div>
      </div>

      <Footer />
    </div>
  ) : (
    <Loader />
  );
};

export default Blog;