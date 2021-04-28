import {useState, useEffect} from 'react';
import { Card, CardActions, CardContent, Typography, Button, Backdrop } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import {errorUseStyles} from '../styles/styles';

export default function Error({statusCode, errorMessage, resetError, redirectPath}) {
  const classes = errorUseStyles();
  const [open, setOpen] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    return () => {
      resetError();
    };
  });

  if (redirect) {
    return <Redirect to={redirectPath} />;
  }

  return (
    <Backdrop className={classes.backdrop} open={open} onClick={handleClose} style={{zIndex: 1}}>
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h5" component="h2" className={classes.title}>
            Error
          </Typography>
          <Typography variant="body2" component="p">
            Statuscode: {statusCode}
            <br />
            Error Message: {errorMessage}
          </Typography>
        </CardContent>
        <CardActions>
          {redirectPath && <Button size="small" onClick={()=>setRedirect(true)}>Zum Profil</Button>}
          <Button size="small">Ok</Button>
        </CardActions>
      </Card>
    </Backdrop>
  );
}