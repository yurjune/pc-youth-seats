const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../samples/seats_origin.json');

const seatActiveConvertMap = {
  0: 5, // PATH
  1: 0, // VACANT
  4: 2, // PRIVATE
  6: 4, // INVISIBLE
};

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

Object.keys(data).forEach((lineKey) => {
  data[lineKey].forEach((seat) => {
    if (Object.hasOwn(seatActiveConvertMap, seat.seat_active)) {
      seat.seat_active = seatActiveConvertMap[seat.seat_active];
    }
  });
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
