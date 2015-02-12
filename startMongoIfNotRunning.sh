# this script checks if the mongod is running, starts it if not

if pgrep -s mongod; then
  echo running;
else
  mkdir -p db
  mongod --quiet --dbpath db/;
fi

exit 0;
