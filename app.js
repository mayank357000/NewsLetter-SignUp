//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
const mailchimp = require("@mailchimp/mailchimp_marketing");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/failure",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT||3000, function() {
  console.log("system is running");
});


mailchimp.setConfig({
  apiKey: "********************************",//put a api key from mailchimp here
  server: "us1"
});

app.post("/", function(req, res) {
  const firstName = req.body.FirstName;
  const lastName = req.body.LastName;
  const email = req.body.Email;
  const listId = "**********";//mailchimp account will give you a list id to use it here
  console.log(firstName, lastName, email);
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
    res.sendFile(__dirname + "/success.html");
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${
        response.id
      }.`
    );
  }
  run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

