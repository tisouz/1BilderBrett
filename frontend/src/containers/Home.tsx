import React, { useEffect } from 'react';
import { Redirect } from 'react-router';

import { useAppDispatch } from '../app/hooks';
import { setTags } from '../store/TagSlice';

const Home = () => {
  const dispatch = useAppDispatch();

  useEffect(()=> {
    //clear tags
    dispatch(setTags([]));
  }, [dispatch]);
  
  return <Redirect to='/previews' />
}

export default Home;