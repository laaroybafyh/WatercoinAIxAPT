# 🌊 WATERCOIN APTOS POS SYSTEM

**Watercoin APTOS POS System** adalah sistem Point of Sale (POS) untuk depot air minum yang terintegrasi dengan APTOS blockchain. Sistem ini menyediakan monitoring sensor air real-time dan pembayaran menggunakan cryptocurrency APTOS, dioptimalkan untuk Samsung Tab8 Android (1200x1920 piksel).

## 🎯 Key Features

- ✅ **APTOS Blockchain Integration** - Pembayaran dan penyimpanan data di APTOS DevNet
- ✅ **Smart POS System** - Point of Sale dengan QR payment APTOS  
- ✅ **Real-time Price Conversion** - IDR ↔ APTOS dengan akurasi tinggi (2 desimal, pembulatan naik)
- ✅ **Multi-Wallet Support** - Petra, Martian, Pontem, Fewcha
- ✅ **Sensor Data Storage** - pH, TDS, dan data sensor tersimpan di APTOS network
- ✅ **Samsung Tab8 Optimized** - Responsive design untuk tablet Android landscape
- ✅ **TWA/APK Ready** - Siap deployment sebagai aplikasi Android
- ✅ **Auto Port Management** - Sistem restart otomatis untuk menghindari konflik port

## 🚀 Quick Start (Windows CMD/PowerShell)

### 📋 Prerequisites

- Node.js 18+
- Git untuk version control
- Android Studio (untuk membuat APK)

### ⚡ Development Start

```powershell
# Navigate ke project
cd "c:\Users\GL63\Project Development\Watercoin AI Monitoring\AIv2APTOS"

# Start development servers (Backend + Frontend)
.\scripts\dev-start.ps1
```

### 🧪 Testing POS Flow

```powershell
# Test harga dan konversi APTOS
cd "c:\Users\GL63\Project Development\Watercoin AI Monitoring\AIv2APTOS"
.\scripts\test-pos-flow.ps1
```

### 📱 Deployment Preparation

```powershell
# Buat deployment package untuk hosting dan Android APK
cd "c:\Users\GL63\Project Development\Watercoin AI Monitoring\AIv2APTOS"
.\scripts\android-deployment.ps1 -All
```

## 💰 Product Prices & APTOS Conversion

| Product | IDR Price | APTOS Price | Status |
|---------|-----------|-------------|--------|
| AIR RO 19L | Rp 6.000 | 0.10 APTOS | ✅ |
| GALON 19L AQUA | Rp 20.000 | 0.31 APTOS | ✅ |
| GALON 19L CLEO | Rp 18.000 | 0.28 APTOS | ✅ |
| GALON PERTAMA | Rp 65.000 | 1.00 APTOS | ✅ |

**Rate**: 1 APTOS = 65,000 IDR (fixed rate)
**Conversion**: `Math.ceil(idrToAptos(price) * 100) / 100` (pembulatan naik, 2 desimal)

## 🔗 URLs & Access

- **Frontend**: <http://localhost:3000>
- **POS System**: <http://localhost:3000/pos>
- **Backend API**: <http://localhost:4000>
- **Health Check**: <http://localhost:4000/health>

## 📱 Samsung Tab8 Android Deployment

### 🌐 RumahWeb Hosting Setup

1. **Login** ke RumahWeb cPanel
2. **File Manager** → Navigate ke `public_html`
3. **Upload** file dari folder `deployment/`
4. **Setup Node.js**:

   ```bash
   cd public_html
   npm install --production
   npm run start
   ```

### 📲 Android APK Creation

1. **Buka Android Studio**
2. **New Project** → "Trusted Web Activity"
3. **Configure**:
   - App Name: `Watercoin APTOS POS`
   - Package: `com.watercoin.aptospos`
   - Host URL: `https://your-domain.com`
   - Start URL: `https://your-domain.com/pos`
   - Screen Orientation: `landscape`
4. **Build APK** dan install di Samsung Tab8

### 📊 Testing Checklist

- [ ] Product selection dengan price display
- [ ] Price conversion IDR → APTOS (2 decimal, round up)
- [ ] QR generation untuk payment
- [ ] Wallet integration (Petra, Martian, Pontem, Fewcha)
- [ ] Transaction monitoring (10 minutes timeout)
- [ ] Samsung Tab8 layout (1200x1920 landscape)
- [ ] Touch targets ≥ 44px
- [ ] Responsive design

## 🌐 APTOS Network Integration

- **Network**: APTOS DevNet
- **RPC URL**: `https://fullnode.devnet.aptoslabs.com`
- **Watercoin Address**: `0xb939d880b6e526f5296806b8984cb2f9ecc2d347ebef46bc74729460926b905c`
- **Explorer**: [APTOS Explorer DevNet](https://explorer.aptoslabs.com/?network=devnet)

## 🧪 Manual Testing Flow

1. **Buka POS**: <http://localhost:3000/pos>
2. **Select Product**: Click "AIR RO 19L" (Rp 6.000 ~ 0.10 APTOS)
3. **Choose Payment**: Click "🚀 Pay with APTOS"
4. **Scan QR**: Gunakan APTOS wallet untuk scan QR
5. **Send Payment**: Kirim 0.10 APTOS ke address
6. **Verify**: Transaksi ter-confirm di blockchain

## 📞 Support

- **Version**: 2.0.0 APTOS Integration
- **Last Updated**: September 2025
- **Developer**: Watercoin Development Team

---

**🌊 Watercoin APTOS POS System** - Modern blockchain-integrated POS untuk depot air minum dengan full APTOS integration untuk Samsung Tab8 devices.

## 🏗️ Architecture

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   APTOS         │
│   (Next.js 14)  │ ←→ │   (Node.js)     │ ←→ │   (DevNet)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ↑                       ↑                       ↑
    POS Interface         API & Database        Blockchain Storage
```

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14.2.32 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules (optimized for Samsung Tab8)
- **State Management**: React hooks
- **QR Generation**: QRCode.js
- **Responsive**: Tablet-first design (1200x1920)

### Backend

- **Runtime**: Node.js
- **Database**: Prisma ORM + SQLite
- **API**: RESTful endpoints
- **Environment**: Development & Production ready

### Blockchain

- **Platform**: APTOS DevNet
- **SDK**: @aptos-labs/ts-sdk v1.34.0
- **Wallet Support**: Petra, Martian, Pontem, Fewcha
- **Network**: `https://fullnode.devnet.aptoslabs.com`

## 📁 Project Structure

```text
AIv2APTOS/
├── 📁 frontend/                 # Next.js frontend application
│   ├── 📁 app/                  # App Router pages
│   │   ├── 📄 layout.tsx        # Root layout
│   │   ├── 📄 page.tsx          # Homepage dengan sensor monitoring
│   │   └── 📁 pos/              # POS system pages
│   │       ├── 📄 page.tsx      # Main POS interface
│   │       └── 📁 settings/     # POS settings
│   ├── 📁 components/           # React components
│   │   ├── 📄 AptosPayment.tsx  # APTOS payment component
│   │   ├── 📄 Navbar.tsx        # Navigation bar
│   │   └── 📄 SensorCards.tsx   # Sensor display cards
│   ├── 📁 lib/                  # Utility libraries
│   │   ├── 📄 aptosAgent.ts     # APTOS blockchain integration
│   │   ├── 📄 sensor.ts         # Sensor data handling
│   │   └── 📄 standards.ts      # Water quality standards
│   ├── 📁 styles/               # CSS modules
│   │   ├── 📄 globals.css       # Global styles
│   │   └── 📄 pos.module.css    # POS-specific styles (Samsung Tab8 optimized)
│   ├── 📁 tests/                # Test files
│   │   ├── 📄 posFlow.test.ts   # POS flow testing
│   │   └── 📄 priceDisplay.test.ts # Price conversion testing
│   └── 📁 public/               # Static assets
│       ├── 📄 manifest.json     # PWA manifest (Android optimized)
│       └── 🖼️ watercoinlogo.png  # Brand assets
├── 📁 server/                   # Backend server
│   ├── 📁 src/                  # Source code
│   │   ├── 📄 index.ts          # Main server file
│   │   └── 📄 sim.ts            # Sensor simulation
│   └── 📁 prisma/               # Database schema
│       ├── 📄 schema.prisma     # Database models
│       └── 📄 seed.ts           # Initial data
└── 📁 scripts/                  # Deployment scripts
    ├── 📄 test-pos-flow.ps1     # Windows testing script
    ├── 📄 test-pos-flow.sh      # Linux/WSL testing script
    └── 📄 android-deployment.ps1 # Android deployment prep
```

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** 18+
- **npm** atau **yarn**
- **Git**
- **Android Studio** (untuk deployment APK)

### 🔧 Development Setup

#### Windows (CMD/PowerShell)

```powershell
# 1. Clone repository
git clone https://github.com/your-repo/watercoin-aptos.git
cd watercoin-aptos

# 2. Navigate ke frontend
cd "frontend"

# 3. Install dependencies
npm install

# 4. Setup environment variables
copy .env.example .env.local
# Edit .env.local dengan konfigurasi Anda

# 5. Build project
npm run build

# 6. Start development server
npm run dev
```

#### WSL/Linux

```bash
# 1. Clone repository
git clone https://github.com/your-repo/watercoin-aptos.git
cd watercoin-aptos

# 2. Navigate ke frontend
cd frontend

# 3. Install dependencies
npm install

# 4. Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan konfigurasi Anda

# 5. Build project
npm run build

# 6. Start development server
npm run dev
```

### ⚡ Quick Testing (Gunakan Script)

#### Windows

```powershell
cd "c:\Users\GL63\Project Development\Watercoin AI Monitoring\AIv2APTOS"
.\scripts\test-pos-flow.ps1
```

#### WSL/Linux Testing

```bash
cd "/mnt/c/Users/GL63/Project Development/Watercoin AI Monitoring/AIv2APTOS"
chmod +x scripts/test-pos-flow.sh
./scripts/test-pos-flow.sh
```

## 📱 Samsung Tab8 Deployment

### 🌐 Hosting Setup (RumahWeb cPanel)

1. **Login ke RumahWeb cPanel**
2. **File Manager** → Navigate ke `public_html`
3. **Upload** build files dari `frontend/out` atau `frontend/.next`
4. **Node.js Setup** (jika tersedia di hosting):

   ```bash
   cd public_html
   npm install --production
   npm run start
   ```

5. **Environment Variables Setup**:

   ```bash
   # Buat file .env.production
   NEXT_PUBLIC_APTOS_NETWORK=devnet
   NEXT_PUBLIC_WATERCOIN_APTOS_ADDRESS=0xb939d880b6e526f5296806b8984cb2f9ecc2d347ebef46bc74729460926b905c
   NEXT_PUBLIC_APTOS_RPC_URL=https://fullnode.devnet.aptoslabs.com
   NEXT_PUBLIC_API_URL=https://your-domain.com/api
   ```

### 📱 Android App Development

#### Using Android Studio (TWA)

1. **Open Android Studio**
2. **Create New Project** → Select "Trusted Web Activity"
3. **Configure Project**:
   - **App Name**: Watercoin APTOS POS
   - **Package Name**: `com.watercoin.aptospos`
   - **Host URL**: `https://your-domain.com`
   - **Start URL**: `https://your-domain.com/pos`

4. **Optimize for Samsung Tab8**:

   ```xml
   <!-- In app/src/main/res/values/dimens.xml -->
   <resources>
       <dimen name="activity_horizontal_margin">32dp</dimen>
       <dimen name="activity_vertical_margin">32dp</dimen>
       <dimen name="fab_margin">24dp</dimen>
   </resources>
   ```

5. **Screen Orientation** (landscape preferred):

   ```xml
   <!-- In AndroidManifest.xml -->
   <activity
       android:name=".MainActivity"
       android:screenOrientation="landscape"
       android:exported="true">
   ```

#### Build & Deploy APK

```bash
# Generate signed APK
./gradlew assembleRelease

# Install on Samsung Tab8
adb install app/build/outputs/apk/release/app-release.apk
```

## 💰 Price Conversion System

### Current Rates

- **1 APTOS = 65,000 IDR**
- **Conversion**: `Math.ceil(idrToAptos(price) * 100) / 100`
- **Display Format**: "Rp 6.000 ~ 0.10 APTOS"

### Product Pricing

| Product | IDR Price | APTOS Price |
|---------|-----------|-------------|
| AIR RO 19L | Rp 6.000 | 0.10 APTOS |
| GALON 19L AQUA | Rp 20.000 | 0.31 APTOS |
| GALON 19L CLEO | Rp 18.000 | 0.28 APTOS |
| GALON PERTAMA | Rp 65.000 | 1.00 APTOS |

## 🧪 Testing & Quality Assurance

### Automated Tests

```bash
# Run all tests
cd frontend
npx tsx tests/finalVerification.test.ts

# Specific tests
npx tsx tests/priceDisplay.test.ts
npx tsx tests/posFlow.test.ts
npx tsx tests/posFlowSimulation.test.ts
```

### Manual Testing Checklist

- [ ] **Product Selection**: Click all products, verify price display
- [ ] **Price Conversion**: Verify IDR → APTOS accuracy (2 decimal places)
- [ ] **QR Generation**: Test QR code creation for payments
- [ ] **Wallet Integration**: Test deep links (Petra, Martian, Pontem, Fewcha)
- [ ] **Transaction Monitoring**: 10-minute timeout verification
- [ ] **Samsung Tab8 Layout**: Test on 1200x1920 resolution
- [ ] **Touch Targets**: Verify button sizes ≥ 44px
- [ ] **Responsive Design**: Test landscape/portrait modes

### Performance Benchmarks

- **QR Generation**: < 500ms
- **Price Conversion**: < 50ms
- **APTOS Network Call**: < 2s
- **Transaction Verification**: < 30s
- **Page Load Time**: < 3s

## 🔧 Configuration

### Environment Variables

```bash
# Required for APTOS integration
NEXT_PUBLIC_APTOS_NETWORK=devnet
NEXT_PUBLIC_WATERCOIN_APTOS_ADDRESS=0xb939d880b6e526f5296806b8984cb2f9ecc2d347ebef46bc74729460926b905c
NEXT_PUBLIC_APTOS_RPC_URL=https://fullnode.devnet.aptoslabs.com

# Optional for production
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

### Samsung Tab8 Optimizations

- **Screen Resolution**: 1200x1920 pixels
- **Preferred Orientation**: Landscape (1920x1200)
- **Touch Targets**: Minimum 44px x 44px
- **Font Sizes**: 18px+ for readability
- **Grid Layout**: 4 columns (landscape), 2 columns (portrait)

## 🚨 Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### APTOS Connection Issues

```bash
# Verify network connectivity
curl https://fullnode.devnet.aptoslabs.com/v1

# Check wallet address format
echo "0xb939d880b6e526f5296806b8984cb2f9ecc2d347ebef46bc74729460926b905c" | wc -c
```

#### Samsung Tab8 Display Issues

- Verify viewport meta tag in `app/layout.tsx`
- Check CSS media queries for tablet breakpoints
- Test with Chrome DevTools device simulation

### Debug Mode

```bash
# Enable debug logging
export DEBUG=true
npm run dev
```

## 📚 Documentation

### API Endpoints

- **GET** `/api/sensors` - Sensor data
- **POST** `/api/pos` - POS transactions
- **GET** `/api/logo` - Brand assets

### APTOS Integration

- **Wallet Address**: `0xb939d880b6e526f5296806b8984cb2f9ecc2d347ebef46bc74729460926b905c`
- **Network**: DevNet
- **RPC URL**: `https://fullnode.devnet.aptoslabs.com`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/aptos-enhancement`
3. Commit changes: `git commit -am 'Add APTOS feature'`
4. Push to branch: `git push origin feature/aptos-enhancement`
5. Submit Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Email**: <support@watercoin.com>
- **GitHub Issues**: [Create an issue](https://github.com/your-repo/watercoin-aptos/issues)
- **Documentation**: [Full Documentation](https://docs.watercoin.com)

---

**🌊 Watercoin APTOS POS System** - Revolutionary water quality monitoring with blockchain-powered payments for the modern depot air minum.
