This is my Sterkinkor movie booking website that I have developed to give users the ability to search for a movie, select a movie that they have searched for, add their tickets to the cart and finally buy their movie tickets using Google Pay. 

![1](https://user-images.githubusercontent.com/62884014/88650761-4d2cb180-d0c9-11ea-8fc5-46e4a23bb2a1.png)



The website is built using Angular 9 that is pulling the movie details from the OMDB API. The users interactions such as adding to cart, paying and their order details are being stored in a local db that I have created using SQL Server and is also using a local API built with .Net Core to communicate to the website. Here is the github link to the API: 
https://github.com/melissa7days/SterkinekorMoviesAPI 
I have also integrated Google Pay as a payment method for the user to pay for their tickets.

Below are the steps the user would take to book a movie: 
1. The first step the user would usually take is to either search for a movie or look for the suggested list of movies that they have been given. Once the user finds a movie that they're looking for, they'll click on the movie and a book now button will drop down


![2](https://user-images.githubusercontent.com/62884014/88654789-23c25480-d0ce-11ea-8418-62a0ea907cd6.png)



2. Now that the user clicked the book now button, a modal will pop up that will prompt the user to enter a quantity for the number of tickets that they would like to purchase. 


![3](https://user-images.githubusercontent.com/62884014/88655066-80be0a80-d0ce-11ea-911a-00acbb2e3662.png)


3. Once the user enters their quantity and clicks on the confirm button, the movie that they have selected, the ticket quantity and the ticket cost have been added to their cart. Their total is also displayed. 


![4](https://user-images.githubusercontent.com/62884014/88655156-a814d780-d0ce-11ea-8c74-94457e591db7.png)



4. If the user is ready to purchase their tickets, they will click on the buy now button and they're then prompted with an alert that's telling them that their tickets have been added to the cart and they can now checkout. 


![5](https://user-images.githubusercontent.com/62884014/88655384-f6c27180-d0ce-11ea-9bda-dedf7b3e538b.png)


5. The user will then click on the checkout button on the top right of the screen and they're prompted with a modal that shows them what they're about to make a payment for.


![6](https://user-images.githubusercontent.com/62884014/88655439-0b066e80-d0cf-11ea-8ef2-f590fca6f4a7.png)



6. To pay, the user will click on the "Buy with Google Pay" button and they're taken to Google Pay's secure payment portal. The user will enter their gmail address and their credit or debit card details. THey payment portal will show them the total amount they're about to make a payment for. 


![7](https://user-images.githubusercontent.com/62884014/88655496-23768900-d0cf-11ea-827f-81df83741b55.jpg)


7. Once the user is ready to pay, they'll click on the "Pay" button. On the first click it will throw an error message saying that there is insufficient funds, but the next try they'll be able to make their purchase. If the users payment was successful, they are prompted with a successful payment message and their order details are displayed. 


![8](https://user-images.githubusercontent.com/62884014/88655602-443ede80-d0cf-11ea-97b1-fb01bce7d576.png)


8. The user is provided with an order number so if the merchant wants to check that their order has been process, they can check the db by taking that order number and entering it in the system. 


![9](https://user-images.githubusercontent.com/62884014/88655675-5f115300-d0cf-11ea-9812-e266003dfcb5.png)






Below is the database diagram that I am using to store the users cart, payment and order details: 


![db](https://user-images.githubusercontent.com/62884014/88656219-3f2e5f00-d0d0-11ea-92a7-d593e57a3732.PNG)




Google Pay Integration Steps ( I have used the google pay developer documentation to implement this https://developers.google.com/pay/api ) : 


Step 1: Define the Google Pay API Version 


The first step was to declare the version of the Google Pay API that the site uses. 




Step 2: Request a payment token for the payment provider


Google encrypts information about the payers card that they have used for the payment for secure processing. I have left it as an example payment gateway as it's only required for production. The id is only issued after registration with Google Pay Business Console. 




Step 3: Define Supoorted Payment Card Networks


The next step I took was to define the card networks that are accepted by my site. For the allowed card authentication methods, I used PAN_ONLY(Primary Account Number) which google API might return the cards on file with Google and I also used the CRYPTOGRAM_3DS which is using a device token, so on an android device, it's authentication with a 3-D Secure Cryptogram. 




Step 4: Describe the allowed card Payments


To describe the allowed card payments, I combined supported authentication methods and the supported card networks in order to describe my sites support for the card payment method. I then used the base card payment method object to describe the information that is expected to be returned to the application. In this base card payment method, I included the tokenized payment data. 




Step 5: Load the Google Pay API Javascript Library


I added the google's hosted Javascript onto my HTML. What this would do is that once the Google Pay API Javascript loads, I initialize a pyaments client object and because this is for demo purposes, it's useing a Test Environment which is returning dummy payment methods. In this test environment, the selected payment method isn't capable of transaction. 





Step 6: Determine readiness to pay with Google Pay API 


So to determine readiness to pay with Google API, I added my allowed payment mehtods to my base request object. I then called my isReadyToPay method to determine if Google Pay API is supported by te current device and browser for the specified payment methods. 





Step 7: Add a Google Pay Payment Button


I added a google payment button to my page which will let the users pay for the tickets. 






Step 8: Create a Payment Data Request Object 


To create the payment data request object, I created a javascript object called paymentDataRequest which will describe my sites support for the Google Pay API. I then added the supported payment method to this object and then I defined a total price and currency which the shopper will authorize. This is pulling from my API. Thereafter I defind my merchant name which is Sterkinekor and I gave it an example merchant ID





Step 9: Register an event handler for user gestures


To do this I registered a click event hanfler for the purchase button. This event hanfler will call the loadPaymentData method immediately after it interacts with the Google Pay payment button. It will then extract the payment token from the payment data response. 
