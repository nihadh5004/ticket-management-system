## Ticket Management System
Introduction
The Ticket Management System is a web application that allows users to create, manage, and resolve support tickets. It provides a backend built with Django REST Framework and a frontend using React (with TypeScript). The system features user authentication, allowing users to manage their own tickets, while admins have access to manage all tickets.

## Installation
To install the Ticket Management System, follow these steps:
  
  ``` shell
  https://github.com/username/ticket-management-system.git  # Clone the repository: 
 ```
  ## Backend (Django)
  
  ```shell
  cd ticket_management_system # Navigate to the backend directory

  #Set up a virtual environment: For Linux/macOS
  python -m venv venv
  source venv/bin/activate
  #For Windows, use venv\Scripts\activate

  pip install -r requirements.txt # Install dependencies:
  python manage.py migrate # Set up the database (SQLite by default):
  python manage.py createsuperuser # Create a superuser for admin access:
  python manage.py runserver # Run the Django development server:
```

  ## Frontend (React + TypeScript)
  
  ```shell
  # Navigate to the frontend directory:
  cd ticket-frontend
  # Install dependencies:*
  npm install
  ```

  
  ## Run the development server:
 ```shell 
  # Change the backend API URL(optional):*
  /src
  -/environments
  --/environment.ts
    default : http://127.0.0.1:8000 (Change if needed)

  npm run dev # The frontend should now be accessible at http://localhost:5173/.
```

## Usage
  To use the Ticket Management System: 

  1.Open the frontend in your preferred code editor.   
  2. Modify the source code to fit your needs.
  3.Run the frontend project:
  ```shell
    npm run dev
```
  
  1.Open the backend in your preferred code editor and modify it as needed. 
  2. Modify the source code to fit your needs.
  3.Start the project:
  ```shell
    python manage.py runserver
  ```
  Access the frontend via http://localhost:5173/ and the backend API via http://127.0.0.1:8000/.

