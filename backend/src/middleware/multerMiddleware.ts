import multer from 'multer';
import * as fs from 'fs';
import path from 'path';

const tempStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      // store image files in a temporary directory which later renames to mongoDB id
      const folderPath = `./upload/images/tempDir`;

      if (!fs.existsSync(folderPath)) {
        // If the directory doesn't exist, create it
        fs.mkdirSync(folderPath, { recursive: true });
      }

      cb(null, folderPath);
    } catch (error) {
      console.log(error);
    }
  },
  filename: (req, file, cb) => {
    const filename = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const tempUpload = multer({ storage: tempStorage });

export { tempUpload };
