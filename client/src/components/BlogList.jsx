import React, { useState } from 'react';
import { blogCategories } from '../assets/assets';
import { motion } from 'motion/react';
import BlogCard from './BlogCard';
import { useAppContext } from '../context/AppContext';

const BlogList = () => {
  const [menu, setMenu] = useState('All');
  const { blogs = [], input = '' } = useAppContext();

  const filteredBlogs = () => {
    if (!input.trim()) return blogs;
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())
    );
  };

  const visibleBlogs = filteredBlogs().filter((blog) =>
    menu === 'All' ? true : blog.category.toLowerCase() === menu.toLowerCase()
  );

  return (
    <div>
      {/* Category Selector */}
      <div className="flex justify-center flex-wrap gap-4 sm:gap-8 my-10">
        {blogCategories.map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => setMenu(item)}
              className={`relative px-4 py-1 text-sm sm:text-base font-medium rounded-full transition-all duration-200
              ${
                menu === item
                  ? 'text-white bg-primary shadow-md'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              {item}
              {menu === item && (
                <motion.div
                  layoutId="underline"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute inset-0 -z-10 bg-primary rounded-full"
                />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Blog Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4
        gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40"
      >
        {visibleBlogs.length > 0 ? (
          visibleBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        ) : (
          <p className="text-center text-gray-400 col-span-full italic">
            No stories matched your soul-search yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogList;