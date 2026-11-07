const path = require('path');
const express = require('express');

const router = express.Router();

function sendPage(req, res, fileName) {
  return res.sendFile(
    path.join(req.app.locals.publicDir, fileName)
  );
}

router.get('/', (req, res) => {
  return sendPage(req, res, 'index.html');
});

router.get('/about', (req, res) => {
  return sendPage(req, res, 'about.html');
});

router.get('/contact', (req, res) => {
  return sendPage(req, res, 'contact.html');
});

router.get('/blog', (req, res) => {
  return sendPage(req, res, 'blog.html');
});

module.exports = router;