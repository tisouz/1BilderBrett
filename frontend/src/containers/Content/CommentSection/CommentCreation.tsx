import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchPost } from "../../../store/PostSlice";

import { setBulmaButtonClasses, getAuthorizationHeader } from '../../../util';
import { instance as axios } from '../../../axios-content';

const CommentCreation = () => {
  const dispatch = useAppDispatch();
  const tokens = useAppSelector((state) => state.auth.tokens);
  const postId = useAppSelector((state) => state.post.postId);

  const [comment, setComment] = useState("");
  const [canPost, setCanPost] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCanPost(comment.trim().length > 0);
  }, [comment]);

  const submitComment = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (tokens === null || postId === null)
      return;

    setCanPost(false);
    setIsLoading(true);

    const data = {
      'post': postId,
      'content': comment.trim()
    }
    axios.post('comments/', data, getAuthorizationHeader(tokens.accessToken))
      .then(res => {
        dispatch(fetchPost({ accessToken: tokens.accessToken, postId: postId }));
      })
      .catch(err => {
        alert("OOPSIE WOOPSIE!! Uwu We make a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!\n" + err);
      })
      .finally(() => {
        setIsLoading(false)
        setCanPost(true);
      })
  }

  return (
    <form
      style={{ maxWidth: '400px' }}>
      <div className='column'>
        <div className='control'>
          <textarea className='textarea'
            placeholder='add a comment...'
            rows={3}
            value={comment}
            onChange={(event) => setComment(event.target.value)}>
          </textarea>
        </div>
      </div>

      <div className='column control'>
        <button className={setBulmaButtonClasses(isLoading)}
        onClick={(event) => submitComment(event)}
        disabled={!canPost}>Post comment</button>
      </div>
    </form >
  );
}


export default CommentCreation;