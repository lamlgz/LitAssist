@echo off

REM Activate virtual environment
call venv\Scripts\activate

REM Migrate database
echo Migrating database...
python manage.py migrate

REM Start Django server
echo Starting Django server...
python manage.py runserver 8080
