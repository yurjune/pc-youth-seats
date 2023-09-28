import fs from 'fs';
import schedule from 'node-schedule';

import { getYearMonthDate, getKoreanTime } from './utils';
import {
  CURRENT_SEATS,
  ORIGIN_SEATS,
  LAST_WEEK_SEATS,
  BACKUP_DIRECTORY,
  HISTORY_DIRECTORY,
  JSON_DIRECTORY,
} from './constants';

const resetAllSeats = () => {
  fs.readFile(`${JSON_DIRECTORY}/${ORIGIN_SEATS}`, 'utf8', (err, result) => {
    if (err) return console.log('시온채플 좌석 리셋 실패');

    fs.writeFile(`${JSON_DIRECTORY}/${CURRENT_SEATS}`, result, (err) => {
      if (err) return console.log('시온채플 좌석 리셋 실패');

      lateSeatIds = [];
      absentSeatIds = [];
      console.log('시온채플 좌석 리셋 완료');
    });
  });
};

const saveLastWeekSeats = () => {
  fs.readFile(`${JSON_DIRECTORY}/${CURRENT_SEATS}`, 'utf8', (err, result) => {
    if (err) return console.log(`좌석 히스토리 저장 실패`);

    fs.writeFile(`${JSON_DIRECTORY}/${LAST_WEEK_SEATS}`, result, (err) => {
      if (err) return console.log(`지난주 좌석 저장 실패`);
      console.log('지난주 좌석 저장 완료');
    });

    if (!fs.existsSync(HISTORY_DIRECTORY)) {
      fs.mkdirSync(HISTORY_DIRECTORY);
    }

    fs.writeFile(`${HISTORY_DIRECTORY}/seats_${getYearMonthDate()}.json`, result, (err) => {
      if (err) return console.log(`좌석 히스토리 저장 실패`);
      console.log(`좌석 히스토리 저장 완료`);
    });
  });
};

const backupSeats = () => {
  fs.readFile(`${JSON_DIRECTORY}/${CURRENT_SEATS}`, 'utf8', (err, result) => {
    if (err) return console.log(`좌석 백업 실패`);

    const { hour } = getKoreanTime();

    if (!fs.existsSync(BACKUP_DIRECTORY)) {
      fs.mkdirSync(BACKUP_DIRECTORY);
    }

    fs.writeFile(`${BACKUP_DIRECTORY}/seats_backup_${hour}.json`, result, (err) => {
      if (err) return console.log(`좌석 백업 실패`);
    });
  });
};

const enrollSchedules = () => {
  // 초 분 시간 일 월 요일
  const MONDAY_MIDNIGHT = '00 00 00 * * 1';
  const EVERY_HOUR = '00 00 * * * *';

  schedule.scheduleJob(MONDAY_MIDNIGHT, () => {
    resetAllSeats();
    saveLastWeekSeats();
  });

  schedule.scheduleJob(EVERY_HOUR, backupSeats);
};

export default enrollSchedules;
