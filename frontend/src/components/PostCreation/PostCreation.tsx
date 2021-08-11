import React, { useState, useEffect } from 'react';
import {Redirect} from 'react-router-dom';

import { useAppSelector } from '../../app/hooks';

import './PostCreation.css'
import { setBulmaButtonClasses, getAuthorizationHeader } from '../../util';
import { instance as axios } from '../../axios-content';

const PostCreation = () => {
  const tokens = useAppSelector((state) => state.auth.tokens);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileErrorMessage, setFileErrorMessage] = useState("");
  const [canUpload, setCanUpload] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const maxFileSize = 20;
  const allowedFileTypes = ["video/mp4", "video/webm", "image/png", "image/jpeg", "image/jpg", "image/gif"];

  useEffect(() => {
    selectedFile === null ? setCanUpload(false) : setCanUpload(true);
  }, [selectedFile]);

  const submitUpload = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (tokens === null || selectedFile === null)
      return;

    const authorization = getAuthorizationHeader(tokens.accessToken);

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsLoading(true);
    setCanUpload(false);
    axios.post('posts/', formData, authorization)
      .then(res => {
        setIsLoading(false);
        setCanUpload(true);
        setUploaded(true);
      }
      )
      .catch(err => {
        setIsLoading(false);
        setCanUpload(true);
        alert("OOPSIE WOOPSIE!! Uwu We make a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!\n" + err.response.data.detail);
      });
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null)
      return;

    const file = event.target.files[0];
    setSelectedFile(null);

    if (file.size > (maxFileSize * 1024 * 1024)) {
      setFileErrorMessage(`Maximum Filesize is ${maxFileSize} MB.`);
      return;
    }
    if (!allowedFileTypes.includes(file.type)) {
      setFileErrorMessage('Invalid filetype.');
      return;
    }

    setFileErrorMessage("");
    setSelectedFile(file);
  }

  const getErrorMessage = () => {
    if (fileErrorMessage === "")
      return null;
    else
      return (
        <div className='column has-text-centered'>
          <p>{fileErrorMessage}</p>
        </div>
      );
  }
  
  if (uploaded)
    return <Redirect to="/"/>

  return (
    <form className='PostCreationContainer'>
      <div className="file is-boxed is-centered">
        <label className="file-label">
          <input className="file-input" type="file"
            onChange={(event) => onFileChange(event)} />
          <span className="file-cta">
            <span className="file-icon">
              <i className="fas fa-upload"></i>
            </span>
            <span className="file-label">
              Choose a file…
            </span>
          </span>
        </label>
      </div>

      <div className='column  has-text-centered'>
        <button className={setBulmaButtonClasses(isLoading)}
          onClick={(event) => submitUpload(event)}
          disabled={!canUpload}>Upload</button>
      </div>

      {getErrorMessage()}
    </form>
  );
}


export default PostCreation;