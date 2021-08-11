import React from 'react';
import CommentCreation from './CommentCreation';
import Comments from './Comments';


const CommentSection = () => {
  return(
    <React.Fragment>
      <CommentCreation />
      <Comments />
    </React.Fragment>
  );
}

export default CommentSection;