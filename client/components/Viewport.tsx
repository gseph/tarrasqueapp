import { PixiComponent, useApp } from '@inlet/react-pixi';
import { observer } from 'mobx-react-lite';
import { Viewport as PixiViewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import React from 'react';

import { store } from '../store';

export interface ViewportProps {
  worldWidth: number;
  worldHeight: number;
  screenWidth: number;
  screenHeight: number;
  onSingleClick: (event: PIXI.InteractionEvent) => void;
  onDoubleClick: (event: PIXI.InteractionEvent) => void;
  onRightClick: (event: PIXI.InteractionEvent) => void;
  children: React.ReactNode;
}

export interface PixiComponentViewportProps extends ViewportProps {
  app: PIXI.Application;
  isTrackpad: boolean;
}

const PixiComponentViewport = PixiComponent('Viewport', {
  applyProps: (viewport: PixiViewport, oldProps: PixiComponentViewportProps, newProps: PixiComponentViewportProps) => {
    if (oldProps.isTrackpad !== newProps.isTrackpad) {
      viewport.wheel({ trackpadPinch: true, wheelZoom: !newProps.isTrackpad });
    }
  },
  didMount: (viewport: PixiViewport) => {
    setTimeout(() => {
      if (!viewport.transform) return;
      viewport.fit();
      viewport.moveCenter(viewport.worldWidth / 2, viewport.worldHeight / 2);
    }, 10);
  },
  create: (props: PixiComponentViewportProps) => {
    const viewport = new PixiViewport({
      ticker: props.app.ticker,
      passiveWheel: false,
      interaction: props.app.renderer.plugins.interaction,
      disableOnContextMenu: true,
    });
    viewport.drag().pinch().wheel({ trackpadPinch: true, wheelZoom: false }).clampZoom({ minScale: 0.1 });

    let clicks = 0;
    let pressed = false;
    let clickTimer: ReturnType<typeof setTimeout>;
    let longPressTimer: ReturnType<typeof setTimeout>;
    const doubleClickTimespan = 500;
    const longPressTimespan = 500;

    viewport.on('pointerdown', (event) => {
      if (event.data.originalEvent.button === 2) {
        props.onRightClick(event);
        return;
      }
      pressed = true;
      clicks++;
      if (clicks === 1) {
        store.map.setContextMenuVisible(false);
        clickTimer = setTimeout(() => {
          clicks = 0;
          if (!pressed) {
            props.onSingleClick(event);
          }
        }, doubleClickTimespan);
      } else if (clicks === 2) {
        clicks = 0;
        clearTimeout(clickTimer);
        props.onDoubleClick(event);
      }
      longPressTimer = setTimeout(() => {
        props.onRightClick(event);
      }, longPressTimespan);
    });

    viewport.on('drag-start', () => {
      clicks = 0;
      clearTimeout(clickTimer);
    });

    viewport.on('pointermove', () => {
      clicks = 0;
      clearTimeout(longPressTimer);
    });

    viewport.on('pointerup', () => {
      pressed = false;
      clearTimeout(longPressTimer);
    });

    store.app.setViewport(viewport);

    return viewport;
  },
});

export const Viewport = observer((props: ViewportProps) => {
  const app = useApp();
  return <PixiComponentViewport app={app} isTrackpad={store.app.isTrackpad} {...props} />;
});
