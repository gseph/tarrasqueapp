import { enableStaticRendering } from 'mobx-react-lite';

import { appStore } from './app';
import { mapStore } from './maps';
import { mediaStore } from './media';
import { nonPlayerCharacterStore } from './nonPlayerCharacters';
import { pixiStore } from './pixi';
import { playerCharacterStore } from './playerCharacters';
import { pluginStore } from './plugins';
import { tokenStore } from './tokens';
import { toolbarStore } from './toolbar';

const isServer = typeof window === 'undefined';
enableStaticRendering(isServer);

export const store = {
  app: appStore,
  maps: mapStore,
  media: mediaStore,
  nonPlayerCharacters: nonPlayerCharacterStore,
  pixi: pixiStore,
  playerCharacters: playerCharacterStore,
  plugins: pluginStore,
  tokens: tokenStore,
  toolbar: toolbarStore,
};

if (!isServer) {
  window.store = store;
}
