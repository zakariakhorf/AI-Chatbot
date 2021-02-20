import request from "request";
let postWebhook = (req, res) => {


  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {


      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }

    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }





}
let getWebhook = (req, res) => {
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
  if (received_message.attachments) {

    // Gets the URL of the message attachment
    response = {
      "text": `Je ne sais pas traiter ce type de demande`
    }

  }
  else {

    // Create the payload for a basic text message
    if (received_message.text == 'Comment vas-tu ?' || received_message.text == 'comment vas-tu ?' || received_message.text == 'comment vas tu ?') {
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "Très bien et vous ?",
              "subtitle": "Appuyez sur le Bouton pour repondre !",
              "buttons": [
                {
                  "type": "postback",
                  "title": "Je vais bien,merci",
                  "payload": "yes",
                },
                {
                  "type": "postback",
                  "title": "Non, ça ne va pas",
                  "payload": "no",
                }
              ],
            }]
          }}
        
      }
    } else {
      response = {
        "text": `${received_message.text}`
      }
    }
  } 

  // Sends the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Très bien !" }
  } else if (payload === 'no') {
    response = { "text": "J'espère que ça ira mieux demain :)" }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
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
    "qs": { "access_token": "EAADBj7AxvSIBAIZBGlZCVk74tVc2HTnDw5Sjc4ZBsXz54iGg3UGMpndqY22VmN6xIE4qD5LjvxuwEwZATjZC8ihS80C8NAZBhemCfiS3a0ZAMnINi9wVxMsNs2dtSOUBNJKk8pfKZAnUzKMH5pcWZAiuAFgxicwegQPbSLtZCfceQfNcIVgvaissHh " },
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


export default {
  getWebhook: getWebhook,
  postWebhook: postWebhook

}