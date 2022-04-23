import { GpsFixed } from '@mui/icons-material';
import {
  Chip,
  Fade,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import { observer } from 'mobx-react-lite';

import { store } from '../store';

export const MapContextMenu: React.FC = observer(() => {
  const width = 230;

  function getBoundingClientRect() {
    return {
      x: store.map.contextMenuAnchorPoint.x,
      y: store.map.contextMenuAnchorPoint.y,
      width,
      height: 0,
      top: store.map.contextMenuAnchorPoint.y,
      right: 0,
      bottom: 0,
      left: store.map.contextMenuAnchorPoint.x,
      toJSON: () => null,
    };
  }

  function handlePingLocation() {
    store.app.socket.emit('pingLocation', { mapId: store.map.id, ...store.map.contextMenuAnchorPoint });
    store.map.setContextMenuVisible(false);
  }

  return (
    <Popper open={store.map.contextMenuVisible} anchorEl={{ getBoundingClientRect }} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            <MenuList>
              <MenuItem onClick={handlePingLocation} sx={{ width }}>
                <ListItemIcon>
                  <GpsFixed fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Ping Location" />
                <ListItemSecondaryAction>
                  <Chip label="DBL" />
                </ListItemSecondaryAction>
              </MenuItem>
            </MenuList>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
});