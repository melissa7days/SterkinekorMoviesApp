var itemId = 0;
var movieName = "";
var ticketNo = 0;
var ticketCost = 0;
var movieTotal = 0;
var total = 0;
var cartId = 0;
var orderPaymentId = 0;
let paymentsClient = null;
let attempts = 0;
const baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0
};

const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];

const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

const tokenizationSpecification = {
  type: 'PAYMENT_GATEWAY',
  parameters: {
    'gateway': 'example',
    'gatewayMerchantId': 'exampleGatewayMerchantId'
  }
};

const baseCardPaymentMethod = {
  type: 'CARD',
  parameters: {
    allowedAuthMethods: allowedCardAuthMethods,
    allowedCardNetworks: allowedCardNetworks
  }
};

const cardPaymentMethod = Object.assign(
  {},
  baseCardPaymentMethod,
  {
    tokenizationSpecification: tokenizationSpecification
  }
);


function getGoogleIsReadyToPayRequest() {
  return Object.assign(
      {},
      baseRequest,
      {
        allowedPaymentMethods: [baseCardPaymentMethod]
      }
  );
}

function getGooglePaymentDataRequest() {
  const paymentDataRequest = Object.assign({}, baseRequest);
  paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
  paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
  paymentDataRequest.merchantInfo = {
    merchantName: 'Sterkinekor'
  };

  paymentDataRequest.callbackIntents = ["PAYMENT_AUTHORIZATION"];

  return paymentDataRequest;
}

function getGooglePaymentsClient() {
  if ( paymentsClient === null ) {
    paymentsClient = new google.payments.api.PaymentsClient({
        environment: 'TEST',
      paymentDataCallbacks: {
        onPaymentAuthorized: onPaymentAuthorized
      }
    });
  }
  return paymentsClient;
}
var paymentSuccessMessage = "Successful Payment";
var status = "Paid";
var currentdate = new Date(); 
var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
console.log(datetime);

var date = new Date(datetime);

function onPaymentAuthorized(paymentData) {
  return new Promise(function(resolve, reject){
    processPayment(paymentData)
      .then(function() {
        resolve({transactionState: 'SUCCESS'});
        fetch('http://localhost:55522/api/payment',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },            
          body: JSON.stringify({paymentMessage:paymentSuccessMessage, id:itemId,cartid:cartId})
        }).then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err))

        fetch('http://localhost:55522/api/orderdetails',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },            
          body: JSON.stringify({paymentId:orderPaymentId,cartId:cartId,id:itemId,orderStatus:status,orderDate:date})
        }).then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err))




        var test = document.getElementById("demo").innerHTML = paymentSuccessMessage;
        if(document.getElementById("pay").style.display == "none"){
          document.getElementById("pay").style.display = "block";
        }
        else
        {
          document.getElementById("pay").style.display = "none";
        }

        var paymentId = 0;
        var paymentTitle = "";
        var paymentQuantity = 0;
        var paymentCost = 0;
        var paymentTotal= 0;
        var paidTotal = 0;
       setInterval(function(){
         console.log("cart id: "+cartId);
         fetch(`http://localhost:55522/api/payment/getpaymentdetails?cartid=${cartId}&itemid=${itemId}`)
         .then(result => result.json())
         .then(test => {
             test.forEach(function(user){
               console.log("Payment ID : ",user.paymentId);
               paymentId = user.paymentId;
               document.getElementById('paymentId').innerHTML = "<strong>Order Number</strong>: " + paymentId;
               paymentTitle = user.title;
               document.getElementById('paymentTitle').innerHTML = "<strong>Movie Name</strong>: " + paymentTitle;
               paymentQuantity = user.quantity;
               document.getElementById('paymentQuantity').innerHTML = "<strong>No. Of Tickets</strong>: " + paymentQuantity;
               paymentCost = user.itemCost;
               document.getElementById('paymentCost').innerHTML = "<strong>Ticket Cost</strong>: R" + paymentCost+".00";
               paymentTotal = user.totalCost;
               document.getElementById('paymentTotal').innerHTML = "<strong>Total Cost</strong>: R" + paymentTotal+".00";
               paidTotal = user.finalTotal;
               document.getElementById('paidTotal').innerHTML = "<strong>Total Paid</strong>: R" + paidTotal+".00";
             })
         }); 
       },1000);
      })
      .catch(function() {
        resolve({
          transactionState: 'ERROR',
          error: {
            intent: 'PAYMENT_AUTHORIZATION',
            message: 'Insufficient funds, try again. Next attempt should work.',
            reason: 'PAYMENT_DATA_INVALID'
          }
        });
        });
  });
}

function onGooglePayLoaded() {
  const paymentsClient = getGooglePaymentsClient();
  paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
    .then(function(response) {
      if (response.result) {
        addGooglePayButton();
      }
    })
    .catch(function(err) {
      console.error(err);
    });
}

function addGooglePayButton() {
  const paymentsClient = getGooglePaymentsClient();
  const button =
      paymentsClient.createButton({onClick: onGooglePaymentButtonClicked});
  document.getElementById('container').appendChild(button);
}
function myFunction() {

}

setInterval(function(){ 
  fetch('http://localhost:55522/api/cart')
  .then(result => result.json())
  .then(users => {
  users.forEach(function(user){
    total = user.finalTotal;
    cartId = user.cartId;
    document.getElementById('finalTotal').innerHTML = "<strong>Total</strong> : R" + total+".00";
  })
}); 
fetch('http://localhost:55522/api/item')
.then(result => result.json())
.then(users => {
    users.forEach(function(user){
      itemId = user.id;
      movieName = user.title;
      document.getElementById('itemTitle').innerHTML = "<strong>Movie Name:</strong> " + movieName;
      ticketNo = user.quantity;
      document.getElementById('itemQuantity').innerHTML = "<strong>No. of Tickets:</strong> " + ticketNo;
      ticketCost = user.itemCost;
      document.getElementById('itemCost').innerHTML = "<strong>Ticket Cost</strong> : R" + ticketCost+".00";
      movieTotal = user.totalCost;
      document.getElementById('itemTotal').innerHTML = "<strong>Total Cost</strong> : R" + movieTotal+".00";
    })
});
fetch('http://localhost:55522/api/payment')
.then(result => result.json())
.then(users => {
    users.forEach(function(user){
      orderPaymentId = user.paymentId + 1;
    })
});
 }, 3000);

 
fetch('http://localhost:55522/api/cart')
.then(result => result.json())
.then(users => {
    users.forEach(function(user){
      total = user.finalTotal;
      cartId = user.cartId;
    })
}); 

fetch('http://localhost:55522/api/item')
.then(result => result.json())
.then(users => {
    users.forEach(function(user){
      itemId = user.id;
      
    })
}); 


function getGoogleTransactionInfo() {
  return {
    countryCode: 'ZA',
    currencyCode: "ZAR",
    totalPriceStatus: "FINAL",
    totalPrice: total.toString(),
    totalPriceLabel: "Total"
  };
}

function onGooglePaymentButtonClicked() {
  const paymentDataRequest = getGooglePaymentDataRequest();
  paymentDataRequest.transactionInfo = getGoogleTransactionInfo();

  const paymentsClient = getGooglePaymentsClient();
  paymentsClient.loadPaymentData(paymentDataRequest);
}



function processPayment(paymentData) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      paymentToken = paymentData.paymentMethodData.tokenizationData.token;

            if (attempts++ % 2 == 0) {
          reject(new Error('Every other attempt fails, next one should succeed'));      
      } else {
          resolve({});      
      }
    }, 500);
  });
}















/* const baseRequest = {
apiVersion: 2,
apiVersionMinor: 0
};

const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];

const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

const tokenizationSpecification = {
type: 'PAYMENT_GATEWAY',
parameters: {
  'gateway': 'example',
  'gatewayMerchantId': 'exampleGatewayMerchantId'
}
};

const baseCardPaymentMethod = {
type: 'CARD',
parameters: {
  allowedAuthMethods: allowedCardAuthMethods,
  allowedCardNetworks: allowedCardNetworks
}
};

const cardPaymentMethod = Object.assign(
{},
baseCardPaymentMethod,
{
  tokenizationSpecification: tokenizationSpecification
}
);

let paymentsClient = null;

function getGoogleIsReadyToPayRequest() {
return Object.assign(
    {},
    baseRequest,
    {
      allowedPaymentMethods: [baseCardPaymentMethod]
    }
);
}

function getGooglePaymentDataRequest() {
const paymentDataRequest = Object.assign({}, baseRequest);
paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod]; 
paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
paymentDataRequest.merchantInfo = {
  merchantName: 'Example Merchant'
};

paymentDataRequest.callbackIntents = ["PAYMENT_AUTHORIZATION"];

return paymentDataRequest;
}

function getGooglePaymentsClient() {
if ( paymentsClient === null ) {
  paymentsClient = new google.payments.api.PaymentsClient({
      environment: 'TEST',
    paymentDataCallbacks: {
      onPaymentAuthorized: onPaymentAuthorized
    }
  });
}
return paymentsClient;
}

function onPaymentAuthorized(paymentData) {
      return new Promise(function(resolve, reject){
  // handle the response
  processPayment(paymentData)
  .then(function() {
    resolve({transactionState: 'SUCCESS'});
  })
  .catch(function() {
    resolve({
      transactionState: 'ERROR',
      error: {
        intent: 'PAYMENT_AUTHORIZATION',
        message: 'Insufficient funds',
        reason: 'PAYMENT_DATA_INVALID'
      }
    });
      });
});
}

function onGooglePayLoaded() {
const paymentsClient = getGooglePaymentsClient();
paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
    .then(function(response) {
      if (response.result) {
        addGooglePayButton();
      }
    })
    .catch(function(err) {
      // show error in developer console for debugging
      console.error(err);
    });
}

function addGooglePayButton() {
const paymentsClient = getGooglePaymentsClient();
const button =
    paymentsClient.createButton({onClick: onGooglePaymentButtonClicked});
document.getElementById('container').appendChild(button);
}

//   let getJSON = (url, callback) => {

//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', url, true);
  
//     xhr.responseType = 'json';

//     xhr.onload = () => {

//         let status = xhr.status;

//         if (status == 200) {
//             callback(null, xhr.response);
//         } else {
//             callback(status);
//         }
//     };

//     xhr.send();
// };

// getJSON('http://localhost:50382/api/cart', (err, data) => {

//     if (err != null) {
//         console.error(err);
//     } else {

//         let text = `Date: ${data.title}`

//         console.log(text);
//     }
// });
var total = 0;
fetch('http://localhost:50382/api/cart')
.then(result => result.json())
.then(users => {
  users.forEach(function(user){
    console.log(user.title,user.quantity, user.itemCost, user.totalCost);
    total = user.totalCost;
    console.log(total);
  })
});
function getGoogleTransactionInfo() {
return {
  countryCode: 'US',
  currencyCode: "USD",
  totalPriceStatus: "FINAL",
  totalPrice: total.toString(),
  totalPriceLabel: "Total"
};
}

function onGooglePaymentButtonClicked() {
const paymentDataRequest = getGooglePaymentDataRequest();
paymentDataRequest.transactionInfo = getGoogleTransactionInfo();

const paymentsClient = getGooglePaymentsClient();
paymentsClient.loadPaymentData(paymentDataRequest);
}

function processPayment(paymentData) {
      return new Promise(function(resolve, reject) {
      setTimeout(function() {
              // @todo pass payment token to your gateway to process payment
              paymentToken = paymentData.paymentMethodData.tokenizationData.token;
console.log(paymentToken);
      resolve({});
  }, 3000);
});
} */