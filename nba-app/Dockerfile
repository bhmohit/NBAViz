FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY backend /app/backend
COPY manage.py manage.py

RUN python3 manage.py migrate