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

export const getJordanList = () => {
    const url = 'https://www.nike.com/w/graphql';
    return axios.get(url, {
        params: {
            qs: {
                queryid: 'filteredProductsWithContext',
                anonymousId: '70CA4D63D5ABB39F9C55BF761D308A28',
                uuids: '0f64ecc7-d624-4e91-b171-b83a03dd8550,16633190-45e5-4830-a068-232ac7aea82c,498ac76f-4c2c-4b55-bbdc-dd37011887b1',
                language: 'zh-Hans',
                country: 'CN',
                channel: 'NIKE'
            }
        },
        headers: {
            Connection: 'keep-alive',
            Host: 'www.nike.com',
            'sec-fetch-site': 'same-origin',
            authority: 'www.nike.com',
            referer: 'https://www.nike.com/cn/w/mens-jordan-shoes-37eefznik1zy7ok',
            accept: '*/*',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6,ja;q=0.5',
            'accept-encoding': 'gzip, deflate, br',
            'sec-fetch-mode': 'cors',
            Cookie: 'anonymousId=798EA4672C2A5E692432293221E635E6; _abck=AC2C149AEACD00CD8A82E5C686A14827~-1~YAAQDh7eOlnZP1BtAQAA1rANUwKSH+JpxVL7a3FNTe3XxupLZIHI15W4EdErlp0FxpNuvByR2zX28g/nph9++pzbKw3W7oPxduYlsBOWK5R3/EvQmb7IAnOOO4udPDZSpxkdE1sK/EBI/+/FzQLHE4opydmy16OcjCMLgheG98Z02Ekue73a64QtmDfUdN76bkqOY5rSekcbbEu15JwEOKy/4OKZtQqaT6GcR7PoWDaY/q4FeSlSe2gnaJufwj33HapzH65ydQeUkI4dKc3xgBr7Pc9qMFaK/B/GBuF/9QXXF877URv2Ktgtpgli6TGjeXcYKeDOGLoWaMttu1/bfoIg2bEg/XHvOXs=~-1~-1~-1; ak_bmsc=BEB84528DE1577550E37507DFA9DE3783ADE1E0E44080000D5E6855D40B41936~pl9GHIrrQ80LjhFEGsZ1TaJH+JjAK6l705vCKrFtT+6EBkI27R3PcjeEpqjl0Cn43TzcFD2txwrk2YcAWsupQmNCutWkDa3ZL3NDvTRde3SK5oPyjeNdRHIAsEuEsMFBUmw7WJxTGNwBhACoJs484kNWgkx/x51XcgaBvgdJ5+GGgUo8AEBg+alZtxWci5PvRNlR10esOpHQ782UFH4taW73lcx4vyI4HsQcnNDrOae0k=; bm_sz=5A46FED513EFB898F0757A7C50E6392B~YAAQDh7eOljZP1BtAQAA1rANUwV06XpSKwi9hDRrtp+XURTx6yYMsQINHi3WHIvlfvrC5hIV2Fy7CBGxtbvGF0ai9txKeakGIl9r5r7owjsPNA9W8eAq449meo+qh0blY5AoYdxumNN6MTHe4lN3uWerExmiK5AGCGD2/6GE0ElpyX7ZjDI/AT3iHR7R+A==; geoloc=cc=CN,rc=SH,tp=vhigh,tz=GMT+8,la=31.22,lo=121.46; bm_sv=8D81CC8B9C354FA23CBB8530CE4C502F~CUbeJ+TIGQWV4dl6ohFKuyeHiWExCre3W0oigt0fhWFEKz3dkVNJK5/s0hvg0bEWo1138OroL7eD3ltULNYiQCerDNxXDR2Ed1pkEwRdBaSMlSjouTVuoshy9vc1p+6qsjkoiNfkLYFKxL9EvuZe8w=='
        }
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