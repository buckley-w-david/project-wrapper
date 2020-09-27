#!/bin/sh

gunicorn \
  --worker-tmp-dir=/dev/shm \
  --workers=2 \
  --threads=4 \
  --worker-class=gthread  \
  --log-file=- \
  --bind=0.0.0.0:9000 \
  wrapper_api.wsgi:app
