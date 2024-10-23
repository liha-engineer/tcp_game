import { HANDLER_IDS } from '../constants/handlerIds.js';
import initialHandler from './user/initial.handler.js';

const handlers = {
  [HANDLER_IDS.INITIAL]: {
    handler: initialHandler,
    protoType: 'initial.InitialPacket',
  },
};

export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    console.error(`No handler found - ID: ${handlerId}`);
  }
  return handlers[handlerId];
};

export const getPrototypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    console.error(`No Prototype Name found - ID: ${handlerId}`);
  }
  return handlers[handlerId].protoType;
};
