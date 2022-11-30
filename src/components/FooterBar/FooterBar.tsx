import React from 'react';

import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    marginTop: '12px',
    maxHeight: '60px',
    width: '100%',
    position: 'absolute',
    bottom: '0',
    display: 'flex',
    backgroundColor: '#dfeaef',
    color: '#ddd',
  },
  box: {
    width: '100%',
    height: '60px',
    maxHeight: '40px',
    position: 'relative',
    maxWidth: '1280px',
    margin: '6px auto 0',
    padding: '0',
  },
}));

interface FooterBarProps {
  setFooterBarHeight: (height: number) => void;
}

export default function FooterBar(props: FooterBarProps) {
  const classes = useStyles();

  React.useEffect(() => {
    const footerBarHeight = document.querySelector(`.${classes.root}`)?.clientHeight;
    if (footerBarHeight) props.setFooterBarHeight(footerBarHeight);
  }, []);

  return (
    <footer className={classes.root}>
      <Box className={classes.box}>
        <Typography>©2021 Orcana, Inc. All Rights Reserved.</Typography>
      </Box>
    </footer>
  );
}
