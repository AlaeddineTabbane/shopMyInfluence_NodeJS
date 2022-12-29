const express = require("express");
// const bodyParser = require('body-parser')
const PORT = process.env.PORT || 8000;

const app = express();
// create application/json parser
var jsonParser = express.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = express.urlencoded({ extended: true })

const cors = require('cors');
app.use(urlencodedParser)
app.use(jsonParser)
app.use(express.text());
app.use(cors());


var admin = require("firebase-admin");

var serviceAccount = require("./serviceAcount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test-smi-a21cb-default-rtdb.europe-west1.firebasedatabase.app"
});

const { getDatabase } = require('firebase-admin/database');
const db = getDatabase()


const refBrands = db.ref('brands');
const refPurchase = db.ref('conversions/purchase');
const refPurchasesPerBrands = db.ref('conversions/purchasesPerBrands');
const refInfluencers = db.ref('influencers');
const refArticles = db.ref('articles');


app.use('/brand', function (req, res) {
  try {
    const { offerId } = req.query
    const refBrands = db.ref(`brands/${offerId}`);
    refBrands.once('value', (snapshot) => {
      const { displayName, pic, offerId } = snapshot.val()
      return res.send({ displayName, pic, offerId });
    }, (errorObject) => {
      console.log('The read failed: ' + errorObject.name);
      return res
      .status(500)
      .json({ general: "Something went wrong, please try again"}); 
    });
  } catch (error) {
    console.log(error);
  }
})

app.use('/topInfluencer', function (req, res) {
  try {
    refInfluencers.once('value', (snapshot) => {
      return res.send(snapshot.val());
    }, (errorObject) => {
      console.log('The read failed: ' + errorObject.name);
      return res
      .status(500)
      .json({ general: "Something went wrong, please try again"}); 
    });
  } catch (error) {
    console.log(error);
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});