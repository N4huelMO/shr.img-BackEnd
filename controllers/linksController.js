const Link = require("../models/Link");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.newLink = async (req, res, next) => {
  // Show express validator error message
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { original_name, password, downloads, name } = req.body;

  const link = new Link();

  // Create link obj
  link.url = shortid.generate();
  link.name = name;
  link.original_name = original_name;

  if (req.user) {
    // Set downloads, password and author
    if (downloads) {
      link.downloads = downloads;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      link.password = await bcrypt.hash(password, salt);
    }

    link.author = req.user.id;
  }

  // Save to DB
  try {
    await link.save();
    res.json({ msg: `${link.url}` });
    next();
  } catch (error) {
    console.log(error);
  }
};

// Get list of all links
exports.allLinks = async (req, res) => {
  try {
    const links = await Link.find({}).select("url -_id");

    res.json({ links });
  } catch (error) {
    console.log(error);
  }
};

// Return if link has password
exports.hasPassword = async (req, res, next) => {
  const { url } = req.params;

  // Check the link exist
  const link = await Link.findOne({ url });

  if (!link) {
    res.status(404).json({ msg: "Link doesn't exist" });
    return;
  }

  if (link.password) {
    return res.json({ password: true, link: link.url });
  }

  next();
};

exports.verifyPassword = async (req, res, next) => {
  const { url } = req.params;
  const { password } = req.body;

  // Check the link
  const link = await Link.findOne({ url });

  // Verify password
  if (bcrypt.compareSync(password, link.password)) {
    // Allow the download
    next();
  } else {
    return res.status(401).json({ msg: "Wrong Password" });
  }
};

// Get link
exports.getLink = async (req, res, next) => {
  const { url } = req.params;

  // Check the link exist
  const link = await Link.findOne({ url });

  if (!link) {
    res.status(404).json({ msg: "Link doesn't exist" });
    return next();
  }

  // If the link exist
  res.json({ file: link.name, password: false });

  next();
};
