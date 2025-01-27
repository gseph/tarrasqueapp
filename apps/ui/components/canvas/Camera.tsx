import { useApp } from '@pixi/react';
import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import React, { useEffect, useState } from 'react';
import useLocalStorage from 'use-local-storage';

import { SocketEvent } from '@tarrasque/common';

import { useGetUser } from '../../hooks/data/auth/useGetUser';
import { useGetMap } from '../../hooks/data/maps/useGetMap';
import { useWindowSize } from '../../hooks/useWindowSize';
import { socket } from '../../lib/socket';
import { tarrasque } from '../../lib/tarrasque';
import { store } from '../../store';
import { CameraBase } from './CameraBase';

interface CameraProps {
  mapId: string;
  width: number;
  height: number;
  children?: React.ReactNode;
}

export function Camera({ mapId, width, height, children }: CameraProps) {
  const { data: map } = useGetMap(mapId);
  const { data: user } = useGetUser();

  const app = useApp();
  const windowSize = useWindowSize();

  // Get the camera position from local storage
  const [position, setPosition] = useLocalStorage(`map-position/${mapId}`, {
    x: width / 2,
    y: height / 2,
    scale: Math.min(windowSize.width / width, windowSize.height / height),
  });

  const [mounted, setMounted] = useState(false);

  // Center the viewport on the map when it is first rendered
  useEffect(() => {
    if (mounted) return;

    store.pixi.viewport.animate({
      position: {
        x: position.x,
        y: position.y,
      },
      scale: position.scale,
      time: 0,
    });

    setMounted(true);
  }, [position]);

  const membership = user?.memberships.find((membership) => membership.campaignId === map?.campaignId);

  /**
   * Handle the load event
   * @param viewport - The viewport instance
   */
  function handleLoad(viewport: Viewport) {
    console.debug('Map loaded.');
    store.pixi.setViewport(viewport);
  }

  /**
   * Hide the context menu before a single click event
   */
  function handleBeforeSingleClick() {
    console.debug('Before Single Click.');
    store.map.setContextMenuVisible(false);
  }

  /**
   * Handle the click event
   */
  function handleSingleClick() {
    console.debug('Single Click.');
  }

  /**
   * Handle the double click event
   * @param event - The interaction event
   */
  function handleDoubleClick(event: PIXI.FederatedPointerEvent) {
    console.debug('Double Click.', event.global);

    // Get the position of the double click event relative to the map
    const position = store.pixi.viewport.toWorld(event.global.x, event.global.y);

    socket.emit(SocketEvent.PING_LOCATION, {
      position,
      color: membership?.color || '#000000',
      mapId,
      userId: user?.id || '',
    });

    tarrasque.emit(SocketEvent.PING_LOCATION, {
      position,
      color: membership?.color || '#000000',
      mapId,
      userId: user?.id || '',
    });
  }

  /**
   * Handle the right click event
   * @param event - The interaction event
   */
  function handleRightClick(event: PIXI.FederatedPointerEvent) {
    console.debug('Right Click.', event.global);
    store.map.setContextMenuVisible(false);
    // Update the app state with the global coordinates of the right click event
    store.map.setContextMenuAnchorPoint(event.global.x, event.global.y);
    store.map.setContextMenuVisible(true);
  }

  /**
   * Update the camera position state when the viewport is moved
   * @param viewport - The viewport instance
   */
  function handleMove(viewport: Viewport) {
    console.debug('Move.');
    const newPosition = {
      x: viewport.center.x,
      y: viewport.center.y,
      scale: (viewport.scale.x + viewport.scale.y) / 2,
    };
    setPosition(newPosition);
  }

  return (
    <CameraBase
      worldWidth={width}
      worldHeight={height}
      screenWidth={windowSize.width}
      screenHeight={windowSize.height}
      events={app.renderer.events}
      onLoad={handleLoad}
      onBeforeSingleClick={handleBeforeSingleClick}
      onSingleClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      onRightClick={handleRightClick}
      onMove={handleMove}
    >
      {children}
    </CameraBase>
  );
}
