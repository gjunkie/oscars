# this script checks if the mongod is running, starts it if not

if pgrep mongod; then
  echo running;
else
  mongod --quiet --dbpath db/;
fi

exit 0;
