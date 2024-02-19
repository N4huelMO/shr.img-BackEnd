const multer = require("multer");
const shortId = require("shortid");
const fs = require("fs");
const Link = require("../models/Link");

exports.newFile = async (req, res, next) => {
  const multerConfig = {
    limits: { fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024 },
    storage: (fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname + "/../uploads");
      },
      filename: (req, file, cb) => {
        const extension = file.originalname.substring(
          file.originalname.lastIndexOf("."),
          file.originalname.length
        );

        cb(null, `${shortId.generate()}${extension}`);
      },
    })),
  };

  const upload = multer(multerConfig).single("file");

  upload(req, res, async (error) => {
    if (!error) {
      res.json({ file: req.file.filename });
    } else {
      console.log(error);
      return next();
    }
  });
};

exports.deleteFile = async (req) => {
  try {
    fs.unlinkSync(__dirname + `/../uploads/${req.file}`);
  } catch (error) {
    console.log(error);
  }
};

// Download the file

exports.download = async (req, res, next) => {
  const { file } = req.params;

  // get link
  const link = await Link.findOne({ name: file });

  const downloadFile = __dirname + "/../uploads/" + file;

  res.download(downloadFile);

  // Delete file and db entrance
  const { downloads, name } = link;

  if (downloads === 1) {
    // Delete db entry

    req.file = name;

    await Link.findOneAndDelete(link.id);

    next();
  } else {
    // Decrease 1 if the downloads if more than 1
    link.downloads--;

    await link.save();
  }
};
