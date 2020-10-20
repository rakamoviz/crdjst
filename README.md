# Readme

Copy the .env.example to .env, and change the values inside the file to suit your need.

Build and run using docker:
  - docker build -t crdjst .
  - docker run --name crdjst -it --env-file .env -p 3000:3000 crdjst
  - docker stop crdjst; docker rm crdjst
 
Run without docker:
  - export $(cat .env | xargs); npm install; node .

### Tools

* [Build JWT] - Build JWT online

   [Build JWT]: <http://jwtbuilder.jamiekurtz.com/>
   
### Example

curl -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY3JkanN0LmNvbSIsImlhdCI6MTYwMjcwMDMxNywiZXhwIjoxNjM0MjM2MzE3LCJhdWQiOiJjcmRqc3QiLCJzdWIiOiJhbGljZUBlbWFpbC5jb20iLCJlbWFpbCI6ImFsaWNlQGVtYWlsLmNvbSIsImNyZGpzdC5yb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.98UhJBfRlfwsAaDBhwei2s13Aew9p8lOdx2G8o3u2c8" http://localhost:3000?date=2020-10-20T12:00:00-05:00

### Caveat

During development (without paid fixer.io plan), set the FIXER_HOST in the .env to api.exchangeratesapi.io). For production with paid fixer.io plan, set it to data.fixer.io. Both sites have the same endpoints.

The reason is: free fixer.io does not allow specifying base query parameter, and the default one is EUR instead of USD.