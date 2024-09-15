import React from 'react'
import './postModal.css'
import Close from "../../img/close-icon.png"
import PostArea from "../PostArea/PostArea"

const PostModal = ({onClose}) => {
  return (
    <div className='post-modal'>
      <div className="layer" onClick={(event) => { event.stopPropagation(); onClose(); }}></div>
      <div className="post-modal-content">
        <img 
        src={Close} 
        alt="" 
        className="x-icon" 
        onClick={(event) => { event.stopPropagation(); onClose(); }}
        />
        <PostArea/>
      </div>
      
    </div>
  )
}

export default PostModal
