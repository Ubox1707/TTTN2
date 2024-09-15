import React, { useEffect } from 'react'
import './postSide.css'

import {  useQuery } from "@tanstack/react-query";



import NewPost from '../NewPost/NewPost'


const PostSide = ({ feedType, username, userId }) => {
  const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "/posts/all";
			case "following":
				return "/posts/following";
			case "posts":
				return `/posts/user/${username}`;
			case "likes":
				return `/posts/likes/${userId}`;
			default:
				return "/posts/all";
		}
	};

	const POST_ENDPOINT = getPostEndpoint();

	const {
		data: posts,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}

				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	useEffect(() => {
		refetch();
	}, [feedType, refetch, username]);
 

  
    
  return (
    <>
    {!isLoading && !isRefetching && posts?.length === 0 && 
    <p className='post-none'>Chưa có bài viết nào 😐</p> 
    }
    {!isLoading && !isRefetching && posts &&(
      <div>
        {posts.map((post) => (
			<NewPost key={post._id} post={post} />
        ))}
      </div>
    )}  
    </>
    
  )
}

export default PostSide
