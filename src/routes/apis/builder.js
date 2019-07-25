import axios from 'axios';

export function snkrLogin(param) {
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