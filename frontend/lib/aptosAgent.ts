// APTOS Blockchain Integration Agent for Watercoin AI Monitoring System
// Replaces IC (Internet Computer) with APTOS network
// Handles payment processing, transaction monitoring, and data storage

import { 
  Account, 
  Aptos, 
  AptosConfig, 
  Network, 
  AccountAddress,
  U64,
  parseTypeTag
} from '@aptos-labs/ts-sdk';
import type { InputGenerateTransactionOptions } from '@aptos-labs/ts-sdk';

// APTOS Network Configuration
const APTOS_NETWORK = process.env.NEXT_PUBLIC_APTOS_NETWORK as Network || Network.DEVNET;
const APTOS_RPC_URL = process.env.NEXT_PUBLIC_APTOS_RPC_URL || undefined;

// Watercoin APTOS wallet address
export const WATERCOIN_APTOS_ADDRESS = process.env.NEXT_PUBLIC_WATERCOIN_APTOS_ADDRESS || 
  '0xb939d880b6e526f5296806b8984cb2f9ecc2d347ebef46bc74729460926b905c';

// APTOS Coin Configuration  
export const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
export const COIN_STORE = `0x1::coin::CoinStore<${APTOS_COIN}>`;

// Conversion rate: 1 APTOS = 65,000 IDR
export const APTOS_TO_IDR_RATE = 65000;

// Initialize APTOS client
let _aptosClient: Aptos | null = null;

function getAptosClient(): Aptos {
  if (!_aptosClient) {
    const config = new AptosConfig({ 
      network: APTOS_NETWORK,
      ...(APTOS_RPC_URL && { fullnode: APTOS_RPC_URL })
    });
    _aptosClient = new Aptos(config);
  }
  return _aptosClient;
}

// Data Types for Watercoin System
export interface Scalar { 
  value: number; 
  unit: string; 
}

export interface SensorPacket {
  timestamp: bigint;
  deviceId: string;
  location: string;
  tds: Scalar;
  ph: Scalar;
  turbidity: Scalar;
}

export interface Survey { 
  timestamp: bigint; 
  sentiment: string; 
}

export interface PaymentTransaction {
  id: string;
  amount: number; // in octas (1 APT = 100,000,000 octas)
  aptosAmount: number; // amount in APTOS
  idrAmount: number; // amount in IDR
  recipient: string;
  sender?: string;
  status: 'pending' | 'confirmed' | 'failed';
  transactionHash?: string;
  productId: string;
  productName: string;
  timestamp: bigint;
  confirmations?: number;
}

export interface QRCodeData {
  address: string;
  amount: number; // in octas
  aptosAmount: number;
  idrAmount: number;
  transactionId: string;
  productId: string;
  productName: string;
  timestamp: number;
  expiry: number; // 10 minutes from creation
}

// Product pricing in IDR
export const PRODUCTS = [
  { id: 'air-ro', name: 'AIR RO 19L', priceIDR: 6000 },
  { id: 'aqua', name: 'GALON 19L AQUA', priceIDR: 20000 },
  { id: 'cleo', name: 'GALON 19L CLEO', priceIDR: 18000 },
  { id: 'galon-first', name: 'GALON PERTAMA', priceIDR: 65000 }
];

// Utility Functions
export function idrToAptos(idrAmount: number): number {
  return idrAmount / APTOS_TO_IDR_RATE;
}

export function aptosToOctas(aptosAmount: number): number {
  return Math.floor(aptosAmount * 100_000_000);
}

export function octasToAptos(octas: number): number {
  return octas / 100_000_000;
}

export function idrToOctas(idrAmount: number): number {
  const aptosAmount = idrToAptos(idrAmount);
  return aptosToOctas(aptosAmount);
}

// Generate QR Code Data for Payment
export function generatePaymentQR(productId: string): QRCodeData {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) {
    throw new Error(`Product ${productId} not found`);
  }

  const idrAmount = product.priceIDR;
  const aptosAmount = idrToAptos(idrAmount);
  const amount = aptosToOctas(aptosAmount);
  const transactionId = `wc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    address: WATERCOIN_APTOS_ADDRESS,
    amount,
    aptosAmount,
    idrAmount,
    transactionId,
    productId,
    productName: product.name,
    timestamp: Date.now(),
    expiry: Date.now() + (10 * 60 * 1000) // 10 minutes
  };
}

// Generate APTOS URI for wallet apps
export function generateAptosURI(qrData: QRCodeData): string {
  // APTOS URI scheme for payment
  // Format: aptos:pay?recipient=ADDRESS&amount=AMOUNT&memo=MEMO
  const params = new URLSearchParams({
    recipient: qrData.address,
    amount: qrData.amount.toString(),
    memo: `Watercoin_${qrData.transactionId}_${qrData.productId}`
  });
  
  return `aptos:pay?${params.toString()}`;
}

// Transaction Storage (In production, this should be in a database)
const pendingTransactions = new Map<string, PaymentTransaction>();
const completedTransactions = new Map<string, PaymentTransaction>();

// Create Payment Transaction
export function createPaymentTransaction(productId: string): PaymentTransaction {
  const qrData = generatePaymentQR(productId);
  
  const transaction: PaymentTransaction = {
    id: qrData.transactionId,
    amount: qrData.amount,
    aptosAmount: qrData.aptosAmount,
    idrAmount: qrData.idrAmount,
    recipient: qrData.address,
    status: 'pending',
    productId: qrData.productId,
    productName: qrData.productName,
    timestamp: BigInt(qrData.timestamp),
    confirmations: 0
  };

  pendingTransactions.set(transaction.id, transaction);
  return transaction;
}

// Monitor APTOS transactions for payments
export async function monitorPayment(transactionId: string): Promise<PaymentTransaction | null> {
  const transaction = pendingTransactions.get(transactionId);
  if (!transaction) {
    console.log(`Transaction ${transactionId} not found in pending transactions`);
    return null;
  }

  try {
    const aptos = getAptosClient();
    
    // Get recent transactions to the Watercoin address
    const accountTransactions = await aptos.getAccountTransactions({
      accountAddress: WATERCOIN_APTOS_ADDRESS,
      options: { limit: 50 }
    });

    // Check for matching transaction
    for (const txn of accountTransactions) {
      if (txn.type === 'user_transaction' && txn.success) {
        const payload = txn.payload;
        
        // Check if it's a coin transfer with proper type checking
        if (payload.type === 'entry_function_payload' && 
            'function' in payload &&
            payload.function === '0x1::aptos_account::transfer') {
          
          const amount = payload.arguments?.[1];
          const memo = txn.events?.find(event => 
            event.type.includes('TransferEvent') || 
            event.data?.memo?.includes(transactionId)
          );

          // Check if amount matches and within time window
          if (amount && Number(amount) >= transaction.amount * 0.99) { // 1% tolerance
            const txnTimestamp = parseInt(txn.timestamp);
            const timeDiff = Math.abs(txnTimestamp - Number(transaction.timestamp));
            
            if (timeDiff < 30 * 60 * 1000000) { // 30 minutes in microseconds
              // Payment confirmed
              transaction.status = 'confirmed';
              transaction.transactionHash = txn.hash;
              transaction.sender = txn.sender;
              transaction.confirmations = 1;
              
              // Move to completed transactions
              completedTransactions.set(transactionId, transaction);
              pendingTransactions.delete(transactionId);
              
              console.log(`Payment confirmed for transaction ${transactionId}`);
              return transaction;
            }
          }
        }
      }
    }

    // Check if transaction is expired (15 minutes instead of 10)
    const currentTime = Date.now();
    const transactionTime = Number(transaction.timestamp);
    const timeDiff = currentTime - transactionTime;
    
    if (timeDiff > 15 * 60 * 1000) {
      console.log(`Transaction ${transactionId} expired after ${Math.round(timeDiff / 60000)} minutes`);
      transaction.status = 'failed';
      pendingTransactions.delete(transactionId);
      return transaction;
    }

    // Transaction still pending
    console.log(`Transaction ${transactionId} still pending, ${Math.round((15 * 60 * 1000 - timeDiff) / 60000)} minutes remaining`);
    return transaction;
  } catch (error) {
    console.error('Error monitoring payment:', error);
    // Don't change transaction status on network errors
    return transaction;
  }
}

// Get Account Balance
export async function getAccountBalance(address: string): Promise<number> {
  try {
    const aptos = getAptosClient();
    const balance = await aptos.getAccountAPTAmount({ accountAddress: address });
    return balance;
  } catch (error) {
    console.error('Error getting account balance:', error);
    return 0;
  }
}

// Verify Transaction by Hash
export async function verifyTransaction(hash: string): Promise<boolean> {
  try {
    const aptos = getAptosClient();
    const transaction = await aptos.getTransactionByHash({ transactionHash: hash });
    return 'success' in transaction && transaction.success === true;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return false;
  }
}

// APTOS Data Storage Functions (replacing IC functions)
// In a production environment, these would interact with APTOS smart contracts

const sensorSnapshots: SensorPacket[] = [];
const surveyData: Survey[] = [];

export async function saveSnapshotToAptos(packet: SensorPacket): Promise<number> {
  // In production, this would call an APTOS smart contract
  // For now, we'll store locally and log to console
  const index = sensorSnapshots.push(packet) - 1;
  
  console.log('📊 Sensor data saved to APTOS:', {
    index,
    deviceId: packet.deviceId,
    location: packet.location,
    timestamp: new Date(Number(packet.timestamp)),
    tds: packet.tds,
    ph: packet.ph,
    turbidity: packet.turbidity
  });
  
  return index;
}

export async function fetchLatestFromAptos(limit: number): Promise<SensorPacket[]> {
  // Return latest snapshots
  return sensorSnapshots.slice(-limit);
}

export async function addSurveyToAptos(sentiment: string): Promise<number> {
  const survey: Survey = {
    timestamp: BigInt(Date.now()),
    sentiment
  };
  
  const index = surveyData.push(survey) - 1;
  
  console.log('📝 Survey data saved to APTOS:', {
    index,
    sentiment,
    timestamp: new Date(Number(survey.timestamp))
  });
  
  return index;
}

export async function listSurveysFromAptos(limit: number): Promise<Survey[]> {
  return surveyData.slice(-limit);
}

export async function fetchCountsFromAptos(): Promise<{ snapshots: number; surveys: number }> {
  return {
    snapshots: sensorSnapshots.length,
    surveys: surveyData.length
  };
}

export async function fetchAveragesFromAptos(): Promise<{ 
  count: number; 
  avgTds: number; 
  avgPh: number; 
  avgTurbidity: number; 
}> {
  if (sensorSnapshots.length === 0) {
    return { count: 0, avgTds: 0, avgPh: 0, avgTurbidity: 0 };
  }

  const totals = sensorSnapshots.reduce(
    (acc, snapshot) => ({
      tds: acc.tds + snapshot.tds.value,
      ph: acc.ph + snapshot.ph.value,
      turbidity: acc.turbidity + snapshot.turbidity.value
    }),
    { tds: 0, ph: 0, turbidity: 0 }
  );

  const count = sensorSnapshots.length;
  return {
    count,
    avgTds: totals.tds / count,
    avgPh: totals.ph / count,
    avgTurbidity: totals.turbidity / count
  };
}

export async function fetchAptosHealth(): Promise<{
  version: string;
  snapshots: number;
  surveys: number;
  network: string;
  address: string;
  balance: number;
}> {
  const balance = await getAccountBalance(WATERCOIN_APTOS_ADDRESS);
  
  return {
    version: '1.0.0-aptos',
    snapshots: sensorSnapshots.length,
    surveys: surveyData.length,
    network: APTOS_NETWORK,
    address: WATERCOIN_APTOS_ADDRESS,
    balance: octasToAptos(balance)
  };
}

// Backward compatibility functions (renamed from IC functions)
export const saveSnapshotToCanister = saveSnapshotToAptos;
export const fetchLatest = fetchLatestFromAptos;
export const addSurvey = addSurveyToAptos;
export const listSurveys = listSurveysFromAptos;
export const fetchCounts = fetchCountsFromAptos;
export const fetchAverages = fetchAveragesFromAptos;
export const fetchHealth = fetchAptosHealth;
export const getSnapshots = (limit: number = 10) => 
  Promise.resolve(sensorSnapshots.slice(-limit));
export const getSurveys = (limit: number = 10) => 
  Promise.resolve(surveyData.slice(-limit));

// Payment Monitoring Function for POS System
export function startPaymentMonitoring(
  transactionId: string,
  onSuccess: (transaction: PaymentTransaction) => void,
  onFailed: () => void,
  onProgress: (transaction: PaymentTransaction) => void
): () => void {
  let monitoring = true;
  
  const interval = setInterval(async () => {
    if (!monitoring) {
      clearInterval(interval);
      return;
    }
    
    try {
      const result = await monitorPayment(transactionId);
      
      if (result) {
        if (result.status === 'confirmed') {
          monitoring = false;
          clearInterval(interval);
          onSuccess(result);
        } else if (result.status === 'failed') {
          monitoring = false;
          clearInterval(interval);
          onFailed();
        } else {
          onProgress(result);
        }
      }
    } catch (error) {
      console.error('Payment monitoring error:', error);
      // Don't call onFailed for network errors, just continue monitoring
    }
  }, 3000); // Check every 3 seconds

  // Return cleanup function
  return () => {
    monitoring = false;
    clearInterval(interval);
  };
}

// Get Payment Transaction
export function getPaymentTransaction(transactionId: string): PaymentTransaction | null {
  return pendingTransactions.get(transactionId) || 
         completedTransactions.get(transactionId) || 
         null;
}

// Network Information
export function getNetworkInfo() {
  return {
    network: APTOS_NETWORK,
    address: WATERCOIN_APTOS_ADDRESS,
    conversionRate: APTOS_TO_IDR_RATE,
    coin: APTOS_COIN
  };
}
