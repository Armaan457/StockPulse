from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Stock_pulse.settings")

app = Celery("Stock_pulse")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

# celery_app.py

from celery import Celery
from celery.schedules import crontab

# Set 'Stock_pulse' as the Celery app name
app = Celery('Stock_pulse', broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')
app.conf.timezone = 'UTC'

# Load task modules from all registered apps (if using Django or similar framework)
app.autodiscover_tasks()

# Configure the beat scheduler for the daily task
app.conf.beat_schedule = {
    
    # Task to run every morning at 9 AM
    'refresh-task-every-morning': {
        'task': 'tasks.download_nasdaq_data',  # Ensure this matches the exact path to your task
        'schedule': crontab(hour=9, minute=0),  # Runs daily at 9:00 AM
    },
}

