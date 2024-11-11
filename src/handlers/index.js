import { HANDLER_IDS } from '../constants/handlerIds.js';
import initialHandler from './user/initial.handler.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import createGameHandler from './game/createGame.hanlder.js';
import joinGameHandler from './game/joinGame.handler.js';
import updateLocationHandler from './game/updateLocation.handler.js';

const handlers = {
  [HANDLER_IDS.INITIAL]: {
    handler: initialHandler,
    protoType: 'initial.InitialPacket',
  },

  [HANDLER_IDS.CREATE_GAME]: {
    handler: createGameHandler,
    protoType: 'game.CreateGamePayload',
  },

  [HANDLER_IDS.JOIN_GAME]: {
    handler: joinGameHandler,
    protoType: 'game.JoinGamePayload',
  },

  [HANDLER_IDS.UPDATE_LOCATION]: {
    handler: updateLocationHandler,
    protoType: 'game.updateLocationPayload',
  },


};

export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러 ID를 찾을 수 없습니다. ID: ${handlerId}`,
    );
  }
  return handlers[handlerId].handler;
};

// 패킷파서에서 호출하고 있고, 거기서 에러처리 하므로 딱히 여기서 안 해줘도 되지만, 일단 해준다
export const getPrototypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `프로토타입 이름을 찾을 수 없습니다. ID: ${handlerId}`,
    );
  }
  return handlers[handlerId].protoType;
};
