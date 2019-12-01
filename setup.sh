#!/bin/bash

# 1. Installs node dependencies
cd broadcaster
npm i
cd ../db
npm i
cd ../notification-manager
npm i
cd ../web-server
npm i

# 2. Generates web-push keys
RAW_OUTPUT="$(npx web-push generate-vapid-keys --json)"
node -e "const a=JSON.parse(process.argv[1]); console.log('export PRIVATE_VAPID_KEY=\"'+ a.privateKey + '\"\nexport PUBLIC_VAPID_KEY=\"' + a.publicKey + '\"')" ${RAW_OUTPUT} > env
