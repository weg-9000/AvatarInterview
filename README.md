# Multi-agent AI Avatar Interview Assistant

<p align="center"> <img src="https://github.com/weg-9000/image/blob/main/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-04-29%20153209.png" alt="Interview Assistant Interface"> </p>
  


An interview preparation application built with a multi-agent system leveraging Azure services and Semantic Kernel framework.

# Solution Acrhitecture
![Solution Architecture](https://github.com/weg-9000/Multi-agent-AI-Avatar-Interview-Assistant/blob/main/Solution_architecture.drawio)

## Project Overview

This project analyzes users' resumes and researches the target company's values to generate tailored interview questions. It then simulates a realistic interview environment through an avatar interface. After the interview, the system analyzes user responses to provide comprehensive feedback and improvement suggestions.

## Key Features

- **Resume Input**: Users can input their entire resume in a seamless markdown-supported interface
- **Company Research Agent**: Automatically researches and analyzes the target company's culture, values, and interview patterns based on the position
- **Personalized Question Generator**: Creates customized interview questions by combining resume details with company research results
- **Avatar Interviewer**: Delivers a realistic interview experience through Azure AI Avatar with synchronized speech and facial expressions
- **Text Input System**: Allows users to type responses directly in a time-limited environment (previously supported voice recognition)
- **Interview Evaluation Agent**: Provides detailed feedback on user responses with strengths, weaknesses, and improvement suggestions in markdown format
- **Result Export**: Enables downloading of interview results as formatted text files


  <p align="center"> <img src="https://github.com/weg-9000/image/blob/main/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-04-29%20153824.png" alt="Interview Evaluation Results"> </p>


## Technology Stack

### Backend

- **FastAPI**: High-performance Python framework for building APIs
- **Azure Cosmos DB**: NoSQL database for storing user data, resumes, and interview results
- **Perplexity API**: Integrated for enhanced contextual understanding and responses
- **Azure Speech Service**: Powers the avatar's speech synthesis capabilities
- **Azure AI Avatar**: Creates the visual interviewer with synchronized lip movements
- **Semantic Kernel**: Microsoft's framework for AI orchestration and agent communication

### Frontend

- **React**: JavaScript library for building the user interface
- **React Router**: Handles navigation between different components
- **React Markdown**: Renders markdown content for resume input and evaluation results
- **Azure Cognitive Services Speech SDK**: Connects to Azure services for avatar interaction


## Installation and Setup

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- Azure account with required services configured:
  - Azure OpenAI or Perplexity API keys
  - Azure Cosmos DB instance
  - Azure Speech Service subscription
  - Azure AI Avatar service access

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Configure environment variables in a `.env` file:
   ```
   OPENAI_API_KEY=your_perplexity_api_key
   AZURE_COSMOS_ENDPOINT=your_cosmos_db_endpoint
   AZURE_COSMOS_KEY=your_cosmos_db_key
   AZURE_SPEECH_KEY=your_speech_key
   AZURE_SPEECH_REGION=your_speech_region
   ```

5. Run the FastAPI server:
   ```
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables in a `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:8000
   REACT_APP_SPEECH_KEY=your_speech_key
   REACT_APP_SPEECH_REGION=your_speech_region
   ```

4. Start the development server:
   ```
   npm start
   ```

## Project Structure

```
interview-assistant/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   └── styles/        # CSS styles
│   ├── public/
│   └── package.json
├── backend/               # FastAPI backend application
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Core configurations
│   │   ├── models/        # Data models
│   │   ├── repositories/  # Database operations
│   │   └── services/      # Business logic
│   ├── main.py            # Application entry point
│   └── requirements.txt
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── Docker-compose.yml     # Docker compose configuration
└── README.md              # Project documentation
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Azure Speech and AI Avatar Services for providing the core technology
- Semantic Kernel framework for enabling multi-agent coordination
- Perplexity API for enhanced contextual understanding
