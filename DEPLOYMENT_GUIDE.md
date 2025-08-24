# 🚀 Deployment Guide - Turkish Legal AI

Bu rehber, Turkish Legal AI platformunun production ortamına deploy edilmesi için adım adım talimatları içerir.

## 📋 Deployment Seçenekleri

### 🎯 Önerilen Stack
- **Frontend**: Vercel / Netlify 
- **Backend**: Railway / Render / DigitalOcean
- **Database**: (Gelecekte) Supabase / PlanetScale

## 🔧 1. Backend Deploy (Railway - Önerilir)

### Railway ile Deploy
1. Railway hesabı oluşturun: https://railway.app
2. GitHub repository'yi bağlayın
3. **Backend klasörünü** seçin deploy için
4. Environment variables ekleyin:

```env
# Railway Environment Variables
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=anthropic/claude-3-sonnet
HOST=0.0.0.0
PORT=$PORT  # Railway otomatik sağlar
CORS_ORIGINS=https://your-frontend-domain.vercel.app
DEBUG=false
LOG_LEVEL=INFO
```

5. Deploy komutu Railway otomatik algılar:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Alternatif: Render.com
1. Render hesabı oluşturun
2. **Web Service** oluşturun
3. GitHub repo bağlayın, **backend** klasörünü seçin
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Alternatif: DigitalOcean App Platform
1. DigitalOcean hesabı oluşturun
2. App Platform'da yeni app oluşturun
3. GitHub repo bağlayın
4. Backend komponenti ekleyin:
   - Type: Web Service
   - Source Directory: `/backend`
   - Build Command: `pip install -r requirements.txt`
   - Run Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## 🌐 2. Frontend Deploy (Vercel - Önerilir)

### Vercel ile Deploy
1. Vercel hesabı oluşturun: https://vercel.com
2. GitHub repository'yi import edin
3. Framework Preset: **Vite** seçin
4. Root Directory: `.` (proje kökü)
5. Environment Variables ekleyin:

```env
VITE_API_BASE_URL=https://your-backend-railway-url.up.railway.app
VITE_ENV=production
VITE_DEBUG=false
```

6. Deploy butonuna tıklayın!

### Alternatif: Netlify
1. Netlify hesabı oluşturun
2. GitHub repo bağlayın
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Environment variables:
```env
VITE_API_BASE_URL=https://your-backend-url.com
```

## 🔗 3. API Bağlantısı Konfigürasyonu

### Production API URL'i Güncelleme

Backend deploy olduktan sonra, frontend'te API URL'ini güncelleyin:

```typescript
// src/services/legalApiService.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? 'https://your-actual-backend-domain.com' : 'http://localhost:8001');
```

### CORS Konfigürasyonu

Backend'te CORS ayarlarını production domain'iniz ile güncelleyin:

```python
# backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-domain.vercel.app",
        "https://your-custom-domain.com",
        "http://localhost:5173"  # Development için
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🧪 4. Deploy Test Checklist

### Backend Test
```bash
# Health check
curl https://your-backend-domain.com/health

# API documentation
curl https://your-backend-domain.com/docs

# Sample search request
curl -X POST https://your-backend-domain.com/api/yargi/bedesten/search \
  -H "Content-Type: application/json" \
  -d '{"phrase": "iş sözleşmesi", "court_types": ["YARGITAYKARARI"]}'
```

### Frontend Test
1. ✅ Ana sayfa yükleniyor
2. ✅ `/unified-search` sayfası çalışıyor
3. ✅ Arama formu görünür ve işlevsel
4. ✅ API bağlantısı çalışıyor
5. ✅ Sonuçlar doğru görüntüleniyor
6. ✅ Document viewer açılıyor

## 🔑 5. Environment Variables Rehberi

### Backend (.env)
```env
# Zorunlu
OPENROUTER_API_KEY=sk-or-v1-xxxxx
OPENROUTER_MODEL=anthropic/claude-3-sonnet

# Server Config
HOST=0.0.0.0
PORT=8001

# CORS (Production domain'lerinizi ekleyin)
CORS_ORIGINS=https://your-frontend.vercel.app,https://your-domain.com

# Optional
DEBUG=false
LOG_LEVEL=INFO
```

### Frontend (.env.production)
```env
# API Endpoint (Backend deploy URL'i)
VITE_API_BASE_URL=https://your-backend.railway.app

# Production Config
VITE_ENV=production
VITE_DEBUG=false
```

## 🚀 6. Hızlı Deploy (GitHub Actions)

GitHub Actions ile otomatik deploy için `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railwayapp/actions@v1
        with:
          api-token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: vercel/actions@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🔧 7. Docker ile Deploy (Opsiyonel)

Tüm stack'i Docker ile deploy etmek için:

```bash
# Docker containers oluştur ve başlat
docker-compose up -d

# Logları kontrol et
docker-compose logs -f

# Servisleri durdur
docker-compose down
```

## 🌍 8. Custom Domain (Opsiyonel)

### Frontend Custom Domain
1. Vercel/Netlify dashboard'da **Domains** sekmesine git
2. Custom domain ekle: `www.yoursite.com`
3. DNS kayıtlarını güncelle

### Backend Custom Domain
1. Railway/Render'da custom domain ekle
2. CNAME kaydı oluştur
3. SSL sertifikası otomatik aktif olur

## ✅ 9. Production Checklist

### Pre-Deploy
- [ ] Environment variables ayarlandı
- [ ] API endpoints test edildi
- [ ] CORS konfigürasyonu doğru
- [ ] Database bağlantıları (gelecekte)
- [ ] SSL sertifikaları aktif

### Post-Deploy
- [ ] Health checks çalışıyor
- [ ] Arama işlevleri test edildi
- [ ] Error handling çalışıyor
- [ ] Performance monitoring aktif
- [ ] Logging yapılandırıldı

## 🆘 Troubleshooting

### API Connection Issues
```javascript
// Browser Console'da test edin:
fetch('https://your-backend-domain.com/health')
  .then(res => res.json())
  .then(console.log)
  .catch(console.error)
```

### CORS Errors
Backend .env dosyasında CORS_ORIGINS'i kontrol edin:
```env
CORS_ORIGINS=https://your-exact-frontend-domain.vercel.app
```

### Build Failures
```bash
# Dependencies kontrol
npm audit
npm run build

# Backend test
cd backend
pip install -r requirements.txt
python main.py
```

## 📊 10. Production URLs

Deploy tamamlandıktan sonra:

```
🌐 Frontend: https://your-app.vercel.app
🔗 Unified Search: https://your-app.vercel.app/unified-search  
🚀 Backend API: https://your-backend.railway.app
📖 API Docs: https://your-backend.railway.app/docs
💚 Health Check: https://your-backend.railway.app/health
```

Bu rehberi takip ederek Turkish Legal AI platformunuzu başarıyla production'a deploy edebilirsiniz! 🎉