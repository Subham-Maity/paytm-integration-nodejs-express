# Paytm Integration Project 💳

> This project demonstrates how to integrate Paytm payment gateway in a Node.js application. You can use this project to learn how to process online transactions using Paytm APIs.

<div align="center">
<img  alt="Developer Pic"
        src="https://user-images.githubusercontent.com/97989643/236471899-e54539d1-7ce8-4ab4-a29c-cc55f18d797f.png" width="780"/>
<img  alt="Developer Pic"
        src="https://user-images.githubusercontent.com/97989643/236472641-a685568e-925a-48c5-8250-0ffee12e5e1b.png"  width="780"/>
</div>




## Features 🚀
- Simple and user-friendly interface
- Test and production modes
- Secure and reliable payment processing

## Prerequisites 📋
- Node.js installed on your system
- A Paytm account with API credentials

## Getting Started 🏁
- Clone or download this repository
- Navigate to the root folder of the project
- Open a terminal and run `npm i` to install the dependencies
- Run `node index.js` to start the server
- Open your browser and visit http://localhost:3000/
- Fill the form and click on Pay Now
- If you are using test mode, you will be redirected to a demo Paytm page to confirm the payment
- If you are using production mode, you will be redirected to the actual Paytm page to complete the payment

## How to Setup 🔧
- Visit https://dashboard.paytm.com/next/apikeys and get your test or production API credentials. You will need your `merchant ID`, `merchant key`, and `website` name.
- Open the paytm folder in the project
- Go to config.js and replace the values with your own credentials

```js
var PaytmConfig = {
  mid: "YOUR_MERCHANT_ID",
  key: "YOUR_MERCHANT_KEY",
  website: "YOUR_WEBSITE_NAME",
};

module.exports.PaytmConfig = PaytmConfig;
```

## Resources 📚
- For more information about Paytm integration, you can check their documentation guide: https://developer.paytm.com/docs/
- For testing purposes, you can use their test API key, test wallet details, and deprecated flow integration: 
  - https://dashboard.paytm.com/next/apikeys
  - https://business.paytm.com/docs/api/process-transaction-api/
  - https://business.paytm.com/docs/test-instruments/testing-integration?ref=otherlinks
  - https://business.paytm.com/docs/v1/payment-gateway/deprecated-flow-integration/
