@echo off
echo Starting Docker containers...
docker compose up -d
echo Waiting for PostgreSQL to be healthy...
:wait
docker compose ps | findstr "blogcuration-postgres" | findstr "healthy" >nul 2>&1
if errorlevel 1 (
    timeout /t 3 /nobreak >nul
    goto wait
)
echo PostgreSQL is ready.

echo Checking port 8080...
FOR /F "tokens=5" %%a IN ('netstat -ano ^| findstr ":8080" ^| findstr "LISTENING" 2^>nul') DO (
    echo Killing process %%a on port 8080...
    taskkill /PID %%a /F >nul 2>&1
)

echo Starting BlogCuration backend...
mvn spring-boot:run
