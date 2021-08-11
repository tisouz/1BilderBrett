import React, { useState } from 'react';
import './TagCreation.css'

import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { addTag } from '../../../../store/PostSlice';

import {instance as axios} from '../../../../axios-content';
import { setBulmaButtonClasses, getAuthorizationHeader } from '../../../../util';


const TagCreation = () => {
  const tokens = useAppSelector((state) => state.auth.tokens);
  const postId = useAppSelector((state) => state.post.postId);
  const dispatch = useAppDispatch();

  const [tag, setTag] = useState("");
  const [canPost, setCanPost] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const submitTag = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    
    if (tokens === null)
      return;

    const data = {
      'post': postId,
      'tag': tag
    }

    setIsLoading(true);
    setCanPost(false);
    axios.post('tags/', data, getAuthorizationHeader(tokens.accessToken))
      .then( res => {
        dispatch(addTag(tag)); 
        setTag('');
      })
      .catch(err => {
        alert("OOPSIE WOOPSIE!! Uwu We make a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!\n" + err);
      })
      .finally(() => {
        setCanPost(true);
        setIsLoading(false);
      })
  }

  return (
    <div className='column'>
      <form className='columns TagCreationContainer' >
        <div className='column'>
          <input className='input'
            type='text'
            placeholder='tag'
            value={tag}
            onChange={(event) => setTag(event.target.value.trim())}

          />
        </div>

        <div className='column'>
          <button 
          className={setBulmaButtonClasses(isLoading)}
          onClick = {(event) => submitTag(event)}
          disabled={!canPost}>Post Tag</button>
        </div>
      </form>
    </div>
  );
}


export default TagCreation;