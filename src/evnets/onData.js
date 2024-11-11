import { config } from '../config/config.js';
import { PACKET_TYPE, TOTAL_LENGTH } from '../constants/header.js';
import { getUserById, getUserBySocket } from '../../src/session/user.session.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { handleError } from '../utils/error/errorHandler.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { getHandlerById } from '../handlers/index.js';
import { getProtoMessages } from '../init/loadProtos.js';

// 데이터 스트림이라는 개념을 알아야 함 - 청크라는 단위로 파일을 주고 받음
export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  // 버퍼에 최소한 전체 헤더 이상의 데이터가 있을 때만 패킷 처리
  while (socket.buffer.length >= totalHeaderLength) {
    const length = socket.buffer.readUInt32BE(0);
    const packetType = socket.buffer.readUInt8(config.packet.totalLength);

    if (socket.buffer.length >= length) {
      const packet = socket.buffer.subarray(totalHeaderLength, length);
      socket.buffer = socket.buffer.subarray(length);

      console.log(`length: ${length}, packetType: ${packetType}`);
      console.log(`packet: ${packet}`);

      try{
        switch (packetType) {
          case PACKET_TYPE.PING:
            {
              const protoMessages = getProtoMessages();
              const Ping = protoMessages.common.Ping;
              const pingMessage = Ping.decode(packet);
              const user = getUserBySocket(socket);
              if (!user) {
                throw new CustomError(ErrorCodes.USER_NOT_FOUND, '소켓에 해당하는 유저가 없습니다');
              }
              user.handlePong(pingMessage);
            }
            break; 
          case PACKET_TYPE.NORMAL:
            const { handlerId, userId, payload, sequence } = packetParser(packet);
            console.log('handlerId?', handlerId)
            
            const user = getUserById(userId);
            if(user && user.sequence !== sequence) {
              throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '잘못된 호출 값입니다.');
            }
  
            const handler = getHandlerById(handlerId);
            await handler({socket, userId, payload});
        }
      } catch (e) {
        handleError(socket, e);
      }
    } else {
      // 아직 전체 패킷 도착하지 않은 상태
      break;
    }
  }
};
