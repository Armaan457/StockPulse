# StockPulse

An all in one stock market analysis platform that combines AI powered insights with comprehensive tools for informed investment decisions.

## Features

- **Stock Analysis & Predictions:** In-depth portfolio analysis with AI-powered market predictions
- **Dual-Layer Analysis:** Combines sentiment analysis of market news with quantitative backtesting
- **Learning Hub:** Personalized educational resources for investment strategies
- **Community Forum:** Connect and discuss with fellow investors

## Tech Stack

- **Frontend**: React 
- **Backend**: Django REST Framework
- **Database**: SQLite and Pinecone
- **AI/ML**: CrewAI and LangChain

## Setup

### Backend
1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Activate virtual environment:
   - **macOS/Linux:**
     ```bash
     source env/bin/activate
     ```
   - **Windows:**
     ```bash
     env\Scripts\activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start  server:
   ```bash
   python manage.py runserver
   ```

### Frontend
1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Contributors

- [Armaan Jagirdar](https://github.com/Armaan457)
- [Lakshay Sawhney](https://github.com/lakshaysawhney)
- [Yajat Pahuja](https://github.com/yajatpahuja) 
- [Himanish Puri](https://github.com/himanishpuri)

Built during the brAInwave hackathon by AIMS-DTU in 2024.
