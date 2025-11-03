const multer = require('multer');
const path = require('path');

// Multer storage config (memory for direct Cloudinary upload)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images, audio, video, and 3D model files
  const allowed = [
    'image/jpeg', 'image/png', 'image/webp',
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
    'model/gltf-binary', 'model/gltf+json', 'application/octet-stream',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
