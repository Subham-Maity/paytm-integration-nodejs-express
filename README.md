# paytm_payment_gateway_integration

Create a new folder and open it in VS Code.

1. `npm init -y` (this will create package.json file)
2. `npm i express nodemon` (this will install express and nodemon)
3. Open the paytm website [here](dashboard.paytm.com/next/apikeys) a
> Login with your paytm account
- Go to Developer Settings
- Click on API Keys
  
 or,

- Go to [here](https://business.paytm.com/integration-builder/account-setup)
- Copy the Merchant ID and Merchant Key

4. Change the script in package.json to `"start": "nodemon index.js"`

```json
  "scripts": {
    "start": "nodemon index.js"
  },
  ```
5. Create a file named `index.js` and paste the following code.


```js
const express = require("express");

const https = require("https");
const qs = require("querystring");

const app = express();

const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/paynow", [parseUrl, parseJson], (req, res) => {
  // Route for making payment

  var paymentDetails = {
    amount: req.body.amount,
    customerId: req.body.name,
    customerEmail: req.body.email,
    customerPhone: req.body.phone,
  };
  if (
    !paymentDetails.amount ||
    !paymentDetails.customerId ||
    !paymentDetails.customerEmail ||
    !paymentDetails.customerPhone
  ) {
    res.status(400).send("Payment failed");
  } else {
    var params = {};
    params["MID"] = config.PaytmConfig.mid;
    params["WEBSITE"] = config.PaytmConfig.website;
    params["CHANNEL_ID"] = "WEB";
    params["INDUSTRY_TYPE_ID"] = "Retail";
    params["ORDER_ID"] = "TEST_" + new Date().getTime();
    params["CUST_ID"] = paymentDetails.customerId;
    params["TXN_AMOUNT"] = paymentDetails.amount;
    params["CALLBACK_URL"] = "http://localhost:3000/callback";
    params["EMAIL"] = paymentDetails.customerEmail;
    params["MOBILE_NO"] = paymentDetails.customerPhone;

    checksum_lib.genchecksum(
      params,
      config.PaytmConfig.key,
      function (err, checksum) {
        var txn_url =
          "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
        // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

        var form_fields = "";
        for (var x in params) {
          form_fields +=
            "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
        }
        form_fields +=
          "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(
          '<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' +
            txn_url +
            '" name="f1">' +
            form_fields +
            '</form><script type="text/javascript">document.f1.submit();</script></body></html>'
        );
        res.end();
      }
    );
  }
});

app.post("/callback", (req, res) => {
  // Route for verifiying payment

  var body = "";

  req.on("data", function (data) {
    body += data;
  });

  req.on("end", function () {
    var html = "";
    var post_data = qs.parse(body);

    // received params in callback
    console.log("Callback Response: ", post_data, "n");

    // verify the checksum
    var checksumhash = post_data.CHECKSUMHASH;
    // delete post_data.CHECKSUMHASH;
    var result = checksum_lib.verifychecksum(
      post_data,
      config.PaytmConfig.key,
      checksumhash
    );
    console.log("Checksum Result => ", result, "n");

    // Send Server-to-Server request to verify Order Status
    var params = { MID: config.PaytmConfig.mid, ORDERID: post_data.ORDERID };

    checksum_lib.genchecksum(
      params,
      config.PaytmConfig.key,
      function (err, checksum) {
        params.CHECKSUMHASH = checksum;
        post_data = "JsonData=" + JSON.stringify(params);

        var options = {
          hostname: "securegw-stage.paytm.in", // for staging
          // hostname: 'securegw.paytm.in', // for production
          port: 443,
          path: "/merchant-status/getTxnStatus",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": post_data.length,
          },
        };

        // Set up the request
        var response = "";
        var post_req = https.request(options, function (post_res) {
          post_res.on("data", function (chunk) {
            response += chunk;
          });

          post_res.on("end", function () {
            console.log("S2S Response: ", response, "n");

            var _result = JSON.parse(response);
            if (_result.STATUS == "TXN_SUCCESS") {
              res.send("payment sucess");
            } else {
              res.send("payment failed");
            }
          });
        });

        // post the data
        post_req.write(post_data);
        post_req.end();
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`App is listening on Port ${PORT}`);
});
```

6. Create a file named `index.html` and paste the following code.

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    <title>Paytm-Nodejs</title>
  </head>
  <body style="background-color:#f5f3ef">
    <div class="row my-5">
      <div class="col-md-4 offset-md-4">
        <div class="card">
          <div class="card-body">
            <form class="" action="/paynow" method="post">
              <div class="form-group">
                <label for="">Name: </label>
                <input class="form-control" type="text" name="name" value="">
              </div>
              <div class="form-group">
                <label for="">Email: </label>
                <input class="form-control" type="text" name="email" value="">
              </div>
              <div class="form-group">
                <label for="">Phone: </label>
                <input class="form-control" type="text" name="phone" value="">
              </div>
                <div class="form-group">
                <label for="">Amount: </label>
                <input class="form-control" type="text" name="amount" value="">
              </div>
              <div class="form-group">
                <button class="btn form-control btn-primary">Pay Now</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```