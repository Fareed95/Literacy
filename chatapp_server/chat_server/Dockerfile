
FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory to /app
WORKDIR /app

# Install dependencies
COPY  requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project into the container
COPY . /app/

# RUN python manage.py migrate
# RUN python manage.py collectstatic --noinput


# Set environment variables from build arguments
ARG Reddis_Url_Internal
ARG Reddis_Url_External
ARG Production

# Set environment variables in the container
ENV Reddis_Url_Internal=$Reddis_Url_Internal
ENV Reddis_Url_External=$Reddis_Url_External
ENV Production=$Production


# Start the server
CMD ["daphne", "--bind", "0.0.0.0", "--port", "3500", "chat_server.wsgi:application"]
