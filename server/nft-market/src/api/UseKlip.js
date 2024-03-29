import axios from "axios";
import { MARKET_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from "../constants";

const A2P_API_PREPARE_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
const APP_NAME = 'KLAY_MARKET';

const getKlipAccessUrl = (request_key) => {
    return `https://klipwallet.com/?target=/a2a?request_key=${request_key}`
}

// QRCODE를 통해 klip API 모바일-PC 연결
export const getAddress = (setQrvalue, callback) => {

    // 1. Prepare
    axios.post(
        A2P_API_PREPARE_URL, {
        bapp: {
            name: APP_NAME
        },
        type: "auth"
    }
    ).then((response) => {
        console.log(response)
        // 2. Request
        const { request_key } = response.data;

        setQrvalue(getKlipAccessUrl(request_key));

        let timerId = setInterval(() => {
            axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res) => {
                if (res.data.result) {
                    // 3. Result
                    console.log(`[Result] ${JSON.stringify(res.data.result)}`);
                    // callback: 다음 함수 실행, address 넘겨주기
                    callback(res.data.result.klaytn_address);
                    clearInterval(timerId);
                    setQrvalue("DEFAULT");
                }
            })
        }, 1000)
    })

}

// 컨트랙트 실행
export const executeContract = (txTo, functionJSON, value, params, setQrvalue, callback) => {
    axios.post(
        A2P_API_PREPARE_URL, {
        bapp: {
            name: APP_NAME
        },
        type: "execute_contract",
        transaction: {
            to: txTo,
            abi: functionJSON,
            value: value,
            params: params
        }
    }
    ).then((response) => {
        const { request_key } = response.data;

        setQrvalue(getKlipAccessUrl(request_key));

        let timerId = setInterval(() => {
            axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res) => {
                if (res.data.result) {
                    console.log(`[Result] ${JSON.stringify(res.data.result)}`);
                    callback(res.data.result);
                    clearInterval(timerId);
                    setQrvalue("DEFAULT");
                }
            })
        }, 1000)
    })
}

// TOKEN 판매
export const listingCard = async (fromAddress, tokenId, setQrvalue, callback) => {
    const functionJSON = '{ "constant": false, "inputs": [ { "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
    executeContract(NFT_CONTRACT_ADDRESS, functionJSON, "0", `["${fromAddress}","${MARKET_CONTRACT_ADDRESS}","${tokenId}"]`, setQrvalue, callback);
}

// TOKEN 구매
export const buyCard = async (tokenId, setQrvalue, callback) => {
    const functionJSON = '{ "constant": false, "inputs": [ { "name": "tokenId", "type": "uint256" }, { "name": "NFTAddress", "type": "address" } ], "name": "buyNFT", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }';
    executeContract(MARKET_CONTRACT_ADDRESS, functionJSON, "10000000000000000", `["${tokenId}","${NFT_CONTRACT_ADDRESS}"]`, setQrvalue, callback);
}