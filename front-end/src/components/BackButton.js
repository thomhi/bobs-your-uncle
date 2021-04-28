import { IconButton } from '@material-ui/core';
import React, { useState } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Redirect } from 'react-router-dom';
import { backButtonUseStyles } from '../styles/styles';

export default function BackButton(props) {
  const classes = backButtonUseStyles();
  const [redirect, setRedirect] = useState(false);

  if (redirect) {
    return (<Redirect to={props.redirectPath}/>);
  }

  return (
    <IconButton
          id='register-back-button'
          className={`${classes.backButton} ${props.className}`}
          onClick={()=>setRedirect(true)}
          style={props.style}>
          <ArrowBackIcon fontSize="inherit" />
    </IconButton>
  );
}