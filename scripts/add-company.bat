@echo off
REM Script to create a new company data file from the default template
REM Usage: scripts\add-company.bat companyname

if "%1"=="" (
    echo Usage: scripts\add-company.bat ^<company-name^>
    echo Example: scripts\add-company.bat tesla
    exit /b 1
)

set COMPANY_NAME=%1
set SOURCE_FILE=data\companies\default.json
set TARGET_FILE=data\companies\%COMPANY_NAME%.json

REM Check if source file exists
if not exist "%SOURCE_FILE%" (
    echo Error: Source file %SOURCE_FILE% not found!
    exit /b 1
)

REM Check if target file already exists
if exist "%TARGET_FILE%" (
    echo Error: Company file %TARGET_FILE% already exists!
    echo If you want to overwrite it, delete it first and run this script again.
    exit /b 1
)

REM Copy the file
copy "%SOURCE_FILE%" "%TARGET_FILE%"

REM Update the company name in the file
powershell -Command "(Get-Content '%TARGET_FILE%') -replace '\"companyName\": \"default\"', '\"companyName\": \"%COMPANY_NAME%\"' | Set-Content '%TARGET_FILE%'"

echo.
echo ✅ Created new company file: %TARGET_FILE%
echo.
echo Next steps:
echo 1. Edit %TARGET_FILE% with company-specific information
echo 2. Run 'npm run dev' to test locally at http://localhost:3000/%COMPANY_NAME%/resume/
echo 3. Run 'npm run build' to generate static pages
echo 4. Commit and push to deploy
