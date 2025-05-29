import customtkinter as ctk
import requests
from tkinter import messagebox
import json

API_URL = "link/api"

def get_headers():
    return {
        "Content-Type": "application/json"
    }

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

class LoginDialog(ctk.CTkToplevel):
    def __init__(self, parent):
        super().__init__(parent)
        self.title("Login")
        self.geometry("300x150")
        self.resizable(False, False)
        
        self.password_var = ctk.StringVar()
        
        # Center the window
        self.update_idletasks()
        width = self.winfo_width()
        height = self.winfo_height()
        x = (self.winfo_screenwidth() // 2) - (width // 2)
        y = (self.winfo_screenheight() // 2) - (height // 2)
        self.geometry(f'{width}x{height}+{x}+{y}')
        
        # Make it modal
        self.transient(parent)
        self.grab_set()
        
        # Create widgets
        ctk.CTkLabel(self, text="Enter Admin Password:").pack(pady=10)
        self.password_entry = ctk.CTkEntry(self, show="*", textvariable=self.password_var)
        self.password_entry.pack(pady=10, padx=20, fill="x")
        
        self.login_button = ctk.CTkButton(self, text="Login", command=self.login)
        self.login_button.pack(pady=10)
        
        self.result = None
        
        # Bind Enter key to login
        self.password_entry.bind('<Return>', lambda event: self.login())
        
    def login(self):
        try:
            password = self.password_var.get()
            if not password:
                messagebox.showerror("Error", "Please enter a password")
                return
                
            response = requests.post(
                f"{API_URL}/auth/login",
                json={"password": password},
                headers=get_headers()
            )
            
            if response.status_code == 200:
                self.result = True
                self.destroy()
            else:
                error_msg = response.json().get('error', 'Invalid password')
                messagebox.showerror("Error", error_msg)
        except Exception as e:
            messagebox.showerror("Error", f"Login failed: {str(e)}")

class ProjectManagerApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Project Manager")
        self.geometry("1000x600")
        self.minsize(800, 500)
        self.grid_columnconfigure((0, 1), weight=1)
        self.grid_rowconfigure((0, 1, 2, 3, 4, 5, 6), weight=1)
        
        # Show login dialog
        self.show_login()
        
        # Search bar
        self.search_var = ctk.StringVar()
        self.search_entry = ctk.CTkEntry(self, placeholder_text="Search by title...", textvariable=self.search_var)
        self.search_entry.grid(row=0, column=0, columnspan=2, padx=10, pady=(10, 5), sticky="ew")
        self.search_entry.bind("<KeyRelease>", lambda event: self.load_projects())
        
        # Project List Frame
        self.project_frame = ctk.CTkScrollableFrame(self, width=300)
        self.project_frame.grid(row=1, column=0, rowspan=6, padx=10, pady=10, sticky="nsew")
        self.project_frame.grid_columnconfigure(0, weight=1)
        
        # Input Fields
        self.title_entry = ctk.CTkEntry(self, placeholder_text="Title")
        self.title_entry.grid(row=1, column=1, padx=10, pady=5, sticky="ew")
        
        self.description_entry = ctk.CTkEntry(self, placeholder_text="Description")
        self.description_entry.grid(row=2, column=1, padx=10, pady=5, sticky="ew")
        
        self.image_entry = ctk.CTkEntry(self, placeholder_text="Image URL")
        self.image_entry.grid(row=3, column=1, padx=10, pady=5, sticky="ew")
        
        self.video_entry = ctk.CTkEntry(self, placeholder_text="Video URL")
        self.video_entry.grid(row=4, column=1, padx=10, pady=5, sticky="ew")
        
        self.github_entry = ctk.CTkEntry(self, placeholder_text="GitHub URL")
        self.github_entry.grid(row=5, column=1, padx=10, pady=5, sticky="ew")
        
        # Buttons
        self.button_frame = ctk.CTkFrame(self)
        self.button_frame.grid(row=6, column=1, padx=10, pady=10, sticky="ew")
        self.button_frame.grid_columnconfigure((0, 1, 2, 3), weight=1)
        
        ctk.CTkButton(self.button_frame, text="Refresh", command=self.load_projects).grid(row=0, column=0, padx=5)
        ctk.CTkButton(self.button_frame, text="Add", command=self.add_project).grid(row=0, column=1, padx=5)
        ctk.CTkButton(self.button_frame, text="Update", command=self.update_project).grid(row=0, column=2, padx=5)
        ctk.CTkButton(self.button_frame, text="Delete", command=self.delete_project).grid(row=0, column=3, padx=5)
        
        self.current_project_id = None
        self.project_buttons = {}  # Store project buttons for reference
        self.load_projects()
    
    def show_login(self):
        login_dialog = LoginDialog(self)
        self.wait_window(login_dialog)
        if not login_dialog.result:
            self.destroy()
            exit()
    
    def on_project_select(self, project_id):
        self.load_project_details(project_id)
    
    def load_project_details(self, project_id):
        try:
            response = requests.get(f"{API_URL}/projects/{project_id}", headers=get_headers())
            if response.status_code == 200:
                project = response.json()
                self.current_project_id = project_id
                self.title_entry.delete(0, "end")
                self.title_entry.insert(0, project["title"])
                self.description_entry.delete(0, "end")
                self.description_entry.insert(0, project["description"])
                self.image_entry.delete(0, "end")
                self.image_entry.insert(0, project["imageUrl"])
                self.video_entry.delete(0, "end")
                self.video_entry.insert(0, project.get("videoUrl", ""))
                self.github_entry.delete(0, "end")
                self.github_entry.insert(0, project.get("githubUrl", ""))
                
                # Update button states
                for pid, btn in self.project_buttons.items():
                    if pid == project_id:
                        btn.configure(fg_color=("gray75", "gray25"))
                    else:
                        btn.configure(fg_color=("gray70", "gray30"))
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load project details: {str(e)}")
    
    def load_projects(self):
        try:
            response = requests.get(f"{API_URL}/projects", headers=get_headers())
            if response.status_code == 200:
                projects = response.json()
                
                # Clear existing buttons
                for widget in self.project_frame.winfo_children():
                    widget.destroy()
                self.project_buttons.clear()
                
                keyword = self.search_var.get().lower()
                for p in projects:
                    if keyword in p["title"].lower():
                        btn = ctk.CTkButton(
                            self.project_frame,
                            text=f"{p['id']}: {p['title']}",
                            command=lambda pid=p['id']: self.on_project_select(pid),
                            fg_color=("gray70", "gray30"),
                            hover_color=("gray65", "gray35"),
                            anchor="w",
                            height=35
                        )
                        btn.grid(row=len(self.project_buttons), column=0, padx=5, pady=2, sticky="ew")
                        self.project_buttons[p['id']] = btn
                        
                        # Highlight current project if any
                        if self.current_project_id == p['id']:
                            btn.configure(fg_color=("gray75", "gray25"))
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load projects: {str(e)}")
    
    def add_project(self):
        data = {
            "title": self.title_entry.get(),
            "description": self.description_entry.get(),
            "image_url": self.image_entry.get(),
            "video_url": self.video_entry.get(),
            "github_url": self.github_entry.get(),
        }
        try:
            response = requests.post(f"{API_URL}/projects", json=data, headers=get_headers())
            if response.status_code == 201:
                messagebox.showinfo("Success", "Project added successfully!")
                self.clear_inputs()
                self.load_projects()
            else:
                messagebox.showerror("Error", f"Failed to add project: {response.json().get('error', 'Unknown error')}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to add project: {str(e)}")
    
    def update_project(self):
        if not self.current_project_id:
            messagebox.showwarning("Warning", "Please select a project to update")
            return
            
        data = {
            "title": self.title_entry.get(),
            "description": self.description_entry.get(),
            "image_url": self.image_entry.get(),
            "video_url": self.video_entry.get(),
            "github_url": self.github_entry.get(),
        }
        try:
            response = requests.put(f"{API_URL}/projects/{self.current_project_id}", json=data, headers=get_headers())
            if response.status_code == 200:
                messagebox.showinfo("Success", "Project updated successfully!")
                self.clear_inputs()
                self.load_projects()
            else:
                messagebox.showerror("Error", f"Failed to update project: {response.json().get('error', 'Unknown error')}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to update project: {str(e)}")
    
    def delete_project(self):
        if not self.current_project_id:
            messagebox.showwarning("Warning", "Please select a project to delete")
            return
            
        if messagebox.askyesno("Confirm Delete", "Are you sure you want to delete this project?"):
            try:
                response = requests.delete(
                    f"{API_URL}/projects/{self.current_project_id}",
                    headers=get_headers()
                )
                
                if response.status_code == 200:
                    messagebox.showinfo("Success", "Project deleted successfully!")
                    self.clear_inputs()
                    self.load_projects()
                elif response.status_code == 404:
                    messagebox.showerror("Error", "Project not found")
                else:
                    error_msg = response.json().get('error', 'Unknown error')
                    messagebox.showerror("Error", f"Failed to delete project: {error_msg}")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to delete project: {str(e)}")
    
    def clear_inputs(self):
        self.current_project_id = None
        self.title_entry.delete(0, "end")
        self.description_entry.delete(0, "end")
        self.image_entry.delete(0, "end")
        self.video_entry.delete(0, "end")
        self.github_entry.delete(0, "end")
        
        # Reset button colors
        for btn in self.project_buttons.values():
            btn.configure(fg_color=("gray70", "gray30"))

if __name__ == "__main__":
    app = ProjectManagerApp()
    app.mainloop()
