# Development Setup Guide

This project integrates the existing turklaw-ai-insight frontend with a comprehensive Turkish Legal AI backend and the new unified search interface.

## Project Structure

```
existing-project/
├── backend/                    # Turkish Legal AI FastAPI backend
│   ├── main.py                # Main FastAPI application
│   ├── requirements.txt       # Python dependencies
│   ├── yargi_endpoints.py     # Yargi MCP endpoints
│   └── mevzuat_endpoints.py   # Mevzuat MCP endpoints
├── src/
│   ├── components/
│   │   ├── search/
│   │   │   ├── UnifiedSearchForm.tsx    # New unified search form
│   │   │   └── SearchResults.tsx        # Enhanced search results
│   │   └── document/
│   │       └── DocumentViewer.tsx       # Document viewer component
│   ├── services/
│   │   └── legalApiService.ts           # API service layer
│   └── pages/
│       └── UnifiedSearchPage.tsx        # New unified search page
├── package.json               # Frontend dependencies
└── DEVELOPMENT_SETUP.md      # This file
```

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Python** (v3.11 or higher)
3. **pip** (Python package manager)

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
npm run install:backend
```

Or manually:
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# OpenRouter API (for LLM features)
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=anthropic/claude-3-sonnet

# Server Configuration
HOST=localhost
PORT=8001

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

Create a `.env` file in the root directory for frontend:

```env
VITE_API_BASE_URL=http://localhost:8001
```

### 4. Development Server

#### Option A: Run Both Frontend and Backend Together
```bash
npm run dev:all
```

#### Option B: Run Separately

**Frontend only:**
```bash
npm run dev
```

**Backend only:**
```bash
npm run dev:backend
```

## Available Routes

### Frontend Routes
- `/` - Home page
- `/login` - Authentication
- `/dashboard` - User dashboard  
- `/search` - Original search page
- `/unified-search` - **New unified search page** 🆕
- `/profile` - User profile

### Backend API Endpoints

#### Health & Status
- `GET /health` - API health check
- `GET /api/yargi/health` - Turkish legal servers health

#### Yargi (Court) Endpoints (38 tools)
- `POST /api/yargi/bedesten/search` - Multi-court search
- `GET /api/yargi/bedesten/document/{id}` - Document retrieval
- `POST /api/yargi/anayasa/search` - Constitutional Court search
- `POST /api/yargi/emsal/search` - Precedent decisions search
- And 34+ more endpoints...

#### Mevzuat (Legislation) Endpoints (3 tools)
- `POST /api/mevzuat/search` - Legislation search
- `GET /api/mevzuat/legislation/{id}/structure` - Document structure
- `GET /api/mevzuat/legislation/{id}/article/{article_id}` - Article content

## Key Features

### 🔧 Integrated Architecture
- **Frontend**: React + Vite + TypeScript + ShadCN/UI
- **Backend**: FastAPI + MCP Servers Integration
- **API Layer**: Type-safe with Zod validation
- **State Management**: React hooks + context

### 🎯 Turkish Legal AI Components

#### UnifiedSearchForm
- Multi-court system selection (10+ court types)
- Advanced filtering by date, court type, etc.
- Form validation with Zod + React Hook Form
- Responsive design for mobile/desktop

#### SearchResults
- Structured display of legal documents
- Relevance scoring and highlighting  
- Favorites management
- Export and sharing capabilities
- Pagination and infinite scroll

#### DocumentViewer
- Full-text document display with Markdown rendering
- Search within document functionality
- Print and download capabilities
- Metadata sidebar with case details
- Related documents suggestions

### 🔗 API Integration
- **41+ Tools**: Complete integration of yargi-mcp and mevzuat-mcp
- **Error Handling**: Comprehensive error boundaries
- **Type Safety**: Full TypeScript support with Zod schemas
- **Performance**: Optimized API calls with caching

### 🏛️ Supported Legal Systems
1. **Bedesten** - Multi-court unified search (Yargıtay, Danıştay, etc.)
2. **Anayasa** - Constitutional Court decisions
3. **Mevzuat** - Turkish legislation and regulations
4. **Emsal** - Precedent court decisions
5. **Uyuşmazlık** - Jurisdictional dispute court
6. **KİK** - Public Procurement Authority
7. **Rekabet** - Competition Authority
8. **Sayıştay** - Court of Accounts
9. **KVKK** - Personal Data Protection Authority
10. **BDDK** - Banking Regulation Authority

## Development Workflow

### 1. Start Development Environment
```bash
npm run dev:all
```

### 2. Access Applications
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs

### 3. Test the Integration
1. Navigate to http://localhost:5173/unified-search
2. Select a court system (e.g., "Çoklu Mahkeme")
3. Enter a search term (e.g., "iş sözleşmesi")
4. Submit search and view results
5. Click on a result to open document viewer

## Troubleshooting

### Backend Issues
```bash
# Check if backend is running
curl http://localhost:8001/health

# Install missing Python dependencies
cd backend && pip install -r requirements.txt

# Check Python version
python --version  # Should be 3.11+
```

### Frontend Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

### API Connection Issues
1. Verify backend is running on port 8001
2. Check CORS settings in backend/.env
3. Verify VITE_API_BASE_URL in frontend .env
4. Check browser network tab for API calls

## Next Steps

### Immediate Tasks
1. ✅ Complete component integration
2. ⏳ Set up development environment
3. ⏳ Test all search systems  
4. ⏳ Configure production deployment

### Future Enhancements
- User authentication integration
- Search history and favorites persistence
- Advanced document analysis with AI
- Export to multiple formats (PDF, DOCX, etc.)
- Real-time collaborative features

## Tech Stack Summary

**Frontend:**
- React 18 + TypeScript
- Vite for build tooling
- ShadCN/UI component library
- Tailwind CSS for styling
- React Hook Form + Zod validation
- React Query for API state management

**Backend:**
- FastAPI (Python)
- MCP (Model Context Protocol) integration
- Pydantic for data validation
- yargi-mcp + mevzuat-mcp servers
- OpenRouter LLM integration

**Development Tools:**
- ESLint + TypeScript ESLint
- Concurrently for parallel processes
- Hot reload for both frontend/backend

This setup provides a complete Turkish Legal AI platform with advanced search capabilities across all major Turkish court systems and legal databases.