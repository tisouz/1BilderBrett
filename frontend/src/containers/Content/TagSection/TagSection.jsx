import React, { useState, useEffect } from 'react';
import './TagSection.css'

import { useAppSelector } from '../../../app/hooks';
import TagCreation from './TagCreation/TagCreation';

const TagSection = () => {
  const initialTagsCount = 5;
  const [showMoreThanInitialTags, setShowMoreThanInitialTags] = useState(false);
  const [renderedTags, setRenderedTags] = useState([])
  const tags = useAppSelector((state) => state.post.tags);

  //initial tags (5)
  useEffect(() => {
    if (showMoreThanInitialTags === true || tags === null)
      return;

    let i = 0;
    const initialTags = [];
    while (i < initialTagsCount && i < tags.length) {
      initialTags.push(<span className='tag is-primary' key={tags[i].id}>{tags[i].content}</span>);
      i++;
    }
    setRenderedTags(initialTags);
  }, [tags, showMoreThanInitialTags, initialTagsCount])

  useEffect(() => {
    if (showMoreThanInitialTags === false || tags === null)
      return;

    setRenderedTags(tags.map(tag => <span className='tag is-primary' key={tag.id}>{tag.content}</span>));
  }, [tags, showMoreThanInitialTags])

  const handleLoadAllTags = () => {
    setShowMoreThanInitialTags(true);
  }

  if (tags === null)
    return <p>No tags :[</p>


  const showToggleAllTags = !showMoreThanInitialTags && (tags.length >= initialTagsCount);

  return (
    <React.Fragment>
      <div className='tags are-medium column'>
        {renderedTags}
        {showToggleAllTags ?
          <p className='LoadMore' onClick={() => handleLoadAllTags()}>More...</p>
          : null
        }
      </div>
      <TagCreation />
    </React.Fragment>
  );

}


export default TagSection;