Ticket Management System
This is a basic Ticket Management System built with a Django REST Framework backend and a Vite + React (with TypeScript) frontend. The system allows users to manage support tickets, with basic user authentication and role-based access (admin/user).

Features
Backend (Django)
Django REST API for handling ticket operations.
POST /tickets/: Create a new support ticket with fields such as title, description, priority (low, medium, high), status (open, in-progress, resolved), and user.
GET /tickets/: Retrieve a list of all tickets with optional filters for status, priority, and user.
PUT /tickets/<id>/: Update a ticket's details (e.g., status or reassigning the ticket).
DELETE /tickets/<id>/: Delete a specific ticket.
GET /tickets/<id>/: Retrieve details of a specific ticket.
Authentication:
Users can log in and access only their own tickets.
Admins have full access to all tickets and users.
Frontend (React with TypeScript)
Login Page:
Users can log in to access their dashboard.
Dashboard Page:
Displays all tickets with options to filter by status and priority.
Allows users to create new tickets.
Shows only the tickets assigned to the logged-in user.
Ticket Detail Page:
Displays the details of a single ticket.
Allows users to update or delete their tickets (if they have permission).
Admin Page:
Admin users can view all tickets, update their status, assign users, or delete tickets.
Installation and Setup
Backend (Django)
Clone the repository:

bash
Copy code
git clone <repository-url>
cd backend
Set up a virtual environment:

bash
Copy code
python -m venv venv
source venv/bin/activate  # For Windows, use venv\Scripts\activate
Install dependencies:

bash
Copy code
pip install -r requirements.txt
Set up the database:

Configure your database in settings.py (SQLite is the default).
Run migrations:
bash
Copy code
python manage.py migrate
Create a superuser (for admin access):

bash
Copy code
python manage.py createsuperuser
Run the server:

bash
Copy code
python manage.py runserver
The API should now be accessible at http://127.0.0.1:8000/.

Frontend (React with TypeScript)
Clone the repository:

bash
Copy code
git clone <repository-url>
cd frontend
Install dependencies:

bash
Copy code
npm install
Set up environment variables: Create a .env file in the root of the frontend directory and set the backend API URL:

env
Copy code
VITE_BACKEND_API_URL=http://127.0.0.1:8000
Run the frontend:

bash
Copy code
npm run dev
The frontend should now be accessible at http://localhost:5173/.
