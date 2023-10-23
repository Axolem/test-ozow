import * as Crypto from 'expo-crypto';
import { ViewStyle } from 'react-native';

async function generateRequestHash(data: OzowPaymentData, privateKey: string, link: boolean = false) {
    const siteCode = data.SiteCode;
    const countryCode = data.CountryCode || 'ZA';
    const currencyCode = data.CurrencyCode || 'ZAR';
    const amount = data.Amount;
    const transactionReference = data.TransactionReference;
    const bankReference = data.BankReference;
    const cancelUrl = data.CancelUrl;
    const errorUrl = data.ErrorUrl;
    const successUrl = data.SuccessUrl;
    const notifyUrl = data.NotifyUrl || '';
    const isTest = data.IsTest || false;
    const customer = data.Customer ? JSON.stringify(data.Customer) : '';

    if (link) {
        const inputString = `${countryCode}${amount}${transactionReference}${bankReference}${cancelUrl}${currencyCode}${errorUrl}${isTest}${siteCode}${notifyUrl}${successUrl}`

        return await generateRequestHashCheck(inputString);
    }
    const inputString = `${siteCode}${countryCode}${currencyCode}${amount}${transactionReference}${bankReference}${customer}${cancelUrl}${errorUrl}${successUrl}${notifyUrl}${isTest}${privateKey}`;

    return await generateRequestHashCheck(inputString);
}

async function generateRequestHashCheck(inputString: string) {
    return await getSha512Hash(inputString.toLowerCase())
}

async function getSha512Hash(stringToHash: string): Promise<string> {
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA512, stringToHash);
}

function getSearchParams(urlArr: string[]): OzowPaymentResponse {
    const params = urlArr[1].split('&');
    const obj = {};

    params.forEach((param) => {
        const [key, value] = param.split('=');
        obj[key] = value;
    });
    return obj as OzowPaymentResponse;
}

interface OzowPaymentData {
    SiteCode: string;
    CountryCode?: string;
    CurrencyCode?: string;
    Amount: number;
    TransactionReference: string;
    BankReference: string;
    Customer?: string | number | null | any;
    CancelUrl: string;
    ErrorUrl: string;
    SuccessUrl: string;
    NotifyUrl?: string;
    IsTest?: boolean;
}

interface OzowProps {
    data: OzowPaymentData;
    privateKey: string;
    style?: ViewStyle;
    onPaymentError?: (data: OzowPaymentResponse) => void;
    onPaymentCancel?: (data: OzowPaymentResponse) => void;
    onPaymentSuccess?: (data: OzowPaymentResponse) => void;
    onErrorMessage?: (data: OzowPaymentError | OzowPaymentResponse) => void;
}

interface OzowPaymentError {
    url: string;
    code: number;
    description: string;
}

enum OzowTransactionStatus {
    ERROR = "Error",
    SUCCESS = "Complete",
    CANCELLED = "Cancelled",
    ABANDONED = "Abandoned",
    PENDING = "PendingInvestigation",
}

interface OzowPaymentResponse {
    Hash: string;
    Amount: string;
    IsTest: string;
    Status: string;
    SiteCode: string;
    Optional1: string;
    Optional2: string;
    Optional3: string;
    Optional4: string;
    Optional5: string;
    CurrencyCode: string;
    StatusMessage: string;
    TransactionId: string;
    TransactionReference: string;
}

enum OzowContentType {
    JSON = "application/json",
    FORM = "application/xml ",
}

interface OzowLinkResponse {
    paymentRequestId: string;
    url: string;
    errorMessage: boolean;
    success: boolean;
}


export {
    OzowProps,
    OzowPaymentData,
    getSearchParams,
    OzowPaymentError,
    OzowPaymentResponse,
    generateRequestHash,
    OzowTransactionStatus,
    OzowContentType,
    OzowLinkResponse,
};
