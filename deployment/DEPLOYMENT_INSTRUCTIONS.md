# WATERCOIN APTOS POS - Hosting Deployment Instructions

## RumahWeb cPanel Deployment

1. **Login ke RumahWeb cPanel**
2. **File Manager** → Navigate ke public_html
3. **Upload** semua file dari folder deployment ini
4. **Extract** jika dalam format ZIP
5. **Setup Node.js** (jika tersedia):
   - cd public_html
   - npm install --production
   - npm run start

## Environment Variables
File .env.production sudah disertakan dengan konfigurasi APTOS DevNet.
Sesuaikan NEXT_PUBLIC_API_URL dengan domain hosting Anda.

## Domain Configuration
- Pastikan domain mengarah ke public_html
- Setup SSL certificate untuk HTTPS
- Test APTOS payment di https://your-domain.com/pos

## Support
Jika ada masalah, hubungi support hosting untuk bantuan Node.js setup.
