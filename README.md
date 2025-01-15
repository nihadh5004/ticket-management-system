Ticket Management System
Introduction
The Ticket Management System is a web application that allows users to create, manage, and resolve support tickets. It provides a backend built with Django REST Framework and a frontend using React (with TypeScript). The system features user authentication, allowing users to manage their own tickets, while admins have access to manage all tickets.

## **Installation**
To install the Ticket Management System, follow these steps:
  
  ## **Backend (Django)*
  Clone the repository:
  
  ## **git clone*
  https://github.com/username/ticket-management-system.git
  
  ## **Navigate to the backend directory:*
  cd ticket_management_system
  
  ## **Set up a virtual environment: For Linux/macOS:*
  python -m venv venv
  source venv/bin/activate
  For Windows, use venv\Scripts\activate
  
  ## **Install dependencies:*
  pip install -r requirements.txt
  
  ## **Set up the database (SQLite by default):*
  python manage.py migrate
  
  ## **Create a superuser for admin access:*
  python manage.py createsuperuser
  
  ## **Run the Django development server:*
  python manage.py runserver
  
  
  
  ## **Frontend (React + TypeScript)*
  
  ## **Navigate to the frontend directory:*
  cd ticket-frontend
  
  ## **Install dependencies:*
  npm install
  
  ## **Set the backend API URL:*
  /src
  -/environments
  --/environment.ts
    default : http://127.0.0.1:8000 (Change if needed)
  
  ## **Run the development server:*
  npm run dev
  The frontend should now be accessible at http://localhost:5173/.

## **Usage*
  To use the Ticket Management System: 
  
  Open the frontend in your preferred code editor.   
  Run the frontend project:
  npm run dev
  
  Open the backend in your preferred code editor and modify it as needed. 
  Start the project:
  python manage.py runserver
  
  Access the frontend via http://localhost:5173/ and the backend API via http://127.0.0.1:8000/.



## **Fork the repository.*
  Create a new branch for your changes.
  Make your changes.
  Write tests to cover your changes.
  Run the tests to ensure they pass.
  Commit your changes.
  Push your changes to your forked repository.
  Submit a pull request.

Authors and Acknowledgment
The Ticket Management System was created by Nihadh
