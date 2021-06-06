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
//import fs from "fs";
//const APIMock = JSON.parse(fs.readFileSync("./APIMock/Server.json", "utf-8"));



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

const APIMock = {
  "events": {
    "Name": "飲み会１",
    "Location": "山田大学",
    "Start_Date": "2021/3/2",
    "End_Date": "2021/3/2",
    "Description": "みんなで飲みます"
  }

};



const makeEventMessage = (req: API_RECEIVE) => {
  const event = req.events

  return  (`以下のイベントが登録されました
      【${event.Name}】
      【場所】${event.Location}
      【日程】${event.Start_Date} ~ ${event.End_Date}
      【詳細】${event.Description}`);
      

}

app.post("/webhook", middleware(config),(req, res) => {
  res.sendStatus(200);
  Promise.all(req.body.events.map(handleEvent)).then((result) => res.json(result));
  
});


const handleEvent = async (event) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  };

  return client.pushMessage( process.env.LINE_UID, { type: "text", text: makeEventMessage(APIMock) });

};




//herokuの環境変数
app.listen(process.env.PORT || 3000);


