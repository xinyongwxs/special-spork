import express from 'express';
import { snkrLogin, ipParser, getJordanList, itemDetail } from './apis/builder';
import { checkIsCompanyIp } from './dao/ipBlacklist';
import moment from 'moment';
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/jordan/list', (req, res) => {
  let anchor = req.query.anchor || null;
  let count = req.query.count || null;
  getJordanList(anchor, count).then(result => {
    let ress = result.data;
    res.send(ress);
  })
  .catch(error => res.send(error.response && error.response.status || 500, error.response && error.response.data || error.response.message));
});

const handleStatusResult = values => {
  let statusList = [];
  statusList = values.map(val => {
    let status = {};
    let ress = val.data.trim();
    let regx = /<script>window.INITIAL_REDUX_STATE={(.*?)<\/script>/g;
    let stateInfoStrArray = ress.match(regx);
    let stateInfo = JSON.parse(stateInfoStrArray[0].slice(35, -10));
    for (let code in stateInfo.Threads.products) {
      status['productName'] = stateInfo.Threads.products[code]['fullTitle'];
      status['styleColor'] = code;
      status['availableSkus'] = stateInfo.Threads.products[code]['availableSkus'];
    }
    return status;
  });
  return statusList;
};

router.get('/item/detail', (req, res) => {
  let itemName = req.query.itemName || null;
  let itemCode = req.query.itemCode || null;
  itemDetail(itemName, itemCode).then(result => {
    let ress = result.data.trim();
    let regx = /<script>window.INITIAL_REDUX_STATE={(.*?)<\/script>/g;
    let stateInfoStrArray = ress.match(regx);
    let stateInfo = JSON.parse(stateInfoStrArray[0].slice(35, -10));
    res.send(stateInfo.Threads.products);
  }).catch(error => res.send(error.response && error.response.status || 500, error.response && error.response.data || error.response.message));
});

router.get('/jordan/products/status', (req, res) => {
  let anchor = req.query.anchor || null;
  let count = req.query.count || null;
  getJordanList(anchor, count).then(result => {
    let productList = result.data.data.products.objects || [];
    let promiseList = [];
    promiseList = productList.map(product => {
      let productItemName = product.publishedContent.properties.seo.slug;
      let productItemCode = product.productInfo[0].merchProduct.styleColor;
      return itemDetail(productItemName, productItemCode);
    });

    Promise.all(promiseList).then(values => {
      const statusList = handleStatusResult(values);
      res.send(statusList);
    }).catch(error => res.send(error.response));
  });
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
  const address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  checkIsCompanyIp(address).then(result => {
    res.send({
      ...result[0],
      remoteAddress: address
    });
  }).catch(result => {
    res.send(500, {
      remoteAddress: address,
      error: error
    });
  });
});

router.get('/testDate', (req, res) => {
  let testStr = "2019-09-08 00:00:00+08:00";
  let testMomentTime = new moment(testStr);
  console.log(testMomentTime);
});

export default router;
