import axios, { AxiosInstance } from 'axios'
import { keccak_256 } from 'js-sha3'
let elliptic = require('elliptic')
let ec = new elliptic.ec('secp256k1')
export interface AccessToken {
    token: string
    userId: string
}

/* Convert a byte to string */
function byte2hexStr(byte: number) {
    var hexByteMap = '0123456789ABCDEF'
    var str = ''
    str += hexByteMap.charAt(byte >> 4)
    str += hexByteMap.charAt(byte & 0x0f)
    return str
}

const BASE_URL = 'https://kyc-poc-be-playground.camino.foundation/api/v1'

const kyc_api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    },
})

async function generateToken(privateKey: string): Promise<AccessToken> {
    const token: string = (await kyc_api.get('/token')).data
    console.log(token)
    let msgHash = keccak_256(token)
    let signature = ec.sign(msgHash, privateKey)
    let r = signature.r
    let s = signature.s
    let id = signature.recoveryParam

    let rHex = r.toString('hex')
    while (rHex.length < 64) {
        rHex = '0' + rHex
    }
    let sHex = s.toString('hex')
    while (sHex.length < 64) {
        sHex = '0' + sHex
    }
    let idHex = byte2hexStr(id)
    let signHex = '0x' + rHex + sHex + idHex
    try {
        let res = await kyc_api.post('/generate_ss_token', {
            token: token,
            signature: signHex,
        })
        return res.data
    } catch (e) {
        throw e
    }
}

async function checkVerificationStatus(address: string): Promise<boolean> {
    let url = `/verified/${address}`

    try {
        let res = await kyc_api.get(url)
        return res.data
    } catch (e) {
        throw e
    }
}

export { kyc_api, generateToken, checkVerificationStatus }
