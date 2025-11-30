// server/middleware/uploadMiddleware.js
const multer = require('multer');


const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file size
});

module.exports = upload;