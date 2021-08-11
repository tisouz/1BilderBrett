import React, { useCallback, useEffect, useState } from 'react';
import './ChangePostControl.css';
import { useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchFurtherPreviews } from '../../../store/PreviewsSlice';


const ChangePostControl = () => {
  const postId = useAppSelector((state) => state.post.postId);
  const previews = useAppSelector((state) => state.previews.previews);
  const moreAvailable = useAppSelector((state) => state.previews.moreAvailable);
  const nextPreviews = useAppSelector((state) => state.previews.next);
  const tokens = useAppSelector((state) => state.auth.tokens);
  const dispatch = useAppDispatch();


  const getIndexCurrPost = useCallback(
    () => {
      for (let i = 0; i < previews.length; i++)
        if (previews[i].id === postId)
          return i;
      return -1;
    },
    [previews, postId]
  );

  const [indexCurrPost, setIndexCurrPost] = useState(getIndexCurrPost());
  const history = useHistory();

  useEffect(() => {
    setIndexCurrPost(getIndexCurrPost());
    if (nextPreviews === null || tokens === null)
      return
    //fetch more if end reached
    if (indexCurrPost >= previews.length - 2 && moreAvailable) {
      dispatch(fetchFurtherPreviews({
        accessToken: tokens.accessToken,
        next: nextPreviews
      }));
    }

  }, [indexCurrPost, postId, moreAvailable, previews, nextPreviews,
     getIndexCurrPost, dispatch, tokens]);

  const prevActivated = () => {
    return indexCurrPost > 0;
  }

  const nextActivated = () => {
    return indexCurrPost < previews.length - 1;
  }

  const switchToPrevPost = () => {
    if (prevActivated())
      history.push(("/posts/" + previews[indexCurrPost - 1].id));
  }

  const switchToNextPost = () => {
    if (nextActivated())
      history.push(("/posts/" + previews[indexCurrPost + 1].id));
  }

  //scrollEventListener
  useEffect(() => {
    window.addEventListener('keydown', keyPressHandler);
    return function cleanup() {
      window.removeEventListener('keydown', keyPressHandler);
    };
  });

  const keyPressHandler = (event: any) => {
    const keyCode = event.keyCode;
    const rightArrowKeyCode = 39;
    const leftArrowKeyCode = 37;

    switch (event.target.tagName.toLowerCase()) {
      case "input":
      case "textarea":
      case "select":
        break;
      default:
        if (keyCode === rightArrowKeyCode)
          switchToNextPost();
        else if (keyCode === leftArrowKeyCode)
          switchToPrevPost()
        else
          return;
    }

  }


  return (
    <div className='column buttons has-text-centered' style={{ padding: '20px' }}>

      <button className='button is-medium'
        disabled={!prevActivated()}
        onClick={(event) => switchToPrevPost()}>
        {'<-----'}
      </button>

      <button className='button is-medium '
        disabled={!nextActivated()}
        onClick={(event) => switchToNextPost()}>
        {'----->'}
      </button>

    </div>
  );
}


export default ChangePostControl;
