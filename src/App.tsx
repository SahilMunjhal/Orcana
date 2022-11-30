import React from 'react';
import { styled, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import HeaderBar from './components/HeaderBar/HeaderBar';
import TitleBar from './components/TitleBar/TitleBar';
import FooterBar from './components/FooterBar/FooterBar';

import PreJoinScreens from './components/PreJoinScreens/PreJoinScreens';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import AnnotationContextProvider from './components/AnnotationLayer/AnnotationLayerContext';
import ScreenshotContextProvider from './components/ScreenshotLayer/ScreenshotLayerContext';
import RoomContextProvider from './components/Room/RoomContext';
import Room from './components/Room/Room';

import useHeight from './hooks/useHeight/useHeight';
import useRoomState from './hooks/useRoomState/useRoomState';

const Wrapper = styled('div')({
  backgroundColor: '#000',
});

const Main = styled('main')(({ theme }: { theme: Theme }) => ({
  padding: '0 auto',
  background: 'black',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: `${theme.mobileFooterHeight + theme.mobileTopBarHeight}px`, // Leave some space for the mobile header and footer
  },
}));

const WorkSpace = styled('div')({
  position: 'relative',
});

const WorkContainer = styled(Container)({
  padding: '0',
});

export default function App() {
  const roomState = useRoomState();

  const [titleBarHeight, setTitleBarHeight] = React.useState(0);
  const [footerBarHeight, setFooterBarHeight] = React.useState(0);

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  return (
    <Wrapper style={{ height }}>
      {roomState === 'disconnected' ? (
        <PreJoinScreens />
      ) : (
        <>
          <RoomContextProvider>
            <AnnotationContextProvider>
              <ScreenshotContextProvider>
                <HeaderBar setTitleBarHeight={setTitleBarHeight} />
                <WorkContainer maxWidth="xl">
                  <Main>
                    <ReconnectingNotification />
                    <WorkSpace>
                      <Room verticalOffset={titleBarHeight + footerBarHeight} />
                    </WorkSpace>
                  </Main>
                </WorkContainer>
              </ScreenshotContextProvider>
            </AnnotationContextProvider>
          </RoomContextProvider>
        </>
      )}
    </Wrapper>
  );
}
