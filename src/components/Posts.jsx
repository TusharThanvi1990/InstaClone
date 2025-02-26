import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const {posts} = useSelector(store => store.post);
  return (
    <div className="w-[90vw] md:w-[60vw]">
        {
            posts.slice().reverse().map((post) => <Post key={post?._id} post={post}/>)
        }
    </div>
  )
}

export default Posts