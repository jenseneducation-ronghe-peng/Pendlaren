Pendlaren

Vad:
Ni ska bygga en webbapp som tar en användares position (longitud och latitud) och sedan hämtar närliggande hållplatser. Användaren kan sedan kunna välja en hållplats och se de närmaste avgångarna.

Hur:
Observera att ni behöver använda https för att kunna använda geolocation API. Ni behöver skapa ett konto här (https://www.trafiklab.se/) och efter det skapa ett projekt för att få en API-nyckel.

Steg:

1. Hämta geolocation med geolocation API
2. Gör ett API-anrop mot ReseRobot - reseplanerare med longitud och latitud.
3. Låt användaren välja en hållplats och spara valet.
4. Gör ett API-anrop mot ReseRobot - stolptidstabeller med id:et på hållplatsen (property id i JSON-svaret).
5. Visa avgångarna för användaren.

API:er som behövs:
Geolocation: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

ResRobot - reseplanerare: https://www.trafiklab.se/api/resrobot-reseplanerare

ResRobot - stolptidstabeller: https://www.trafiklab.se/api/resrobot-stolptidtabeller-2

To get start:

1. Go to Terminal
2. cd to project
3. type:
   sudo npm i https-localhost
4. type:
   npm i -g --only=prod https-localhost
5. Type:
   serve
   look at the number of localhost
6. Go to localhost
   ex: https://localhost:443/index.html

/////////////

7. click subscription button
8. go to Inspect -> Network, choose 'save' file, check 'Preview' get UUID
9. go to:
   https://push-notifications-admin.surge.sh/
   Use UUID to push Text you want to notificate users.

/////////////

To change port to run:
PORT=8000 serve
# Pendlaren
