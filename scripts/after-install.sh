#!/bin/sh

cd /home/ubuntu/app

export PATH=~/.npm-global/bin:$PATH
export NODE_ENV=production

npm install
