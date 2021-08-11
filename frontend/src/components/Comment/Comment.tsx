import React from 'react';
import './Comment.css'
import {Comment as CommentData} from '../../store/PostSlice';

interface Props {
  comment: CommentData
}

const Commentt = ({comment}: Props) => {
  return (
   <div className='column'>
     <div className='CommentContent'>{comment.content}</div>
     <div className='CommentAuthor'>{comment.authorName}</div>
   </div> 
  );
}

export default Commentt;