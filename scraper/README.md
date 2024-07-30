# Scraper

Grabbing GE, course, and professor info

## Preqrequisites

- [Python](https://www.python.org/) 3+

## Getting Started

1. Create an `.env` file with the API URLs

   ```
   COURSES_API=
   PROFESSORS_API=
   PROFESSORS_AUTH=
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
