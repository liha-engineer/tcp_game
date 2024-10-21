import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prodobuf from 'protobufjs';

// 현재 파일의 절대경로
const __filename = fileURLToPath(import.meta.url);
// 파일이름 빼고 디렉토리 경로만 찾기
const __dirname = path.dirname(__filename);
const protoDir = path.join(__dirname, '../protobuf');

const getAllProtoFiles = (dir, fileList = []) => {
  // 경로 받았으니 파일 디렉토리 읽어옴
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    // 디렉토리 읽었을 때 파일이 아니라 디렉토리라면 다시 읽도록 재귀 호출
    if (fs.statSync(filePath).isDirectory()) {
      getAllProtoFiles(filePath, fileList);
      // 파일의 확장자가 .proto일 때만 filePath를 fileList 배열에 push
    } else if (path.extname(file) === '.proto') {
      fileList.push(filePath);
    }
  });

  return fileList;
};

const protoFiles = getAllProtoFiles(protoDir);

const protoMessages = {};

export const loadProtos = async () => {
  try {
    // root 인스턴스 생성
    const root = prodobuf.Root();
    await Promise.all(protoFiles.map((file) => root.load(file)));

    console.log('Protobuf 파일 로드 완료');
  } catch (e) {
    console.error(`Protobuf 파일 로드 중 오류 발생`, e);
  }
};
