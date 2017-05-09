const fs = require('fs');

const dotenvFilePath = `${__dirname}/../../lib/.env`;
const sampleFilePath = `${__dirname}/sample.env`;

if (!fs.existsSync(dotenvFilePath)) {
  fs.createReadStream(sampleFilePath).pipe(fs.createWriteStream(dotenvFilePath));
}
