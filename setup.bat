call npm install
cd server
call npm install

call npm install typescript -g
call npm install gulp -g
call npm install typings -g
typings install

#delete browser files created by typings
del "typings\browser.d.ts" 
rd "typings\browser" /Q /S

cd..
gulp
cd server
call start "http://localhost:4000"
call node app.js

