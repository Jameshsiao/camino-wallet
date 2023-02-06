import axios, { AxiosInstance } from 'axios'
import { keccak_256 } from 'js-sha3'
let elliptic = require('elliptic')
let ec = new elliptic.ec('secp256k1')
export interface AccessToken {
    access_token: string
}

interface GetNonceType {
    nonce: string
}

const BASE_URL = 'https://api.kyc.camino.network/v2'
// const BASE_URL = 'https://kyc-poc-be.camino.foundation/api/v1'

const kyc_api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    },
})

async function getNonce(): Promise<GetNonceType> {
    let res = await kyc_api.get('/nonce')
    return res.data
}

function byte2hexStr(byte: number) {
    var hexByteMap = '0123456789ABCDEF'
    var str = ''
    str += hexByteMap.charAt(byte >> 4)
    str += hexByteMap.charAt(byte & 0x0f)
    return str
}

async function generateTokenV2(privateKey: string | null, pubkey: string): Promise<AccessToken> {
    let { nonce } = await getNonce()
    let msgHash = keccak_256(nonce)
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
        let res = await kyc_api.post('/accessToken', {
            nonce: nonce,
            signature: signHex,
            public_key: pubkey,
        })
        return res.data
    } catch (e) {
        throw e
    }
}

async function generateToken(address: string, publicKeyByte: string): Promise<AccessToken> {
    let url = `/generate_token`
    try {
        let res = await kyc_api.post(url, {
            external_user_id: address,
            public_key: publicKeyByte,
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

export { kyc_api, generateToken, checkVerificationStatus, getNonce, generateTokenV2 }
