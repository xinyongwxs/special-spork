import express from 'express';
import { snkrLogin, ipParser } from './apis/builder';
import { checkIsCompanyIp } from './dao/ipBlacklist';
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/user/add', (req, res) => {
   snkrLogin({
      userName: req.body.userName || "",
      password: req.body.password || "",
      clientId: req.body.clientId || "G64vA0b95ZruUtGk1K0FkAgaO3Ch30sj",
      uxId: "com.nike.commerce.snkrs.ios",
      grantType: "password"
    }).then((result) => res.send(result.data))
    .catch(error => res.send(error.response && error.response.status || 500, error.response && error.response.data || error.response.message));
});

router.post('/ip/parser', (req, res) => {
  ipParser(req.body.ip)
  .then(result => res.send(result.data))
  .catch(error => res.send(error.response && error.response.status || 500, error.response && error.response.data || error.response.message));
});

router.get('/ip/blackone', (req, res) => {
  checkIsCompanyIp(req.query.ip)
  .then(result => res.send(result[0]))
  .catch(error => res.send(500, error));
});

router.get('/test', (req, res) => {
  res.send("hello world!");
});

export default router;