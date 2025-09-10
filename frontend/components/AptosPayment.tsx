'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  createPaymentTransaction,
  generatePaymentQR,
  startPaymentMonitoring,
  getNetworkInfo
} from '../lib/aptosAgent';
import type { 
  PaymentTransaction,
  QRCodeData
} from '../lib/aptosAgent';
import { 
  generateQRCode, 
  createQRDisplayData, 
  generateWalletLinks
} from '../lib/qrGenerator';
import type { QRDisplayData } from '../lib/qrGenerator';


interface AptosPaymentProps {
  productId: string;
  productName: string;
  priceIDR: number;
  onSuccess: (transaction: PaymentTransaction) => void;
  onCancelAction: () => void;
  onError: (error: string) => void;
}
type PaymentStatus = 'initializing' | 'waiting' | 'monitoring' | 'confirmed' | 'failed' | 'expired';

export default function AptosPayment({
  productId,
  productName,
  priceIDR,
  onSuccess,
  onCancelAction,
  onError
}: AptosPaymentProps) {
  const [status, setStatus] = useState<PaymentStatus>('initializing');
  const [qrDisplayData, setQrDisplayData] = useState<QRDisplayData | null>(null);
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(600); // 10 minutes
  const [monitoringCleanup, setMonitoringCleanup] = useState<(() => void) | null>(null);
  const [walletLinks, setWalletLinks] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  const networkInfo = getNetworkInfo();

  useEffect(() => { setMounted(true); }, []);

  // Initialize payment
  useEffect(() => {
    let currentCleanup: (() => void) | null = null;
    
    async function initPayment() {
      try {
        setStatus('initializing');
        
        // Create payment transaction
        const paymentTxn = createPaymentTransaction(productId);
        setTransaction(paymentTxn);
        
        // Generate QR data
        const qrData = generatePaymentQR(productId);
        
        // Create display data
        const displayData = await createQRDisplayData(qrData);
        setQrDisplayData(displayData);
        setTimeRemaining(displayData.timeRemaining);
        
        // Generate wallet links
        const links = generateWalletLinks(qrData);
        setWalletLinks(links);
        
        setStatus('waiting');
        
        // Start monitoring
        const cleanup = startPaymentMonitoring(
          paymentTxn.id,
          (confirmedTxn) => {
            setStatus('confirmed');
            setTransaction(confirmedTxn);
            onSuccess(confirmedTxn);
          },
          () => {
            setStatus('failed');
            onError('Payment failed or expired');
          },
          (progressTxn) => {
            setStatus('monitoring');
            setTransaction(progressTxn);
          }
        );
        
        currentCleanup = cleanup;
        setMonitoringCleanup(() => cleanup);
        
      } catch (error) {
        console.error('Error initializing payment:', error);
        setStatus('failed');
        onError('Failed to initialize payment');
      }
    }
    
    initPayment();
    
    return () => {
      if (currentCleanup) {
        try {
          currentCleanup();
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }
    };
  }, [productId, onSuccess, onError]);

  // Timer countdown
  useEffect(() => {
    if (status === 'waiting' || status === 'monitoring') {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setStatus('expired');
            onError('Payment expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [status, onError]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyAddress = useCallback(() => {
    if (qrDisplayData) {
      navigator.clipboard.writeText(networkInfo.address);
    }
  }, [qrDisplayData, networkInfo.address]);

  const handleCopyURI = useCallback(() => {
    if (qrDisplayData) {
      navigator.clipboard.writeText(qrDisplayData.aptosURI);
    }
  }, [qrDisplayData]);

  if (status === 'initializing') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Initializing APTOS payment...</p>
      </div>
    );
  }

  if (status === 'failed' || status === 'expired') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h3 className="text-xl font-bold text-red-600 mb-2">
          {status === 'expired' ? 'Payment Expired' : 'Payment Failed'}
        </h3>
        <p className="text-gray-600 mb-6 text-center">
          {status === 'expired' 
            ? 'The payment window has expired. Please try again.'
            : 'Unable to process payment. Please try again.'}
        </p>
        <button
          onClick={onCancelAction}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Payment Options
        </button>
      </div>
    );
  }

  if (status === 'confirmed') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-green-600 mb-2">Payment Confirmed!</h3>
        <p className="text-gray-600 mb-2">Transaction successful</p>
        {transaction?.transactionHash && (
          <p className="text-sm text-gray-500 font-mono break-all">
            {transaction.transactionHash}
          </p>
        )}
      </div>
    );
  }

  if (!mounted || !qrDisplayData) {
    // Render skeleton/loading agar SSR dan CSR selalu sama
    return (
      <div className="aptosPayment">
        <div className="aptosPayment__container">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading payment UI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aptosPayment">
      <div className="aptosPayment__container" style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',minHeight:'auto',width:'100%',maxWidth:'1200px',margin:'0 auto',padding:'20px',gap:'60px',transform:'translateX(-30px)'}}>
        
        {/* Left Side: QR Code & Status */}
        <div className="aptosPayment__qr" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minWidth:'400px'}}>
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">APTOS Payment</h2>
            <div className="text-xl text-gray-700 font-semibold">{productName}</div>
            <div className="text-gray-700 text-lg">{qrDisplayData?.amounts.idr} <span className="font-mono">{qrDisplayData?.amounts.aptos}</span></div>
          </div>

          {/* Status */}
          <div className="text-center mb-6">
            {status === 'waiting' && (
              <div className="flex items-center justify-center text-blue-600">
                <div className="animate-pulse w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                <span className="text-lg">Waiting for Payment...</span>
              </div>
            )}
            {status === 'monitoring' && (
              <div className="flex items-center justify-center text-yellow-600">
                <div className="animate-spin w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full mr-2"></div>
                <span className="text-lg">Confirming on Blockchain...</span>
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="text-center mb-6">
            <div className="bg-white p-4 rounded-xl border-2 border-blue-500 inline-block shadow-lg">
              <img 
                src={qrDisplayData.qrCodeDataURL} 
                alt="Payment QR"
                style={{ width: '280px', height: '280px' }}
              />
            </div>
            <p className="text-xl text-gray-800 mt-3 font-semibold">Scan to Pay</p>
          </div>

          {/* Timer */}
          <div className="text-center">
            <div className="inline-block p-4 bg-red-100 rounded-xl shadow-md">
              <p className="text-sm text-red-700">Time left:</p>
              <p className="text-3xl font-mono font-bold text-red-600">{formatTime(timeRemaining)}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="aptosPayment__details" style={{display:'flex',flexDirection:'column',justifyContent:'center',minWidth:'400px',maxWidth:'500px'}}>
          
          {/* Wallet Apps */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-3 text-center">Pay with Wallet:</h4>
            <div className="text-center text-gray-600 font-mono mb-4 text-sm">
              {`${networkInfo.address.slice(0, 12)}...${networkInfo.address.slice(-8)}`}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(walletLinks).map(([wallet, link]) => (
                <a
                  key={wallet}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border border-gray-300 rounded-lg text-center font-medium hover:bg-gray-100 hover:border-blue-500 transition-all bg-white text-blue-700"
                >
                  {wallet}
                </a>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 text-lg mb-3 text-center">How to Pay:</h4>
            <ol className="list-decimal list-inside text-blue-700 space-y-2">
              <li>Open your preferred APTOS wallet.</li>
              <li>Scan the QR code or use a wallet link above.</li>
              <li>Confirm the transaction details and send.</li>
            </ol>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-100 rounded-lg p-4 space-y-3 mb-6">
            <h4 className="font-semibold text-gray-800 text-lg mb-3 text-center">Payment Details:</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Network:</span>
                <span className="font-mono bg-gray-200 px-2 py-1 rounded">{networkInfo.network}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="font-mono font-bold text-lg">{qrDisplayData?.amounts.aptos}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCopyURI}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Copy Payment Link
            </button>
            <button
              onClick={onCancelAction}
              className="w-full px-6 py-3 border border-gray-400 text-gray-800 bg-white rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
