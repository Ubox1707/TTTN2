import React, { useState } from 'react';
import './home.css';
import PostArea from '../../components/PostArea/PostArea';
import PostSide from '../../components/PostSide/PostSide';

const Home = () => {
  const [feedType, setFeedType] = useState("forYou")
  return (
    <>
    <div className="Home">
      <PostArea/>
      <div className="home-post">
        <div 
          className='foryou-post' 
          onClick={() => setFeedType("forYou")}
        >
          For you {feedType === "forYou" && <div className='bottom-line'></div>}
        </div>
        <div 
          className='following-post'
          onClick={() => setFeedType("following")}
        >
          Following {feedType === "following" && <div className='bottom-line'></div>}
        </div>
      </div>
      
      <PostSide feedType={feedType}/>
    </div>
    </>
    
  )
}

export default Home
