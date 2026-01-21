#!/bin/bash

# Script to create a new company data file from the default template
# Usage: ./scripts/add-company.sh companyname

if [ -z "$1" ]; then
    echo "Usage: ./scripts/add-company.sh <company-name>"
    echo "Example: ./scripts/add-company.sh tesla"
    exit 1
fi

COMPANY_NAME=$1
SOURCE_FILE="data/companies/default.json"
TARGET_FILE="data/companies/${COMPANY_NAME}.json"

# Check if source file exists
if [ ! -f "$SOURCE_FILE" ]; then
    echo "Error: Source file $SOURCE_FILE not found!"
    exit 1
fi

# Check if target file already exists
if [ -f "$TARGET_FILE" ]; then
    echo "Error: Company file $TARGET_FILE already exists!"
    echo "If you want to overwrite it, delete it first and run this script again."
    exit 1
fi

# Copy the file
cp "$SOURCE_FILE" "$TARGET_FILE"

# Update the company name in the file (works on both macOS and Linux)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\"companyName\": \"default\"/\"companyName\": \"${COMPANY_NAME}\"/" "$TARGET_FILE"
else
    # Linux
    sed -i "s/\"companyName\": \"default\"/\"companyName\": \"${COMPANY_NAME}\"/" "$TARGET_FILE"
fi

echo "✅ Created new company file: $TARGET_FILE"
echo ""
echo "Next steps:"
echo "1. Edit $TARGET_FILE with company-specific information"
echo "2. Run 'npm run dev' to test locally at http://localhost:3000/${COMPANY_NAME}/resume/"
echo "3. Run 'npm run build' to generate static pages"
echo "4. Commit and push to deploy"
