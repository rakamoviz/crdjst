# Readme

Copy the .env.example to .env, and change the values inside the file to suit your need.

Build and run using docker:
  - docker build -t crdjst .
  - docker run --name crdjst -it --env-file .env -p 3000:3000 crdjst
  - docker stop crdjst; docker rm crdjst
 
Run without docker (dev mode):
  - export $(cat .env | xargs); npm install; npm run dev

### Tools

* [Build JWT] - Build JWT online

   [Build JWT]: <http://jwtbuilder.jamiekurtz.com/>
   
### Example

curl -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY3JkanN0LmNvbSIsImlhdCI6MTYwMjcwMDMxNywiZXhwIjoxNjM0MjM2MzE3LCJhdWQiOiJjcmRqc3QiLCJzdWIiOiJhbGljZUBlbWFpbC5jb20iLCJlbWFpbCI6ImFsaWNlQGVtYWlsLmNvbSIsImNyZGpzdC5yb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.98UhJBfRlfwsAaDBhwei2s13Aew9p8lOdx2G8o3u2c8" http://localhost:3000/rates?date=2020-10-20T12:00:00-05:00

### Caveat

During development (without paid fixer.io plan), set the FIXER_HOST in the .env to api.exchangeratesapi.io). For production with paid fixer.io plan, set it to data.fixer.io. Both sites have the same endpoints.

The reason is: free fixer.io does not allow specifying base query parameter, and the default one is EUR instead of USD.

### JWT Tokens
    - This JWT token was generated using online tool mentioned above, and it expires on the year 2021. Use it for happy-path test: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY3JkanN0LmNvbSIsImlhdCI6MTYwMjcwMDMxNywiZXhwIjoxNjM0MjM2MzE3LCJhdWQiOiJjcmRqc3QiLCJzdWIiOiJhbGljZUBlbWFpbC5jb20iLCJlbWFpbCI6ImFsaWNlQGVtYWlsLmNvbSIsImNyZGpzdC5yb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.98UhJBfRlfwsAaDBhwei2s13Aew9p8lOdx2G8o3u2c8

    - This JWT token was generated too, and set to expire last year. Use it for the "token" expire case. Should get 403 due to the JWT-validation in the code: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MDMyMjk4MDQsImV4cCI6MTU3MTYwNzQwNCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.stRZV23NP9uFFi834j8rp5kvQX8y7dgbfiXsxg8lJ3I

### Manual tests
  - Authorized cases: first, set JWT_TOKEN env variable to the one that expires in 2021 (see above): export JWT_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY3JkanN0LmNvbSIsImlhdCI6MTYwMjcwMDMxNywiZXhwIjoxNjM0MjM2MzE3LCJhdWQiOiJjcmRqc3QiLCJzdWIiOiJhbGljZUBlbWFpbC5jb20iLCJlbWFpbCI6ImFsaWNlQGVtYWlsLmNvbSIsImNyZGpzdC5yb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.98UhJBfRlfwsAaDBhwei2s13Aew9p8lOdx2G8o3u2c8 . 
    - Use current date: curl -H "Authorization: Bearer $JWT_TOKEN" http://localhost:3000/rates?date=2020-10-20T12:00:00-05:00 (should give: [{"source":"banxico","rate":"21.0902"},{"source":"dof","rate":"21.1765"},{"source":"fixer","rate":"21.1951735817"}])
    - Use date from the future: curl -H "Authorization: Bearer $JWT_TOKEN" http://localhost:3000/rates?date=2022-10-20T12:00:00-05:00 (should give: [{"source":"banxico","rate":"n/a"},{"source":"dof","rate":"n/a"},{"source":"fixer","rate":"n/a"}]) . On the backend, the following string is printed to the console: {"name":"crdjst","hostname":"cnc","pid":48724,"level":40,"type":"core-business","error-class":"future date","dateStr":"2022-10-20T12:00:00-05:00","currentDate":"2020-10-20T22:40:43.412Z","msg":"","time":"2020-10-20T22:40:43.413Z","v":0}
    - Simulate network failure calling dof. Change the value of DOF_URL in the .env to https://www.banxico.org.hh/tipcamb/tipCamIHAction.do  . You should get response like: [{"source":"banxico","rate":21.0902},{"source":"dof","rate":"n/a"},{"source":"fixer","rate":21.1951735817}]. On the server the following warning should be printed: {"name":"crdjst","hostname":"cnc","pid":49667,"level":40,"type":"rate-fetcher","rate-fetcher":"dof","error-class":"fetchFromSite","dateStr":"2020-10-20T12:00:00-05:00","message":"getaddrinfo ENOTFOUND www.banxico.org.hh","msg":"","time":"2020-10-20T22:47:20.425Z","v":0}
    - Do the same with fixer and banxico, modify the hostname in the .env to something non-existent

  - Non-authorized case. 
    - Try accesing without token: curl -v http://localhost:3000/rates?date=2020-10-20T12:00:00-05:00 . You shoul dsee you're getting HTTP-401 response.
    - Try accessing with expired token: 
      -  export JWT_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MDMyMjk4MDQsImV4cCI6MTU3MTYwNzQwNCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.stRZV23NP9uFFi834j8rp5kvQX8y7dgbfiXsxg8lJ3I
      - curl -v -H "Authorization: Bearer $JWT_TOKEN" http://localhost:3000/rates?date=2020-10-20T12:00:00-05:00 . You should see you are getting HTTP-403

Since this is an API, the token-obtaining is out of scope. In the keycloak's (http://keycloak.org) , this API should be configured as "bearer only". If keycloak were used, the token checking can be delegated to middleware provided by https://www.npmjs.com/package/keycloak-connect

### Simple load-test (to verify rate-limiting) using curl

  - In the .env set APP_RATELIMIT_WINDOW to 1 and APP_RATELIMIT_MAX to 1. This basically allows only one request within one-minute window. You'd have to wait one minute before you can make another one.
  - Bring up the server: npm run dev
  - Execute curl -v -H "Authorization: Bearer $JWT_TOKEN" http://localhost:3000/rates?date=2020-10-20T12:00:00-05:00
  - And followed immediately with same command.

The first request should give you the rates. The second request should give you HTTP-429.

Repeat the same steps, only changing the APP_RATELIMIT_MAX to 2. Now you should be able to make 2 consecutive request within one minute. The third and subsequent requests within the same window will be rejected with HTTP-429

If you need to test with higher APP_RATELIMIT_MAX and higher APP_RATELIMIT_WINDOW, this command for simple load test using bash can help: rm perf-test.log; ./load-test.sh 5 http://localhost:3000/rates?date=2020-10-20T12:00:00-05:00 |tee -a perf-test.log

The bash script is downloaded from this article https://medium.com/@bigomega/simple-load-testing-script-in-bash-a8c5a4968dc7

### Additional notes
The service is designed to be lenient. Returning 'n/a' for any type of errors instead of throwing error to user. Incidences are reported to the logger on the backend. This approach I think is acceptable for "non-critical service, informative only" service, for the sake of convenience on user's side.

The code becomes a bit expanded (for the multiple try-catch block) to provide that convenience to user.

Another thing: extensive logging. I learned from experiences that bad logging / lack of logging hurts so bad in the future. Code reviews should pay attention to that aspect, making sure the correct logging with the correct details on each log.

Finally, aspects like rate-limiting would better be handled externally. Usually we would use API-gateway like Kong / Ambassador / Tyx that offers such features.

### Libraries used

  - express (https://expressjs.com/)
  - moment (https://momentjs.com/) for date manipulation / processing
  - got (https://www.npmjs.com/package/got) for making http requests
  - cheerio (https://www.npmjs.com/package/cheerio) for scrapping html
  - fast-xml-parser (https://www.npmjs.com/package/fast-xml-parser) for parsing xml
  - bunyan (https://github.com/trentm/node-bunyan) for logging
  - express-rate-limiting (https://www.npmjs.com/package/express-rate-limit) for api rate-limiting
  - jsonwebtoken (https://www.npmjs.com/package/jsonwebtoken) for verifying jwt token
