import React, { useState, useRef } from 'react';
import AboutDialog from '../../AboutDialog/AboutDialog';
import Button from '@material-ui/core/Button';
import DeviceSelectionDialog from '../../DeviceSelectionDialog/DeviceSelectionDialog';
import MenuContainer from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import { styled, Theme, useMediaQuery } from '@material-ui/core';

const StyledButton = styled(Button)(({ theme }: { theme: Theme }) => ({
  [theme.breakpoints.between('xs', 'md')]: {
    display: 'none',
  },
}));

export default function Menu(props: { buttonClassName?: string }) {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <StyledButton
        size="small"
        onClick={() => setMenuOpen(isOpen => !isOpen)}
        ref={anchorRef}
        className={props.buttonClassName}
      >
        <MoreIcon />
      </StyledButton>
      <MenuContainer
        open={menuOpen}
        onClose={() => setMenuOpen(isOpen => !isOpen)}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: isMobile ? -55 : 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={() => setSettingsOpen(true)}>
          <Typography variant="body1">Audio and Video Settings</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="body1">{`Build Number - ${process.env.REACT_APP_GIT_SHA}`}</Typography>
        </MenuItem>
      </MenuContainer>
      <AboutDialog
        open={aboutOpen}
        onClose={() => {
          setAboutOpen(false);
          setMenuOpen(false);
        }}
      />
      <DeviceSelectionDialog
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setMenuOpen(false);
        }}
      />
    </>
  );
}
