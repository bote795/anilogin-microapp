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

express()
  .use(express.static(path.join(__dirname, "public")))
  .get("/", (req, res) => res.render("public/index"))
  .get("/callback", (req, res) => {
      const code = req.query.code;
      function handleError(res){
          return res.json({ "error": "There was an error" });
      }
        if(!code){
            handleError(res);
        }

        const options = { 
        method: "POST", 
        uri: `https://anilist.co/api/v2/oauth/token
            &grant_type=authorization_code
                   &client_id=${clientId}
                   &client_secret=${clientSecret} 
                   &redirect_uri=${redirectUri}
                   &code=${code}
            `,
            json: true
        };
      rp(options)
        .then((body)=> {
           if(body.access_token){
               return res.json({
                   acces_token : body.access_token
               });
            } else {
                handleError(res)
            }
        })
          .catch(() => handleError(res))
        
    })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));