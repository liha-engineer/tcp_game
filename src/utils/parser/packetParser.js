import { config } from '../../config/config.js';
import { getPrototypeNameByHandlerId } from '../../handlers/index.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import CustomError from '../error/customError.js'
import { ErrorCodes } from '../error/errorCodes.js';

export const packetParser = (data) => {
  const protoMessages = getProtoMessages();

  // 공통 패킷 구조 디코딩
  const Packet = protoMessages.common.Packet;
  let packet;

  try {
    packet = Packet.decode(data);
  } catch (e) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생하였습니다.');
  }

  // common.proto의 패킷 파싱하는 부분
  const handlerId = packet.handlerId;
  const userId = packet.userId;
  const clientVersion = packet.clientVersion;
  // 페이로드가 파싱되지 않고 그대로 던지고 있었음
  const sequence = packet.sequence;

  if (clientVersion !== config.client.version) {
    throw new CustomError(
      ErrorCodes.CLIENT_VERSION_MISMATCH,
      '클라이언트 버전이 일치하지 않습니다.',
    );
  }

  // common.proto의 페이로드 파싱 코드 추가
  const protoTypeName = getPrototypeNameByHandlerId(handlerId);

  if (!protoTypeName) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      '프로토타입 이름을 가져오는데 실패했습니다.',
    );
  }

  // handler의 index.js에서 prototype이 initial.InitialPacket 이므로 .을 기준으로 split
  const [namespace, typeName] = protoTypeName.split('.');

  // 상단의 공통패킷구조 디코딩 형식을 취함
  const payloadType = protoMessages[namespace][typeName];
  let payload;

  try {
    // 페이로드 디코딩 해서 역직렬화 해서 보내주고 있음
    payload = payloadType.decode(packet.payload);
  } catch (e) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생하였습니다.');
  }

  const errorMessage = payloadType.verify(payload);
  if (errorMessage) {
    throw new CustomError(ErrorCodes.PACKET_STRUCTURE_MISMATCH, '패킷 구조에 오류가 있습니다.');
  }

  // 필드가 비어있는 경우 - common.proto의 필수필드가 누락되었을 때
  const expectedFields = Object.keys(payloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));

  if (missingFields.length > 0) {
    throw new CustomError(
      ErrorCodes.MISSING_FIELDS,
      `필수 필드가 누락되었습니다. ${missingFields.join(', ')}`,
    );
  }

  return { handlerId, userId, payload, sequence };
};
