import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getGameSession } from '../../session/game.session.js';
import { getUserById } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const joinGameHandler = ({ socket, userId, payload }) => {
  try {
    const { gameId } = payload;
    const gameSession = getGameSession(gameId);

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다');
    }

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    // 이미 세션에 참여중인 유저가 보낸 요청일 수도 있으니 한번 더 검증 - 없다면 게임 세션에 넣어준다
    // gameSession이 new Game()으로 만들어지는 Game클래스의 인스턴스라서 클래스 메서드를 쓰는 것
    const existUser = gameSession.getUser(user.id)
    if (!existUser) {
      gameSession.addUser(user);
    }

    const joinGameResponse = createResponse(
      HANDLER_IDS.JOIN_GAME,
      RESPONSE_SUCCESS_CODE,
      { gameId, message: '게임에 참가했습니다' },
      user.Id,
    );

    socket.write(joinGameResponse);
  } catch (e) {
    handleError(socket, e);
  }
};

export default joinGameHandler;
