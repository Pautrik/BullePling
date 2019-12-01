# BullePling
Noification service that sends out notification whenever they serve meatballs at chalmer's campus

## Setup
1. Clone repository and navigate into the BullePling folder
2. Run the setup script `./setup.sh`
3. Added the line `export EMAIL_ADRESS="name@email.com"` to the end of the env file in the root directory with the email replaced to be your own
4. Run the command `crontab -e` and add the line `45  6 * * * cd /absolute/path/BullePling/broadcaster && npm start` to create a cronjob that checks the menu every morning at 6:45 and sends out notifications to your subscribers if there are any meatballs that day
5. Run the web server, this can be done by running either `npm start` or creating a pm2 config from the web-server directory
