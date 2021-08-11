import React from 'react';
import {NavLink} from 'react-router-dom';

import './Preview.css'

interface PreviewProps {
  id: number;
  thumbnail: string;
}

const Preview = ({id, thumbnail}: PreviewProps) => {
  return <NavLink to={'/posts/' + id.toString()}>
    <img className='Thumbnail' src={thumbnail} alt={'preview of post: ' + id}/>
  </NavLink>
}

export default Preview