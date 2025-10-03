#!/bin/sh
# wait-for-it.sh

host="$1"
shift
cmd="$@"

until nc -z "$host" 5432; do
  echo "Waiting for database at $host:5432..."
  sleep 1
done

echo "Database is up — executing command"
exec $cmd
