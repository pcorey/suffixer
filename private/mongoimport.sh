#!/bin/sh
mongoimport --host localhost:3001 -d meteor -c dictionary --type json --file private/dictionary-transformed.json