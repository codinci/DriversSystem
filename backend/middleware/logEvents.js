const { v4: uuidv4 } = require("uuid");
const { format } = require("date-fns");
const fsPromises= require('fs').promises;
const path= require('path');
const fs= require('fs');

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.error(err);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  next();
};

module.exports = { logEvents, logger };
