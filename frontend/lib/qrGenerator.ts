// QR Code Generator and Handler for APTOS Payments
// Specialized for Watercoin POS system

import QRCode from 'qrcode';
import { generateAptosURI } from './aptosAgent';
import type { QRCodeData } from './aptosAgent';

export interface QRCodeOptions {
  width: number;
  height: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

export const DEFAULT_QR_OPTIONS: QRCodeOptions = {
  width: 300,
  height: 300,
  margin: 2,
  color: {
    dark: '#0D6CA3', // Watercoin primary color
    light: '#FFFFFF'
  },
  errorCorrectionLevel: 'M'
};

// Generate QR Code as Data URL for display
export async function generateQRCode(
  qrData: QRCodeData, 
  options: Partial<QRCodeOptions> = {}
): Promise<string> {
  const opts = { ...DEFAULT_QR_OPTIONS, ...options };
  
  try {
    // Generate APTOS URI
    const aptosURI = generateAptosURI(qrData);
    
    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(aptosURI, {
      width: opts.width,
      margin: opts.margin,
      color: opts.color,
      errorCorrectionLevel: opts.errorCorrectionLevel
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

// Generate QR Code as Canvas Element
export async function generateQRCodeCanvas(
  qrData: QRCodeData,
  canvas: HTMLCanvasElement,
  options: Partial<QRCodeOptions> = {}
): Promise<void> {
  const opts = { ...DEFAULT_QR_OPTIONS, ...options };
  
  try {
    const aptosURI = generateAptosURI(qrData);
    
    await QRCode.toCanvas(canvas, aptosURI, {
      width: opts.width,
      margin: opts.margin,
      color: opts.color,
      errorCorrectionLevel: opts.errorCorrectionLevel
    });
  } catch (error) {
    console.error('Error generating QR code canvas:', error);
    throw new Error('Failed to generate QR code canvas');
  }
}

// Generate QR Code as SVG string
export async function generateQRCodeSVG(
  qrData: QRCodeData,
  options: Partial<QRCodeOptions> = {}
): Promise<string> {
  const opts = { ...DEFAULT_QR_OPTIONS, ...options };
  
  try {
    const aptosURI = generateAptosURI(qrData);
    
    const svgString = await QRCode.toString(aptosURI, {
      type: 'svg',
      width: opts.width,
      margin: opts.margin,
      color: opts.color,
      errorCorrectionLevel: opts.errorCorrectionLevel
    });
    
    return svgString;
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    throw new Error('Failed to generate QR code SVG');
  }
}

// Validate QR Code Data
export function validateQRData(qrData: QRCodeData): boolean {
  const now = Date.now();
  
  // Check if expired
  if (now > qrData.expiry) {
    return false;
  }
  
  // Check required fields
  if (!qrData.address || !qrData.amount || !qrData.transactionId) {
    return false;
  }
  
  // Check amount is positive
  if (qrData.amount <= 0) {
    return false;
  }
  
  return true;
}

// Format amount for display
export function formatAmount(qrData: QRCodeData): {
  aptos: string;
  idr: string;
  octas: string;
} {
  return {
    aptos: qrData.aptosAmount.toFixed(6) + ' APT',
    idr: 'Rp ' + qrData.idrAmount.toLocaleString('id-ID'),
    octas: qrData.amount.toLocaleString() + ' octas'
  };
}

// Create QR Code component data
export interface QRDisplayData {
  qrCodeDataURL: string;
  aptosURI: string;
  transactionId: string;
  productName: string;
  amounts: {
    aptos: string;
    idr: string;
    octas: string;
  };
  expiryTime: Date;
  timeRemaining: number; // in seconds
}

export async function createQRDisplayData(qrData: QRCodeData): Promise<QRDisplayData> {
  if (!validateQRData(qrData)) {
    throw new Error('Invalid QR code data');
  }
  
  const qrCodeDataURL = await generateQRCode(qrData);
  const aptosURI = generateAptosURI(qrData);
  const amounts = formatAmount(qrData);
  const expiryTime = new Date(qrData.expiry);
  const timeRemaining = Math.max(0, Math.floor((qrData.expiry - Date.now()) / 1000));
  
  return {
    qrCodeDataURL,
    aptosURI,
    transactionId: qrData.transactionId,
    productName: qrData.productName,
    amounts,
    expiryTime,
    timeRemaining
  };
}

// Deep link handlers for different wallet apps
export const WALLET_DEEP_LINKS = {
  // Petra Wallet
  petra: (aptosURI: string) => `https://petra.app/explore?uri=${encodeURIComponent(aptosURI)}`,
  
  // Martian Wallet  
  martian: (aptosURI: string) => `https://martianwallet.xyz/payment?uri=${encodeURIComponent(aptosURI)}`,
  
  // Pontem Wallet
  pontem: (aptosURI: string) => `https://pontem.network/wallet?payment=${encodeURIComponent(aptosURI)}`,
  
  // Fewcha Wallet
  fewcha: (aptosURI: string) => `https://fewcha.app/payment?data=${encodeURIComponent(aptosURI)}`,
  
  // Generic APTOS protocol
  aptos: (aptosURI: string) => aptosURI
};

// Generate deep links for popular wallets
export function generateWalletLinks(qrData: QRCodeData): Record<string, string> {
  const aptosURI = generateAptosURI(qrData);
  
  return Object.fromEntries(
    Object.entries(WALLET_DEEP_LINKS).map(([wallet, generator]) => [
      wallet,
      generator(aptosURI)
    ])
  );
}

// QR Code error handling
export class QRCodeError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'QRCodeError';
  }
}

// Common error codes
export const QR_ERROR_CODES = {
  EXPIRED: 'QR_EXPIRED',
  INVALID_DATA: 'QR_INVALID_DATA',
  GENERATION_FAILED: 'QR_GENERATION_FAILED',
  INVALID_AMOUNT: 'QR_INVALID_AMOUNT'
} as const;
