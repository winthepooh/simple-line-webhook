const express = require("express");
const middleware = require("@line/bot-sdk").middleware;
const JSONParseError = require("@line/bot-sdk").JSONParseError;
const SignatureValidationFailed =
  require("@line/bot-sdk").SignatureValidationFailed;

const app = express();

const config = {
  channelAccessToken: "xxx",
  channelSecret: "xxxx",
};

app.use(middleware(config));

app.post("/webhook", (req, res) => {
  console.log(JSON.stringify(req.body));
  res.json(req.body.events); // req.body will be webhook event object
});

app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature);
    return;
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw);
    return;
  }
  next(err); // will throw default 500
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
