# How to start the application

1. Clone this repository:
   `git clone https://github.com/Shodlik-Shomuratov/nodejs-task.git` and enter the directory `cd nodejs-task`

2. Install the dependencies:
   `npm install`

3. Change `.env.sample` into `.env` and add your credentials there.

4. To map data model into database run this command:
   `npx prisma migrate dev --name init`

5. Run this command:
   `npm run start:dev`
