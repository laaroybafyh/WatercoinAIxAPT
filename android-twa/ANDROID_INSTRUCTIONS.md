# WATERCOIN APTOS POS - Android APK Instructions

## Prerequisites
- Android Studio terinstall
- Samsung Tab8 dalam developer mode
- Domain hosting sudah siap

## Steps untuk membuat APK:

### 1. Buka Android Studio
- File → New → New Project
- Pilih "Phone and Tablet" → "Empty Activity"
- Name: Watercoin APTOS POS
- Package: com.watercoin.aptospos
- Language: Java
- Minimum SDK: API 21

### 2. Setup Trusted Web Activity
- Tambahkan dependency di build.gradle:
  implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'

### 3. Replace AndroidManifest.xml
- Gunakan file AndroidManifest.xml yang ada di folder ini
- Ganti "your-domain.com" dengan domain hosting Anda

### 4. Configure untuk Samsung Tab8
- res/values/styles.xml:
  <style name="Theme.WatercoinAPTOS" parent="Theme.AppCompat.Light.NoActionBar">
    <item name="colorPrimary">#0D6CA3</item>
    <item name="android:screenOrientation">landscape</item>
  </style>

### 5. Build APK
- Build → Generate Signed Bundle/APK
- Pilih APK
- Create new keystore untuk production
- Build release APK

### 6. Install di Samsung Tab8
- Enable Developer Options di Tab8
- Enable USB Debugging
- Connect Tab8 ke komputer
- adb install app-release.apk

### 7. Testing
- Buka aplikasi di Tab8
- Test dalam landscape mode (1200x1920)
- Verify POS flow dengan APTOS payment
- Test QR scanning dengan APTOS wallet

## Optimizations untuk Samsung Tab8
- Gunakan landscape orientation
- Touch targets minimum 44dp
- Test dengan finger navigation
- Optimize untuk tablet screen size

## Production Deployment
- Upload APK ke Google Play Console (internal testing)
- Setup proper app signing
- Configure domain verification
- Test dengan real users

## Troubleshooting
- Jika TWA tidak load: Check domain SSL certificate
- Jika payment fail: Verify APTOS DevNet connection
- Jika UI issues: Check responsive CSS untuk tablet

Contact: Watercoin Development Team
