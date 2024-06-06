# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Set the PYTHONPATH
ENV PYTHONPATH=/app/src

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r src/requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run main.py when the container launches
CMD ["python", "src/main.py"]
