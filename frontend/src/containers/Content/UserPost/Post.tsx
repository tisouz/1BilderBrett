import React, { useEffect } from 'react';
import './Post.css';
import { useParams } from 'react-router';
import { Redirect } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchPost } from '../../../store/PostSlice';
import ChangePostControl from '../ChangePostControl/ChangePostControl';
import TagSection from '../TagSection/TagSection';
import CommentSection from '../CommentSection/CommentSection';

interface MatchParams {
  postId: string;
}


const Post = () => {
  const dispatch = useAppDispatch();
  const tokens = useAppSelector((state) => state.auth.tokens);
  const mediaType = useAppSelector((state) => state.post.mediaType);
  const content = useAppSelector((state) => state.post.content);
  const loadingPost = useAppSelector((state) => state.post.loading);
  const loadingTokens = useAppSelector((state) => state.auth.loading);
  const loading = loadingTokens || loadingPost;
  const postId = parseInt(useParams<MatchParams>().postId);

  const isGif = (path: string) => {
    const fileExtension = path.split('.').pop()?.toLocaleLowerCase();
    return fileExtension === 'gif';
  }

  const setVolume = () => {
    var video: any = document.getElementById('VideoContent');
    if (video === null)
      return;

    let storedVolume: any = localStorage.getItem('videoVolume');
    let newVolume = 0.5;
    if (parseFloat(storedVolume) !== null && Number.isNaN(parseFloat(storedVolume)) === false) {
      newVolume = parseFloat(storedVolume);
      if (newVolume < 0.0)
        newVolume = 0;
      else if (newVolume > 1.0)
        newVolume = 1.0;
    }
    video.volume = newVolume;
  }

  const volumeChangedHandler = (event: any) => {
    let newVolume = event.target.volume;
    localStorage.setItem('videoVolume', newVolume.toString());
  }

  useEffect(() => {
    if (tokens === null || isNaN(postId))
      return;
    dispatch(fetchPost({ accessToken: tokens.accessToken, postId: postId }));
  }, [tokens, dispatch, postId]);

  useEffect(() => {
    setVolume(); 
  });

  if (isNaN(postId))
    return <Redirect to="/" />;

  if (loading === true)
    return <div className='column has-text-centered'><i className="fas fa-spinner fa-spin"></i></div>;


  let renderedContent: JSX.Element | null = null;
  if (content !== null) {
    switch (mediaType) {
      case 'img':
        renderedContent = <img src={content} alt='post content' />;
        break;
      case 'vid':
        if (isGif(content))
          renderedContent = <img src={content} alt='post content' />;
        else
          renderedContent = <video id='VideoContent' className='VideoContent' onVolumeChange={(event) => volumeChangedHandler(event) } loop autoPlay controls src={content} />;
        break
      default:
        renderedContent = <p>unhandled content_type, lol</p>;
        break;
    }
  }
  return (
    <div className="PostContainer">
      {renderedContent}
      <div className='PostInteractionContainer '>
        <ChangePostControl />
        <TagSection />
        <CommentSection />
      </div>
    </div>
  );

}

export default Post;