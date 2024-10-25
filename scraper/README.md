# Scraper

Grabbing GE, course, and professor info

## Preqrequisites

- [Python](https://www.python.org/) 3+

## Getting Started

1. Create an `.env` file with the API URLs and MongoDB URI

   ```
   COURSES_API=xyz.com
   PROFESSORS_API=www.xyz.com
   PROFESSORS_AUTH=
   MONGODB_URI=
   ```

2. (Optional) Set up a venv

   ```
   python -m venv .venv
   .venv\scripts\activate
   ```

3. Install dependencies

   ```
   pip install -r requirements.txt
   ```

4. Run the scraping app

   ```
   py main.py
   ```
