import { config } from '../config/config.js';

// 데이터 스트림이라는 개념을 알아야 함 - 청크라는 단위로 파일을 주고 받음
export const onData = (socket) => (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  while (socket.buffer.length >= totalHeaderLength) {
    const length = socket.buffer.readUInt32BE(0);
    const packetType = socket.buffer.readUInt8(config.packet.totalLength);

    if (socket.buffer.length >= length) {
      const packet = socket.buffer.subarray(totalHeaderLength, length);
      socket.buffer = socket.buffer.subarray(length);

      console.log(`length: ${length}, packetType: ${packetType}`);
      console.log(`packet: ${packet}`);
    } else {
      // 아직 전체 패킷 도착하지 않은 상태
      break;
    }
  }
};
