import request from "request";
let postWebhook = (req,res) =>{
  

    // Parse the request body from the POST
    let body = req.body;
  
    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
  
      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {

        // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
      
        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);
      
      });
  
      // Return a '200 OK' response to all events
      res.status(200).send('EVENT_RECEIVED');
  
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  



}
let getWebhook = (req,res) =>{
    // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "random"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
}
function handleMessage(sender_psid, received_message) {
  let response;

  // Check if the message contains text
  if (received_message.text) {    

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    }
  }  
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
// Construct the message body
let request_body = {
  "recipient": {
    "id": sender_psid
  },
  "message": response
}

// Send the HTTP request to the Messenger Platform
request({
  "uri": "https://graph.facebook.com/v6.0/me/messages",
  "qs": { "access_token": "EAADBj7AxvSIBAIZBGlZCVk74tVc2HTnDw5Sjc4ZBsXz54iGg3UGMpndqY22VmN6xIE4qD5LjvxuwEwZATjZC8ihS80C8NAZBhemCfiS3a0ZAMnINi9wVxMsNs2dtSOUBNJKk8pfKZAnUzKMH5pcWZAiuAFgxicwegQPbSLtZCfceQfNcIVgvaissHh "},
  "method": "POST",
  "json": request_body
}, (err, res, body) => {
  if (!err) {
    console.log('message sent!')
    console.log(`My message ${response}`)
  } else {
    console.error("Unable to send message:" + err);
  }
}); 
  }
}

export default {
    getWebhook:getWebhook,
    postWebhook :postWebhook 

}