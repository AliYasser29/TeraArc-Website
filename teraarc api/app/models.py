from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError

db = SQLAlchemy()

class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    video_url = db.Column(db.String(255), nullable=True)
    github_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, title, description, image_url, video_url=None, github_url=None):
        self.title = title
        self.description = description
        self.image_url = image_url
        self.video_url = video_url
        self.github_url = github_url

    def to_dict(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "description": self.description,
            "imageUrl": self.image_url,
            "videoUrl": self.video_url,
            "githubUrl": self.github_url,
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat()
        }

    @staticmethod
    def validate(data):
        errors = []
        if not data.get('title'):
            errors.append("Title is required")
        if not data.get('description'):
            errors.append("Description is required")
        if not data.get('image_url'):
            errors.append("Image URL is required")
        return errors 