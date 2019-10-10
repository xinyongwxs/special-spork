import express from 'express';
import { snkrLogin, ipParser, getJordanList, itemDetail, sendWechatMessage } from './apis/builder';
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
  let statusObjList = {};
  values.forEach(val => {
    let ress = val.data.trim();
    let regx = /<script>window.INITIAL_REDUX_STATE={(.*?)<\/script>/g;
    let stateInfoStrArray = ress.match(regx);
    let stateInfo = JSON.parse(stateInfoStrArray[0].slice(35, -10));
    for (let code in stateInfo.Threads.products) {
      let status = {};
      status['productName'] = stateInfo.Threads.products[code]['fullTitle'];
      status['state'] = stateInfo.Threads.products[code]['state'];
      status['status'] = stateInfo.Threads.products[code]['status'];
      status['styleColor'] = code;
      status['employeePrice'] = stateInfo.Threads.products[code]['employeePrice'];
      status['currentPrice'] = stateInfo.Threads.products[code]['currentPrice'];
      status['firstImageUrl'] = stateInfo.Threads.products[code]['firstImageUrl'];
      status['availableSkus'] = stateInfo.Threads.products[code]['availableSkus'].map(sku => {
        const foundSku = stateInfo.Threads.products[code]['skus'].find(sItem => sku.skuId === sItem.skuId);
        return {
          ...sku,
          nikeSize: foundSku.nikeSize,
          localizedSize: foundSku.localizedSize
        };
      });
      statusObjList[code] = status;
    }
  });
  for (let code in statusObjList) {
    statusList.push(statusObjList[code]);
  }
  return statusList;
};

const getJordanStatusList = (anchor, count) => {
  return getJordanList(anchor, count).then(async result => {
    let productList = result.data.data.products.objects || [];
    let promiseList = [];
    let productNameList = [];
    productList.forEach(product => {
      if (product.rollup.totalThreads === 1) {
          productNameList.push({
            productItemName: product.publishedContent.properties.seo.slug,
            productItemCode: product.productInfo[0].merchProduct.styleColor
          });
      } else if (product.rollup.totalThreads > 1) {
        let curThreads = product.rollup.threads;
        curThreads.forEach(thread => {
          productNameList.push({
            productItemName: thread.publishedContent.properties.seo.slug,
            productItemCode: thread.productInfo[0].merchProduct.styleColor
          });
        });
      }
    });

    promiseList = productNameList.map(obj => itemDetail(obj.productItemName, obj.productItemCode));

    let values = await Promise.all(promiseList);

    const statusList = handleStatusResult(values);

    return statusList;
  });
};

const statusListFormat = (statusList, anchor) => {
  const contentList = statusList.map(itemContent => {
    let skuInfo = itemContent.availableSkus.reduce((acc, cur) => acc += `${cur.localizedSize} `, "available size: ");
    return `product name: ${itemContent.productName}\nstyle code: ${itemContent.styleColor}\ncurrent price: ${itemContent.currentPrice}\nemployee price: ${itemContent.employeePrice}\nproduct state: ${itemContent.state}\n${skuInfo}\n\n`;
  });
  const finalContent = contentList.reduce((acc, curr) => acc += curr, anchor ? `anchor ${anchor}:\n` : "");
  return finalContent;
};

const handleJordanList = async (anchor, count, res) => {
  let statusList = await getJordanStatusList(anchor, count);
  const finalContent = statusListFormat(statusList, anchor);
  sendWechatMessage(finalContent).then(result => {
    if (res)
      res.send(result.data);
    else
      console.log(result.data);
  }).catch(err => {
    if (res)
      res.send(err);
    else
      console.log(err);
  });
};

let latestStatusList = [];

let getJordanListInterval = null;



router.get('/startInterval', (req, res) => {
  getJordanListInterval = setInterval(async () => {
    let anchor = 0;
    let count = 10;
    let result = [];
    let isError = false;
    while (anchor < 100) {
      console.log('start anchor: ' + anchor);
      try {
        let statusList = await getJordanStatusList(anchor, count);
        console.log('end anchor: ' + anchor);
        result = result.concat(statusList);
        anchor += count;
      } catch(e) {
        // console.log(e);
        // let err = e;
        isError = true;
        break;
      }
    }
    if (isError) {
      console.log("\nRequest error! End this round.");
      return;
    }
    if (latestStatusList.length === 0) {
      latestStatusList = result;
    } else if (latestStatusList.length > 0) {
      let newShoes = [];
      let replenishedShoes = [];
      result.forEach(shoes => {
        let isIn = false;
        latestStatusList.some(old => {
          if (old.styleColor === shoes.styleColor) {
            isIn = true;
            if (old.availableSkus.length < shoes.availableSkus.length) {
              replenishedShoes.push(shoes);
            }
            return true;
          }
        });
        if (isIn === false) {
          newShoes.push(shoes);
        }
      });
      if (replenishedShoes.length > 0) {
        sendWechatMessage("Replenished shoes:\n" + statusListFormat(replenishedShoes));
      }

      if (newShoes.length > 0) {
        sendWechatMessage("New shoes:\n" + statusListFormat(newShoes));
      }

      latestStatusList = result;
      console.log("latest Jordan shoes number:\n" + latestStatusList.length + "\n\n\n");
      // console.log("latest Jordan shoes status:\n" + statusListFormat(latestStatusList));
    }
  }, 60000);
  res.send('Start successfully!');
});


router.get('/stopInterval', (req, res) => {
  clearInterval(getJordanListInterval);
  res.send('Stop successfully!');
});

router.post('/wechat/callback', (req, res) => {
  const uidInfo = req.body;
  res.send(uidInfo);
});

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
  handleJordanList(anchor, count, res);
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
