import React from 'react';

const Newsletter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 my-32">
      <h1 className="md:text-4xl text-2xl font-semibold text-gray-800">
        Stay In Tune with SoulScribe
      </h1>
      <p className="md:text-lg text-gray-500/70 pb-8 max-w-xl">
        Get soulful stories, mindful tech, and exclusive insights delivered straight to your inbox.
      </p>
      <form
        className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          placeholder="Enter your email"
          aria-label="Email address"
          required
          className="border border-gray-300 rounded-md h-full border-r-0 
          outline-none w-full rounded-r-none px-3 text-gray-600"
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-primary/80 
          hover:bg-primary transition-all cursor-pointer rounded-md rounded-l-none"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default Newsletter;