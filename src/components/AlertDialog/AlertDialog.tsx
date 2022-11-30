import React, { PropsWithChildren } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import { TwilioError } from 'twilio-video';

interface AlertDialogProps {
  dismissAlert: Function;
  alert: { title: string; message: string } | null;
}

function AlertDialog({ dismissAlert, alert }: PropsWithChildren<AlertDialogProps>) {
  const { title, message } = alert || {};

  return (
    <Dialog open={alert !== null} onClose={() => dismissAlert()} fullWidth={true} maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dismissAlert()} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AlertDialog;
