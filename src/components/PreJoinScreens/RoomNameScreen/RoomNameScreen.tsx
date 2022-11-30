import React, { ChangeEvent, FormEvent, useState } from 'react';
import {
  Typography,
  makeStyles,
  TextField,
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Link,
  Theme,
} from '@material-ui/core';
import { useAppState } from '../../../state';

const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  inputContainer: {
    display: 'block',
    justifyContent: 'space-between',
    backgroundColor: '#feefe0',
    margin: '0 0 1.5em',
    '& div:not(:last-child)': {
      marginRight: '1em',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '1.5em 0 2em',
    },
  },
  inputLabel: {
    marginBottom: '0.5em',
  },
  checkboxLabel: {
    marginBottom: '1.5em',
  },
  textFieldContainer: {
    width: '100%',
    backgroundColor: '#feefe0',
  },
  continueButton: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

interface RoomNameScreenProps {
  name: string;
  roomName: string;
  setName: (name: string) => void;
  setRoomName: (roomName: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function RoomNameScreen({ name, roomName, setName, setRoomName, handleSubmit }: RoomNameScreenProps) {
  const classes = useStyles();
  const { user } = useAppState();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleTermsAccepted = (event: ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(!termsAccepted);
  };

  const hasUsername = !window.location.search.includes('customIdentity=true') && user?.displayName;

  return (
    <>
      <Typography variant="h4" style={{ textAlign: 'center', fontWeight: 'lighter' }} className={classes.gutterBottom}>
        Join a Session
      </Typography>
      {/* <Typography variant="body1">
        {hasUsername
          ? "Enter the name of a room you'd like to join."
          : "Enter your name and the name of a room you'd like to join"}
      </Typography> */}
      <form onSubmit={handleSubmit}>
        <InputLabel className={classes.inputLabel} shrink htmlFor="input-user-name">
          Create a name based on camera location (e.g. back table, surgical site):
        </InputLabel>
        <div className={classes.inputContainer}>
          {!hasUsername && (
            <div className={classes.textFieldContainer}>
              <TextField
                id="input-user-name"
                fullWidth
                placeholder="Device name"
                InputProps={{
                  startAdornment: <span>&nbsp;&nbsp;</span>,
                }}
                value={name}
                onChange={handleNameChange}
              />
            </div>
          )}
        </div>
        <InputLabel className={classes.inputLabel} shrink htmlFor="input-room-name">
          Enter case number received via email:
        </InputLabel>
        <div className={classes.inputContainer}>
          <div className={classes.textFieldContainer}>
            <TextField
              autoCapitalize="false"
              id="input-room-name"
              fullWidth
              placeholder="Case number"
              InputProps={{
                startAdornment: <span>&nbsp;&nbsp;</span>,
              }}
              value={roomName}
              onChange={handleRoomNameChange}
            />
          </div>
        </div>

        <FormControlLabel
          className={classes.checkboxLabel}
          control={<Checkbox checked={termsAccepted} onChange={handleTermsAccepted} color="primary" />}
          label={
            <div>
              <span>I accept the </span>
              <Link target="_blank" href={'https://app.orcana.io/terms_of_service'}>
                terms of service
              </Link>
              <span> and </span>
              <Link target="_blank" href={'https://app.orcana.io/privacy_policy'}>
                privacy policy
              </Link>
            </div>
          }
        />

        <Grid container justify="flex-end">
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={!name || !roomName || !termsAccepted}
            className={classes.continueButton}
          >
            Continue
          </Button>
        </Grid>
      </form>
    </>
  );
}
