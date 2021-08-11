import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setTags } from '../store/TagSlice'; 

const TagSearch = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  
  const tags = useAppSelector((state) => state.tag.tags); 
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setSearchText(tags.join(' '));
  }, [tags])

  const inputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
  }
  
  const submitHandler = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const sanitizedSearchText = searchText.trim();
    
    let newTags: string[] = [];
    if (sanitizedSearchText.length > 0 )
      newTags = searchText.trim().split(' ');
    
    dispatch(setTags(newTags));
    history.push('/previews');
  }
  
  return(
    <form className='navbar-item'>
      <div className='control'>
        <input className='input' type='text' placeholder='tags'
          value={searchText}
          onChange={(event) => inputChangedHandler(event)}/>
      </div>
      <div className='control'>
        <button className='button' onClick={(event) => submitHandler(event)}>Search</button>
      </div>
    </form>
  )
}

export default TagSearch;