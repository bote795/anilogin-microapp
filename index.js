const express = require('express')
const path = require('path')
const rp = require('request-promise')
const dotenv = require("dotenv");
dotenv.config();
//env varibles
const clientId = process.env.ANILIST_CLIENT_ID;
const clientSecret = process.env.ANILIST_CLIENT_SECRET;
const redirectUri = process.env.ANILIST_REDIRECT_URI;
const PORT = process.env.PORT || 5000;

console.log('This is the clientId %s', clientId);

express()
  .use(express.static(path.join(__dirname, "public")))
  .get("/", (req, res) => res.render("public/index"))
  .get("/callback", (req, res) => {
      const code = req.query.code;
      function handleError(res, err){
          console.log("This was the error %O", err);
          return res.json({ "error": "There was an error" });
      }
        if(!code){
            handleError(res, {"message": "there was no code"});
        }

      const options = {
          uri: 'https://anilist.co/api/v2/oauth/token',
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          json: {
              'grant_type': 'authorization_code',
              'client_id': clientId,
              'client_secret': clientSecret,
              'redirect_uri': redirectUri, 
              'code': code, 
          }
      };
      rp(options)
        .then((response)=> {
           if(response.body.access_token){
               return res.json({
                   acces_token : response.body.access_token
               });
            } else {
                handleError(res, response)
            }
        })
          .catch((err) => handleError(res, err))
        
    })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));