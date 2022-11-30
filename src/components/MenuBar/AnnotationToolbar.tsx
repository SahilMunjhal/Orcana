import React, { useState, MouseEvent } from 'react';
import _ from 'lodash';
import IconButton from '@material-ui/core/IconButton';
import AnnotateIcon from '@material-ui/icons/Edit';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import BrushIcon from '@material-ui/icons/Brush';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import CallMadeIcon from '@material-ui/icons/CallMade';
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import ScreenshotButton from '../Buttons/ScreenshotButton/ScreenshotButton';
import ToggleScreenShareButton from '../Buttons/ToogleScreenShareButton/ToggleScreenShareButton';
import { InputBase, Tooltip } from '@material-ui/core';
import { useAppState } from '../../state';
import { isMobile } from 'react-device-detect';

const colors = ['#808080', '#000000', '#FF0000', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF'];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'absolute',
    bottom: '4%',
    left: '2.5%',
    'z-index': '2',
  },
  mainIcon: {
    border: '2px solid #fff',
    background: '#1086be',
    color: '#fff',
    fill: '#fff',
    '&:hover': {
      background: '#1086be',
    },
  },
  iconTray: {
    marginRight: theme.spacing(1),
    background: '#fff',
    borderRadius: '50px',
    position: 'relative',
  },
  textBar: {
    marginRight: theme.spacing(1),
    background: '#eee',
    borderRadius: '50px',
    position: 'relative',
    flexGrow: 1,
    flex: '0 0 auto',
    display: 'inline-flex',
  },
  colorBar: {
    marginRight: theme.spacing(1),
    background: '#eee',
    borderRadius: '50px',
    position: 'relative',
    flexGrow: 1,
    flex: '0 0 auto',
    display: 'inline-block',
  },
  inputBox: {
    position: 'relative',
    width: '100%',
    background: '#eee',
    flexGrow: 1,
    borderRadius: '50px',
    marginLeft: '16px',
  },
}));

const StyledMenu = withStyles({
  paper: {
    background: 'transparent',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
));

export default function AnnotationToolbar(props: {
  selectedTool?: any;
  handleColor?: any;
  handleText?: any;
  handleTool?: any;
  handleDelete?: any;
  color?: any;
  roomDimensions?: any;
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [colorToggle, setColorToggle] = useState<boolean>(false);
  const [textToggle, setTextToggle] = useState<boolean>(false);
  const [text, setText] = useState<any>('');

  const { setAlert, orcanaUser } = useAppState();
  const canAdmin = orcanaUser?.canAdmin || false;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (tool: string) => {
    if (isMobile) {
      setAlert({ title: 'Alert!', message: 'This feature is not currently supported on touch screens.' });
      setAnchorEl(null);
    } else {
      tool === 'text' && props.handleText(text);
      tool === 'delete' && props.handleDelete();
      setColorToggle(false);
      setTextToggle(false);
      setAnchorEl(null);
      props.handleTool(tool);
    }
  };

  const handleColor = (hex: string) => {
    props.handleColor(hex);
    setColorToggle(false);
  };

  const insertSelect = (insert: string) => {
    insert === 'color' && setColorToggle(!colorToggle);
    insert === 'text' && setTextToggle(!textToggle);
  };

  const toolIcon = (selectedTool: string) => {
    switch (selectedTool) {
      case 'circle':
        return <RadioButtonUncheckedIcon />;
      case 'rect':
        return <CheckBoxOutlineBlankIcon />;
      case 'line':
        return <CallMadeIcon />;
      case 'text':
        return <TextFormatIcon />;
      default:
        return <AnnotateIcon />;
    }
  };

  return (
    <div className={classes.root}>
      <StyledMenu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <div className={classes.iconTray}>
          <IconButton onClick={handleClose} className={classes.mainIcon}>
            {toolIcon(props.selectedTool)}
          </IconButton>
          <IconButton style={{ color: props.color }} onClick={_.partial(insertSelect, 'color')}>
            <FormatColorFillIcon color="inherit" />
          </IconButton>
          {colorToggle && (
            <div className={classes.colorBar}>
              {colors.map(color => {
                return (
                  <IconButton style={{ color: color }} onClick={_.partial(handleColor, color)}>
                    <FormatColorFillIcon color="inherit" />
                  </IconButton>
                );
              })}
            </div>
          )}
          <IconButton onClick={_.partial(handleSelect, 'circle')}>
            <RadioButtonUncheckedIcon />
          </IconButton>
          <IconButton onClick={_.partial(handleSelect, 'rect')}>
            <CheckBoxOutlineBlankIcon />
          </IconButton>
          <IconButton onClick={_.partial(handleSelect, 'line')}>
            <CallMadeIcon />
          </IconButton>
          <IconButton onClick={_.partial(insertSelect, 'text')}>
            <TextFormatIcon />
          </IconButton>
          {textToggle && (
            <form onSubmit={_.partial(handleSelect, 'text')} autoComplete="off" className={classes.textBar}>
              <InputBase
                id="text_input"
                placeholder="text…"
                value={text}
                onChange={e => setText(e.target.value)}
                className={classes.inputBox}
              />
              <IconButton onClick={_.partial(handleSelect, 'text')}>
                <AddCircleIcon />
              </IconButton>
              <input type="submit" style={{ visibility: 'hidden', position: 'absolute', top: '0', left: '0' }} />
            </form>
          )}
          <IconButton onClick={_.partial(handleSelect, 'delete')}>
            <DeleteForeverIcon />
          </IconButton>
          {canAdmin && <ScreenshotButton clickHandler={handleClose} roomDimensions={props.roomDimensions} />}
          {canAdmin && <ToggleScreenShareButton />}
        </div>
      </StyledMenu>
      <IconButton onClick={handleClick} className={classes.mainIcon}>
        {toolIcon(props.selectedTool)}
      </IconButton>
    </div>
  );
}
