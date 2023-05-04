const express = require("express");
const bodyParser = require("body-parser");
const checksum_lib = require("./Paytm/paytm-test-server/checksum");
const config = require("./config");
const crypt = require("./Paytm/paytm-test-server/crypt");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/process_payment", (req, res) => {
  const { amount, order_id, customer_name, customer_email } = req.body;

  // Generate checksum
  const params = {};
  params["MID"] = config.MID;
  params["WEBSITE"] = config.WEBSITE;
  params["CHANNEL_ID"] = config.CHANNEL_ID;
  params["INDUSTRY_TYPE_ID"] = config.INDUSTRY_TYPE_ID;
  params["ORDER_ID"] = order_id;
  params["CUST_ID"] = customer_email;
  params["TXN_AMOUNT"] = amount;
  params["CALLBACK_URL"] = config.CALLBACK_URL;
  params["EMAIL"] = customer_email;
  params["MOBILE_NO"] = "9999999999"; // Replace with actual mobile number
  const checksum = checksum_lib.genchecksum(params, config.MERCHANT_KEY);

  // Prepare data for payment
  const data = {
    MID: config.MID,
    WEBSITE: config.WEBSITE,
    CHANNEL_ID: config.CHANNEL_ID,
    INDUSTRY_TYPE_ID: config.INDUSTRY_TYPE_ID,
    ORDER_ID: order_id,
    CUST_ID: customer_email,
    TXN_AMOUNT: amount,
    CALLBACK_URL: config.CALLBACK_URL,
    EMAIL: customer_email,
    MOBILE_NO: "9999999999", // Replace with actual mobile number
    CHECKSUMHASH: checksum,
  };

  // Encrypt data
  const encrypted_data = crypt.encrypt(
    JSON.stringify(data),
    config.MERCHANT_KEY
  );

  // Redirect to Paytm payment page
  res.redirect(
    `https://securegw-stage.paytm.in/theia/processTransaction?data=${encrypted_data}&amp;orderid=${order_id}`
  );
});

app.post("/payment_callback", (req, res) => {
  // Handle payment callback
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
