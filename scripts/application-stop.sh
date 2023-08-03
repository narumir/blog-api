#!/bin/sh

cd /home/ubuntu/app

export PATH=~/.npm-global/bin:$PATH

pm2 stop api
