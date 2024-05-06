# File Management System

## Overview

This project is a fully functional file management system designed to streamline the process of uploading and managing experiment codes by students. It integrates a React frontend with a Django backend connected by Django Rest Framework (DRF).

## Features

- **User Authentication**: Students and admins can securely log in to the system.
- **File Upload**: Students can upload their experiment codes through intuitive React pages.
- **Organization**: Files are organized by class and lab for easy access.
- **Admin Access**: Admins have access to all files and can take prints of files for each student.
- **PDF Compilation**: Backend automatically joins files of each experiment together as a single PDF for efficient printing.

## Technologies Used

- **Frontend**: React
- **Backend**: Django
- **API**: Django Rest Framework (DRF)

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/your/repository.git
```

2. Navigate to the project directory:

```bash
cd project-directory
```

3. Install dependencies:

```bash
npm install     # For React frontend
pip install -r requirements.txt   # For Django backend
```

4. Configure Django backend:
   - Set up database configurations in `settings.py`.
   - Perform migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

5. Start the development servers:
   - For React frontend:

```bash
npm start
```

   - For Django backend:

```bash
python manage.py runserver
```

6. Access the application:
   - Frontend: Open your browser and navigate to `http://localhost:3000`.
   - Backend: API endpoints are accessible at `http://localhost:8000/api/`.

## Usage

- Students can log in, navigate to their respective experiment slots, and upload their codes.
- Admins can log in, access all files, organize them by class and lab, and take prints of files for each student.

## Contributors

- John Doe (@johndoe)
- Jane Smith (@janesmith)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
