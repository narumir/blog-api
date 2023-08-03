#!/bin/sh

cd /home/ubuntu/app

export PATH=~/.npm-global/bin:$PATH

pm2 start ./dist/main.js -i 0 --name api 
