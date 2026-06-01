import React from 'react';
import CreatePostBox from '../../components/feed/CreatePostBox';
import Feed from '../../components/feed/Feed';

const Home: React.FC = () => {
  return (
    <div className="w-full mt-6 px-4">
      {/* Create Post Section */}
      <CreatePostBox />

      {/* Infinite Realtime Feed */}
      <Feed />
    </div>
  );
};

export default Home;