import path from 'path';

/**
 * ## seats-data 디렉토리
 * 1. 좌석 데이터 파일은 프로젝트 폴더 1단계 바깥의 seats-data 디렉토리 안에서 관리한다.
 * - seats.json 에는 실시간 좌석 데이터가 저장된다.
 * - seats_last_week.json 에는 지난주 좌석 데이터가 저장된다.
 * - seats_origin.json 은 원본 좌석 데이터 파일이다. 좌석 초기화 시 이 원본 데이터를 seats.json 에 덮어씌운다.
 *
 * 2. seats-data 디렉토리 내부 seats-history 디렉토리에는 매주 좌석을 초기화 하기 직전 좌석 데이터를 저장한다.
 *
 * 3. seats-data 디렉토리 내부 seats-backup 디렉토리에는 시간대별 좌석 데이터를 백업한다.
 */

export const JSON_DIRECTORY = path.join(__dirname, '../../../seats-data');
export const HISTORY_DIRECTORY = path.join(__dirname, '../../../seats-data/seats-history');
export const BACKUP_DIRECTORY = path.join(__dirname, '../../../seats-data/seats-backup');
export const CURRENT_SEATS = 'seats.json';
export const ORIGIN_SEATS = 'seats_origin.json';
export const LAST_WEEK_SEATS = 'seats_last_week.json';
