import mysql from 'mysql2/promise';
import { config } from '../config/config.js';
import { formatDate } from '../utils/dateFormatter.js';

const { database } = config;

const createPool = (dbConfig) => {
  const pool = mysql.createPool({
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.name,
    host: dbConfig.host,
    port: dbConfig.port,
    waitForConnections: true,
    connectionLimit: 10, // 커넥션 풀에서 최대 연결 수
    queueLimit: 0, // 0일 경우 무제한 대기열
  });

  // prisma 쓸때 남았던 쿼리로그 같은 걸 셀프로 만들어줄 것
  const originQuery = pool.query;

  pool.query = (sql, params) => {
    const date = new Date();

    console.log(
      `[${formatDate(date)}] Executing query : ${sql} ${params ? `${JSON.stringify(params)}` : ``}`,
    );

    return originQuery.call(pool, sql, params);

  };

  return pool;
};

const pools = {
  GAME_DB: createPool(database.GAME_DB),
  USER_DB: createPool(database.USER_DB),
}

export default pools;