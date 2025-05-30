from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from .models import db, Project
from .utils import validate_request
from .config import Config

api = Blueprint('api', __name__)

@api.route("/auth/login", methods=["POST"])
def login():
    try:
        data = request.json
        if not data or "password" not in data:
            return jsonify({"error": "Password is required"}), 400
            
        if data["password"] == Config.ADMIN_PASSWORD:
            # Create access token with admin claim
            access_token = create_access_token(identity={"is_admin": True})
            return jsonify({"access_token": access_token}), 200
        else:
            return jsonify({"error": "Invalid password"}), 401
    except Exception as e:
        return jsonify({"error": "Login failed"}), 500

@api.route("/projects", methods=["GET"])
def get_projects():
    try:
        projects = Project.query.all()
        project_list = [p.to_dict() for p in projects]
        return jsonify(project_list), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch projects"}), 500

@api.route("/projects", methods=["POST"])
def add_project():
    data = request.json
    errors = Project.validate(data)
    
    if errors:
        return jsonify({"errors": errors}), 400

    try:
        project = Project(
            title=data["title"],
            description=data["description"],
            image_url=data["image_url"],
            video_url=data.get("video_url"),
            github_url=data.get("github_url")
        )
        db.session.add(project)
        db.session.commit()
        return jsonify(project.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create project"}), 500

@api.route("/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    try:
        project = Project.query.get_or_404(project_id)
        return jsonify(project.to_dict()), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch project details"}), 500

@api.route("/projects/<int:project_id>", methods=["PUT"])
def update_project(project_id):
    project = Project.query.get_or_404(project_id)
    data = request.json or {}

    try:
        if "title" in data:
            project.title = data["title"]
        if "description" in data:
            project.description = data["description"]
        if "image_url" in data:
            project.image_url = data["image_url"]
        if "video_url" in data:
            project.video_url = data["video_url"]
        if "github_url" in data:
            project.github_url = data["github_url"]

        db.session.commit()
        return jsonify(project.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update project"}), 500

@api.route("/projects/<int:project_id>", methods=["DELETE"])
def delete_project(project_id):
    try:
        project = Project.query.get_or_404(project_id)
        db.session.delete(project)
        db.session.commit()
        return jsonify({"message": "Project deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete project: {str(e)}"}), 500 