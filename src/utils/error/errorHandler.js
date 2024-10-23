import { ErrorCodes } from "./errorCodes.js";

export const handleError = (socket, error) => {
// 에러 생긴다고 서버 내려가면 안되니까 try-catch로 받아줄 것 

let responseCode;
let message;

console.error(error)

if(error.code) {
    responseCode = error.code;
    message = error.message;
    console.error(`에러코드: ${responseCode}, 메시지: ${message}`)
} else {
    responseCode = ErrorCodes.SOCKET_ERROR;
    message = error.message;
    console.error(`일반 에러: ${responseCode}`)
}

const errorResponse = createResponse(-1, responseCode, {message}, null);
socket.write(errorResponse);

}