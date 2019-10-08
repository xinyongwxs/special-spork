import axios from 'axios';

export const snkrLogin = (param) => {
    const loginInstance = axios.create({
        baseURL: "https://s3.nikecdn.com",
        headers:{
            "Content-Type": "application/json",
            Accept: "*/*",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
            Referer: `https://s3.nikecdn.com/unite/mobile.html?mid=82331612245721271950221653843842822254?iOSSDKVersion=3.0.0&clientId=${param.clientId}&uxId=${param.uxId}&view=none&locale=zh_CN&backendEnvironment=identity`,
            "Accept-Language": "en-us"
        }
    });
    return loginInstance.request({
        url: `login?appVersion=620&experienceVersion=518&uxid=${param.uxId}&locale=zh_CN&backendEnvironment=identity&browser=Apple%20Computer%2C%20Inc.&os=undefined&mobile=true&native=true&visit=1&visitor=fc68c261-93f6-4816-91d4-e04d5fdf523f`,
        method: "post",
        data: {
            "username": param.userName,
            "password": param.password,
            "client_id": param.clientId,
            "ux_id": param.uxId,
            "grant_type": param.grantType
        }
    });
};

export const getJordanList = (anchor, count) => {
    if (anchor == null && count == null) return new Promise();
    const url = 'https://www.nike.com/w/graphql?queryid=products&anonymousId=70CA4D63D5ABB39F9C55BF761D308A28&endpoint=%2Fproduct_feed%2Frollup_threads%2Fv2%3Ffilter%3Dmarketplace(CN)%26filter%3Dlanguage(zh-Hans)%26filter%3DemployeePrice(true)%26filter%3DattributeIds(16633190-45e5-4830-a068-232ac7aea82c%2C498ac76f-4c2c-4b55-bbdc-dd37011887b1)%26anchor%3D' + anchor + '%26count%3D' + count + '%26consumerChannelId%3Dd9a5bc42-4b9c-4976-858a-f159cf99c647';
    return axios.get(url, {
        headers: {
            'cache-control': 'no-cache',
            Connection: 'keep-alive',
            Host: 'www.nike.com',
            'Cache-Control': 'no-cache',
            'sec-fetch-site': 'same-origin',
            authority: 'www.nike.com',
            referer: 'https://www.nike.com/cn/w/jordan-shoes-37eefzy7ok',
            accept: '*/*',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
            'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6,ja;q=0.5',
            'accept-encoding': 'gzip, deflate, br',
            'sec-fetch-mode': 'cors' 
        }
    });
};

export const itemDetail = (itemName, itemCode) => {
    if (itemName == null && itemCode == null) return new Promise();
    const encodedItemName = encodeURI(itemName);
    const url = 'https://www.nike.com/cn/t/' + encodedItemName + '/' + itemCode;
    // const url = 'https://www.nike.com/cn/t/m2k-tekno-%E5%A5%B3%E5%AD%90%E8%BF%90%E5%8A%A8%E9%9E%8B-yrmG7M/AO3108-105';
    return axios.get(url, {
        headers: {
            'cache-control': 'no-cache',
            Connection: 'keep-alive',
            Host: 'www.nike.com',
            'Cache-Control': 'no-cache',
            'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6,ja;q=0.5',
            'accept-encoding': 'gzip, deflate, br',
            // referer: 'https://www.nike.com/cn/w/mens-jordan-shoes-37eefznik1zy7ok',
            'sec-fetch-site': 'same-origin',
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'sec-fetch-user': '?1',
            'sec-fetch-mode': 'navigate',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            'upgrade-insecure-requests': '1',
            authority: 'www.nike.com' 
        }
    });
};

export const sendWechatMessage = msg => {
    return axios.post("http://wxpusher.zjiecode.com/api/send/message", {
        "appToken": "AT_z99lafAoTwrGCPHb9Z1x1raxhTzLv0Oz",
        "content": msg,
        "contentType": 1,//内容类型 1表示文字  2表示html 3表示markdown
        "topicIds": [ //发送目标的topicId，是一个数组！！！
            123
        ],
        "uids": [//发送目标的UID，是一个数组！！！
            "UID_1RCym3XNLQTIkC3pcSTSPq4k8kNd"
        ]
    });
};

export function ipParser(ip) {
    const apiUrl = "https://api.udger.com/v3/parse";
    const apiParams = {
        accesskey: "d9b537b72903e269a2ca7a6862e36969",
        ua: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)",
        ip: ip
    };
    return axios.post(apiUrl, apiParams);
};