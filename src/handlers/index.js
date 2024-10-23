import { HANDLER_IDS } from '../constants/handlerIds.js';
import initialHandler from './user/initial.handler.js';
import CustomError from '../utils/error/custom.error.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';

const handlers = {
  [HANDLER_IDS.INITIAL]: {
    handler: initialHandler,
    protoType: 'initial.InitialPacket',
  },
};

export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러 ID를 찾을 수 없습니다. ID: ${handlerId}`,
    );
  }
  return handlers[handlerId];
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
