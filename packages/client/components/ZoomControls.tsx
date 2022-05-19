import { Add, FitScreen, Fullscreen, FullscreenExit, Remove } from '@mui/icons-material';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';

import { useGetMap } from '../hooks/data/maps/useGetMap';
import { Color } from '../lib/enums';
import { store } from '../store';

export const ZoomControls: React.FC = observer(() => {
  const router = useRouter();
  const { data: map } = useGetMap(router.query.mapId as string);

  function handleZoomIn() {
    store.pixi.viewport.animate({ scale: store.pixi.viewport.scaled + 0.2, time: 100 });
  }

  function handleZoomOut() {
    store.pixi.viewport.animate({ scale: Math.max(store.pixi.viewport.scaled - 0.2, 0), time: 100 });
  }

  function handleFitScreen() {
    if (!map) return;
    store.pixi.viewport.animate({
      position: { x: map.media.width / 2, y: map.media.height / 2 },
      scale: Math.min(window.innerWidth / map.media.width, window.innerHeight / map.media.height),
      time: 100,
    });
  }

  return (
    <Box sx={{ position: 'fixed', top: 4, right: 4, display: 'flex', flexDirection: 'column' }}>
      <ToggleButtonGroup orientation="vertical" sx={{ background: Color.Black }}>
        <Tooltip title="Zoom In" placement="left" followCursor>
          <ToggleButton value="zoom-in" size="small" onClick={handleZoomIn}>
            <Add />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Zoom Out" placement="left" followCursor>
          <ToggleButton value="zoom-out" size="small" onClick={handleZoomOut}>
            <Remove />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Fit Screen" placement="left" followCursor>
          <ToggleButton value="fit-screen" size="small" onClick={handleFitScreen}>
            <FitScreen />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Full Screen" placement="left" followCursor>
          <ToggleButton
            value="full-screen"
            size="small"
            selected={store.app.fullScreen}
            onChange={() => store.app.toggleFullScreen()}
          >
            {store.app.fullScreen ? <FullscreenExit /> : <Fullscreen />}
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </Box>
  );
});
