#!/bin/bash

SOURCE=$1

cd $SOURCE

ls

npm install -g @angular/cli
npm install
ng build
