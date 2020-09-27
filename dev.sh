(
    caddy run --config Caddyfile.local --watch & 
    gulp watch --cwd project-wrapper-web & 
    FLASK_APP=wrapper-api FLASK_ENV=development flask run --port 9000
)
