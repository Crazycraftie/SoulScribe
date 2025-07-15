import React from 'react';
import { useNavigate } from 'react-router-dom';

const stripTags = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id } = blog;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${_id}`)}
      className="w-full rounded-lg overflow-hidden bg-white shadow-md 
      hover:shadow-primary/30 hover:scale-[1.02] duration-300 cursor-pointer"
    >
      <img
        src={image}
        alt={`Cover for blog titled "${title}"`}
        className="aspect-video w-full object-cover"
      />

      <div className="px-5 py-3">
        <span
          className="inline-block mb-3 bg-primary/20 text-primary text-xs px-3 py-1 
          rounded-full"
        >
          {category}
        </span>
        <h5 className="font-semibold text-gray-800 mb-2 text-base line-clamp-2">
          {title}
        </h5>
        <p className="text-xs text-gray-600 line-clamp-3">
          {stripTags(description).slice(0, 100)}...
        </p>
      </div>
    </div>
  );
};

export default BlogCard;