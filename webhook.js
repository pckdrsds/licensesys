import axios from "axios"

export function sendWebhook(username, avatar, message) {

  const params = {
    username: username, 
    avatar_url: avatar,
    content: message
  }
  axios.post("https://discord.com/api/webhooks/1152646408927719504/FSievaXxaT59NZMZ4td252E8PgZWFfIMgF5Pu8Y-EQWjDqJpEq9v0Im10mKrKFQD-kIU", params, {headers: {'Content-Type': 'application/json'}}).then(r => {
    console.log("done")
  })

}