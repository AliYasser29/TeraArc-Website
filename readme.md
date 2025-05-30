# 🌐 Company Website – Pre-launch Version

Welcome to the official website project of our upcoming startup!  
This project includes a static landing page, a Flask-based API for managing projects, and a secure desktop GUI (built with Tkinter) for admin operations.

---

## 🔧 Tech Stack

### 🖥️ Frontend (Landing Page)
- HTML5, CSS3, Vanilla JavaScript
- Fully responsive layout
- Light/Dark Mode toggle
- **No frontend frameworks used**
  - Simpler and faster to develop at this stage
  - Improved loading time and performance
  - Full control over the structure and styling
  - Ideal for a lightweight MVP (Minimum Viable Product)

### 🔙 Backend (API)
- Python + Flask (Flask-RESTful)
- SQLite database
- REST API endpoints for project management
- Secured access with token-based authentication

### ⚙️ Admin GUI (Desktop App)
- Built using Python’s Tkinter
- Custom interface for internal admin use
- Connects directly to the Flask API
- Features:
  - Add new projects
  - Edit existing projects
  - Delete projects
  - Login screen with password authentication via API

---

## 📁 Project Structure

Project root/
    Front-End/
        css/
            style.css
        js/
            theme.js
            scripts.js
            projects.js
        about.html
        contact.html
        index.html
        projects.html
        serveces.html
    TA Admin GUI/
        Admin.py
    teraarc api/
        app/
            __init__.py
            config.py
            models.py
            routes.py
            utils.py
        instance/
            projects.db
    .env
    requirments.txt
    run.py
    readme.md 



---

## 🔐 Security Features

- Token-based authorization for admin API access
- Admin GUI login is protected with a password, validated via API
- CORS configured to only allow requests from the official frontend

---

## 🚀 Getting Started

1. Clone the Repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

2. Install Dependencies
pip install -r requirements.txt

3. Run the Flask API
cd api
python app.py

4. Launch the Admin GUI
cd admin-gui
python gui.py



🛠 Next Steps
Improve UI and animations

Add multi-language support (English & Arabic)

Prepare deployment for public launch

📬 Contact
If you're interested in similar solutions or want to collaborate, feel free to connect with me on LinkedIn [www.linkedin.com/in/ali-yasser-ali].

📜 License
This project is currently under private development. License details will be provided upon official release.


---

Let me know if you'd like to include a logo or a badge (e.g., "Built with Flask", "Dark Mode Supported", etc.) or if you'd like to personalize it with your company name!
