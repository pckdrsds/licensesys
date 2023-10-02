import express from "express";
import * as fs from "fs";
const app = express()




const listallPIN = 9652;
const port = 20440
const latestVersion = "10"



let packtweaks = fs.readFileSync("./packcreator/packtweaks.json", "utf-8")
let json; 
class DB {
  static load() {
    json = JSON.parse(fs.readFileSync("./packcreator/db.json", "utf-8"));
  }
  static set(key, value) {
    json[key] = value;
    fs.writeFileSync("./packcreator/db.json", JSON.stringify(json))
  }
  static remove(key) {
    delete json[key];
    fs.writeFileSync("./packcreator/db.json", JSON.stringify(json))
  }
  static get(key) {
    if(!json[key]) return null;
    return json[key]
  }
  static list() {
    return Object.keys(json)
  }
  static clean() {
    this.list().forEach(s => {
      this.remove(s);
    })
  }
}

const db = DB;
db.load();

import { sendWebhook } from "./webhook.js"

app.get('/', (req, res) => {
  res.send('I hope you aren’t a big screamer. The last one was a little too loud for my liking…')
})

app.get("/listall", async (req, res) => {
  let responsecode = 403;
  let pin = req.query.pin
  let rawResponse = ""
  if(pin && pin == listallPIN) {
    responsecode = 200;
    let list = db.list();
    for(let i = 0; i < list.length; i++) {
      let key = list[i]
      let value = db.get(key) 
      value = JSON.stringify(value);
      rawResponse += key+"__"+value+" <br>";
    }
  } else {
    rawResponse = "Wrong pin"
  }

  res.status(responsecode).send(rawResponse)
   
})
const addkey = "/add32423"
app.get(addkey, async (req, res) => {
  let responsecode = 200;
  if(!req.query.pin || !req.query.id) {
    responsecode = 400
  } else {
    let id = req.query.id
    let pin = db.get(req.query.pin);
    if(pin != null) {
      responsecode = 403
    } else {
      db.set(req.query.pin, {
        id: id
      });
    }
  }
  res.sendStatus(responsecode);
})

const removeKey = "/remove32423"
app.get(removeKey, async (req, res) => {
  let responsecode = 200;
  if(!req.query.pin) {
    responsecode = 400
  } else {
    let pin = db.get(req.query.pin);
    if(pin == null) {
      responsecode = 403
    } else {
      db.delete(req.query.pin);
    }
  }
  res.sendStatus(responsecode);
})

app.get('/packtweaks', async (req, res) => {
  let responsecode = 200;
  if(!req.query.pin) {
    sendWebhook("Grave error PackTweaks", "", "Someone is trying to crack the license system (**Received NULL PIN**) ")
    responsecode = 400
  } else {
    let pin = await db.get(req.query.pin)
    if(pin == null) {
      sendWebhook("Error PIN PackTweaks", "", "Someone tried to log with an invalid pin !")
      responsecode = 403
    } 
  }
  if(responsecode == 200) {
    res.status(200).send(packtweaks)
  } else {
    res.sendStatus(responsecode)
  }
})

app.get("/download", async (req, res) => {
  let responsecode = 200;
  if(!req.query.file) {
    responsecode = 400;
  } else {
    req.query.file = req.query.file.replace(/Â/g, '');
    res.status(responsecode).sendfile("./packcreator/packs/"+req.query.file);
  }
  res.status(responsecode);
})

app.get('/login', async (req, res) => {
  let responsecode = 200
  if(!req.query.pin || !req.query.uuid) {
    sendWebhook("Grave error", "", "Someone is probally trying to crack the license system (**Received NULL PIN**) ")
    responsecode = 400
  } else if(!req.query.version || req.query.version != latestVersion) {
    sendWebhook("Error version", "", "Someone tried to log with an old version!")
    responsecode = 422
  } else {
    let pin = db.get(req.query.pin);
    let uuid = req.query.uuid;
    if(pin == null) {
      responsecode = 403
      sendWebhook("Wrong license", "", "UUID: ("+uuid+") Used Pin: ("+req.query.pin+")")
    
    } else {
      if(!pin.uuid) {
        sendWebhook("First login", "", "PIN: "+req.query.pin+", ID: "+pin.id)
        const newObj = {
          id: pin.id,
          uuid: req.query.uuid
        }
        db.set(req.query.pin, newObj)
      } else if(pin.uuid != uuid) {
        responsecode = 403
        sendWebhook("License sharing", "", "("+uuid+") PIN: "+req.query.pin+", ID: "+pin.id)
      }
    }
    if(responsecode == 200) {
      sendWebhook("Success Login", "", "PIN: "+req.query.pin+", ID: "+pin.id)
    }
  }
  res.sendStatus(responsecode);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



export function start() {
    console.log("Starting.")
    setInterval(function() {
        for(let i = 1; i < 20; i++) {
            let ggg = i*(i+1)+(i*1)+(i*i*i);
        }
    }, 5000)
  
}

