import express from "express";
import {
  // main APIs
  Client,
  middleware,

  // exceptions
  JSONParseError,
  SignatureValidationFailed,

  // types
  TemplateMessage,
  WebhookEvent,
} from "@line/bot-sdk";
require('dotenv').config();

const config = {
  //.env環境で入力
  channelSecret:process.env.CHANNEL_SEACRET,
  channelAccessToken:process.env.CHANNEL_ACCESS_TOKEN
};

type API_RECEIVE = {
  events: {
    Name: string;
    Location: string|null;
    Start_Date: string;
    End_Date: string|null;
    Description: string|null;
  }[]
}

//server
const app = express();


const makeMessage = (req: API_RECEIVE) => {
  let message = []
  req.events.map((event) => {
    message.push(
      `以下のイベントが登録されました
      【${event.Name}】
      【場所】${event.Location}
      【日程】${event.Start_Date} ~ ${event.End_Date}
      【詳細】${event.Description}
      `)
  })
}


app.post("/webhook", middleware(config),(req, res) => {
  res.sendStatus(200);
  Promise.all(req.body.events.map(handleEvent)).then((result) => res.json(result));
  
});

const client = new Client(config);

const handleEvent = (event) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  };

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: event.message.text
  });
}


//herokuの環境変数
app.listen(process.env.PORT || 3000);


