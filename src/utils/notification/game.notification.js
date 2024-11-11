import { getProtoMessages } from '../../init/loadProtos.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';

const makeNotification = (message, type) => {
  // 패킷 길이 정보를 포함한 버퍼 생성
  const packetLength = Buffer.alloc(config.packet.totalLength);
    packetLength.writeUInt32BE(
    message.length + config.packet.totalLength + config.packet.typeLength,
    0,
  );
  
  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(type, 0);

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([packetLength, packetType, message]);
};

export const createLocationPacket = (users) => {
    const protoMessage = getProtoMessages();
    const Location = protoMessage.gameNotification.LocationUpdate;

    const payload = { users };
    const message = Location.create(payload)
    const locationPacket = Location.encode(message).finish();
    
    return makeNotification(locationPacket, PACKET_TYPE.LOCATION)
  }

  export const gameStartNotification = (gameId, timestamp) => {
    const protoMessage = getProtoMessages();
    const Start = protoMessage.gameNotification.Start;

    const payload = { gameId, timestamp };
    const message = Location.create(payload)
    const gameStartPacket = Location.encode(message).finish();
    
    return gameStartNotification(gameStartPacket, PACKET_TYPE.GAME_START)
  }



export const createPingPacket = (timestamp) => {
  const protoMessages = getProtoMessages();
  const ping = protoMessages.common.Ping;

  const payload = { timestamp };
  const message = ping.create(payload);
  const pingPacket = ping.encode(message).finish();

  return makeNotification(pingPacket, PACKET_TYPE.PING);
};