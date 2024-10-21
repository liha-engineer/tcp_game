// 중앙 집중식 관리 - 이 곳에 모든 환경변수 선언하여 사용

import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 7272;
export const HOST = process.env.HOST || 'localhost';
export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';
