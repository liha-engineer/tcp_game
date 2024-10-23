import { handleError } from "../utils/error/errorHandler.js";
import CustomError from "../utils/error/custom.error.js";
import { removeUser } from "../session/user.session.js";


export const onError = (socket) => (err) => {
  console.error('Socket error:', err);
  handleError(socket, new CustomError(500, `소켓 에러 : ${err.message}`))

  // 세션에서 유저 삭제 - 에러 발생했으면 연결 끊음
  removeUser(socket);
};
