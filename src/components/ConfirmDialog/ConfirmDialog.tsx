import React, { PropsWithChildren } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import { TwilioError } from 'twilio-video';

interface ConfirmDialogProps {
  confirm: {
    title: String;
    message: String;
    confirmButton: String;
    cancelButton: String;
    dismissConfirm: Function;
  } | null;
  setConfirm: Function;
}

function ConfirmDialog({ confirm, setConfirm }: PropsWithChildren<ConfirmDialogProps>) {
  const { title, message, confirmButton, cancelButton, dismissConfirm } = confirm || {};

  const dismiss = () => {
    if (dismissConfirm !== undefined) {
      dismissConfirm();
    }
    setConfirm(null);
  };

  return (
    <Dialog open={confirm !== null} onClose={() => dismiss()} fullWidth={true} maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirm(null)} color="primary">
          {cancelButton}
        </Button>
        <Button onClick={() => dismiss()} color="primary" autoFocus>
          {confirmButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
