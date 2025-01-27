import { SelectAll, TouchApp } from '@mui/icons-material';
import { ButtonGroup, Fade, Paper, Popper, Tooltip } from '@mui/material';
import { bindHover, bindPopper, usePopupState } from 'material-ui-popup-state/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import { store } from '../../../store';
import { SelectTool, Tool } from '../../../store/toolbar';
import { ToolButton } from './ToolButton';

export const SelectToolItem = observer(function SelectToolItem() {
  const popupState = usePopupState({ variant: 'popper', popupId: 'selectTool' });

  const SingleSelectTool = (props: any) => {
    return (
      <Tooltip title="Single Select" disableInteractive>
        <ToolButton
          value={SelectTool.Single}
          size="small"
          onClick={() => {
            store.toolbar.setTool(Tool.Select);
            store.toolbar.setSelectTool(SelectTool.Single);
            popupState.close();
          }}
          {...props}
        >
          <TouchApp />
        </ToolButton>
      </Tooltip>
    );
  };

  const MultiSelectTool = (props: any) => {
    return (
      <Tooltip title="Multiple Select" disableInteractive>
        <ToolButton
          value={SelectTool.Multi}
          size="small"
          onClick={() => {
            store.toolbar.setTool(Tool.Select);
            store.toolbar.setSelectTool(SelectTool.Multi);
            popupState.close();
          }}
          {...props}
        >
          <SelectAll />
        </ToolButton>
      </Tooltip>
    );
  };

  const ActiveTool = useCallback((props: any) => {
    switch (store.toolbar.selectTool) {
      case SelectTool.Single:
        return <SingleSelectTool {...props} />;
      case SelectTool.Multi:
        return <MultiSelectTool {...props} />;
    }
  }, []);

  return (
    <>
      <ActiveTool selected={store.toolbar.tool === Tool.Select} {...bindHover(popupState)} />

      {popupState.isOpen && (
        <Popper {...bindPopper(popupState)} placement="right" transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper sx={{ ml: 0.5 }}>
                <ButtonGroup size="small">
                  <SingleSelectTool
                    selected={store.toolbar.tool === Tool.Select && store.toolbar.selectTool === SelectTool.Single}
                  />
                  <MultiSelectTool
                    selected={store.toolbar.tool === Tool.Select && store.toolbar.selectTool === SelectTool.Multi}
                  />
                </ButtonGroup>
              </Paper>
            </Fade>
          )}
        </Popper>
      )}
    </>
  );
});
