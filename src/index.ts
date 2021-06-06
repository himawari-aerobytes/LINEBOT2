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
  Message,
  TextMessage,
  FlexMessage,
} from "@line/bot-sdk";
require('dotenv').config();
import fs from "fs";

const APIMock = JSON.parse(fs.readFileSync("./APIMock/Server.json", "utf-8"));



type API_RECEIVE = {
  events: {
    Name: string;
    Location: string|null;
    Start_Date: string;
    End_Date: string|null;
    Description: string|null;
  }
}

const config = {
  //.env環境で入力
  channelSecret:process.env.CHANNEL_SEACRET,
  channelAccessToken:process.env.CHANNEL_ACCESS_TOKEN
};
//server
const app = express();
const client = new Client(config);
let a: Message;
let b : FlexMessage


const makeEventMessage = (req: API_RECEIVE) => {
  const event = req.events

  return convertToTextMessage(`以下のイベントが登録されました
      【${event.Name}】
      【場所】${event.Location}
      【日程】${event.Start_Date} ~ ${event.End_Date}
      【詳細】${event.Description}
      `);

}


app.post("/webhook", middleware(config),(req, res) => {
  res.sendStatus(200);
  Promise.all(req.body.events.map(handleEvent)).then((result) => res.json(result));
  
});

const convertToTextMessage = (text: string):Message => {
  return {
      type: "text",
      text: text
  }
  
}

const handleEvent = async (event) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  };

  client.pushMessage(process.env.UID,makeEventMessage(APIMock))

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: event.message.text
  });
}


//herokuの環境変数
app.listen(process.env.PORT || 3000);


