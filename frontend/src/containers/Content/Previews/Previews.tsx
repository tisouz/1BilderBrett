import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchInitialPreviews, fetchFurtherPreviews } from '../../../store/PreviewsSlice';

import './Previews.css';
import Preview from "../../../components/Preview/Preview";

const Previews = () => {
  const tags = useAppSelector((state) => state.tag.tags);
  const tokens = useAppSelector((state) => state.auth.tokens);
  const previews = useAppSelector((state) => state.previews.previews);
  const nextPreviews = useAppSelector((state) => state.previews.next);
  const loadingPreviews = useAppSelector((state) => state.previews.loading);
  const loadingTokens = useAppSelector((state) => state.auth.loading);
  const loading = loadingPreviews || loadingTokens;
  const dispatch = useAppDispatch();


  useEffect(() => {
    if (!tokens)
      return;
    else
      dispatch(fetchInitialPreviews({ accessToken: tokens.accessToken, tags: tags }));
  }, [dispatch, tokens, tags]); //also tags

  //scrollEventListener
  useEffect(() => {
    window.addEventListener('scroll', scrollHandler);
    return function cleanup() {
      window.removeEventListener('scroll', scrollHandler);
    };
  });

  //infinite scroll
  const scrollHandler = (event: Event) => {
    const height = (document.documentElement.scrollHeight - document.documentElement.clientHeight);
    const scrolled = document.body.scrollTop || document.documentElement.scrollTop;
    if (scrolled === height && nextPreviews !== null && tokens !== null && !loading) {
      dispatch(fetchFurtherPreviews({ accessToken: tokens.accessToken, next: nextPreviews }));
    }
  }


  if (!tokens && !loading)
    return <p>Please log in</p>


  let renderedPreviews: any = null;
  if (previews.length > 0) {
    renderedPreviews = previews.map(preview => (
      <Preview
        key={preview.id}
        id={preview.id}
        thumbnail={preview.thumbnail}
      />
    ));
  }

  let noPostsMessage: any = null;
  if (previews.length <= 0 && !loading)
    noPostsMessage = <p>Nothing to see here :[</p>;

  return (
    <div className="PreviewsContainer ">
      {noPostsMessage}
      {renderedPreviews}
      {loading && <div className='fa'><i className="fas fa-spinner fa-spin"></i></div>}
    </div>
  );

}

export default Previews;