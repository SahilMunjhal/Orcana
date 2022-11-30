import React, { useState } from 'react';

import AnnotateIcon from '@material-ui/icons/PlayForWork';
import Tooltip from '@material-ui/core/Tooltip';

import ChatInput from './ChatInput';
import { Button, ClickAwayListener, withStyles } from '@material-ui/core';

const LightTooltip = withStyles({
  tooltip: {
    backgroundColor: 'white',
  },
  arrow: {
    color: 'white',
  },
})(Tooltip);

export default function AnnotateButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <LightTooltip title={<ChatInput />} interactive placement="top" arrow={true} open={isOpen}>
        <Button onClick={() => setIsOpen(isOpen => !isOpen)} startIcon={<AnnotateIcon />}>
          Annotate
        </Button>
      </LightTooltip>
    </ClickAwayListener>
  );
}
