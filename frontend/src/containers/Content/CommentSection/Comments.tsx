import React from 'react';

import { useAppSelector } from "../../../app/hooks";
import Comment from '../../../components/Comment/Comment';
const Comments = () => {
  const comments = useAppSelector((state) => state.post.comments);

  if (comments === null || comments.length <= 0)
    return <p>No comments :[</p>

  const renderedComments = comments.map(comment =>
    /*<Comment
      key={comment.id}
      authorName={comment.authorName}
      content={comment.content}
    />*/
    <Comment
      key={comment.id}
      comment={comment}
    /> 
  );

  return (
    <div className='columns is-flex-direction-column' >
      {renderedComments}
    </div>
  );
}

export default Comments;