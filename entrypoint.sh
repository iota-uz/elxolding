#!/bin/sh
set -e

# Create .env file from environment variables
cat > /build/.env << EOF
SESSION_DURATION=${SESSION_DURATION:-720h}
DOMAIN=${DOMAIN:-localhost}
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-shd_llc}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}
GO_APP_ENV=${GO_APP_ENV:-dev}
SID_COOKIE_KEY=${SID_COOKIE_KEY:-sid}
EOF

# Display created .env file (useful for debugging)
echo "Generated .env file:"
cat /build/.env

# Run all commands in sequence with error handling
echo "Running database migration..."
if ! /build/migrate up; then
    echo "Migration failed with exit code $?"
    exit 1
fi
echo "Migration completed successfully."

echo "Seeding database..."
if ! /build/seed_db; then
    echo "Database seeding failed with exit code $?"
    exit 1
fi
echo "Database seeding completed successfully."

echo "Starting server..."
/build/run_server
