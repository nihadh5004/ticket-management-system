## Ticket Management System
Introduction
The Ticket Management System is a web application that allows users to create, manage, and resolve support tickets. It provides a backend built with Django REST Framework and a frontend using React (with TypeScript). The system features user authentication, allowing users to manage their own tickets, while admins have access to manage all tickets.

## Installation
To install the Ticket Management System, follow these steps:
  
  ``` shell
  git clone https://github.com/nihadh5004/ticket-management-system.git  # Clone the repository: 
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

  # Change the backend API URL(optional):*
  /src
  -/environments
  --/environment.ts
    default : http://127.0.0.1:8000  # (Change if needed)

  npm run dev # The frontend should now be accessible at http://localhost:5173/.
```

  ## All Set To Go
    Access the frontend via http://localhost:5173/ and the backend API via http://127.0.0.1:8000/.

