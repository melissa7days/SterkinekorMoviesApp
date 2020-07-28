This is my Sterkinkor movie booking website that I have developed to give users the ability to search for a movie, select a movie that they have searched for, add their tickets to the cart and finally buy their movie tickets using Google Pay. 

![1](https://user-images.githubusercontent.com/62884014/88650761-4d2cb180-d0c9-11ea-8fc5-46e4a23bb2a1.png)



The website built using Angular 9 that is pulling the movie details from the OMDB API. The users interactions such as adding to cart, paying and their order details are being stored in a local db that I have created using SQL Server and is also using a local API built with .Net Core to communicate to the website. I have also integrated Google Pay as a payment method for the user to pay for their tickets.

Below are the steps the user would take to book a movie: 
1. The first step the user would usually take is to either search for a movie or look for the suggested list of movies that they have been given. Once the user finds a movie that they're looking for, they'll click on the movie and a book now button will drop down


![2](https://user-images.githubusercontent.com/62884014/88654789-23c25480-d0ce-11ea-8418-62a0ea907cd6.png)



2. Now that the user clicked the book now button, a modal will pop up that will prompt the user to enter a quantity for the number of tickets that they would like to purchase. 



3. Once the user enters their quantity and clicks on the confirm button, the movie that they have selected, the ticket quantity and the ticket cost have been added to their cart. Their total is also displayed. 

4. If the user is ready to purchase their tickets, they will click on the buy now button and they're then prompted with an alert that's telling them that their tickets have been added to the cart and they can now checkout. 

5. The user will then click on the checkout button on the top right of the screen and they're prompted with a modal that shows them what they're about to make a payment for. 

6. To pay, the user will click on the "Buy with Google Pay" button and they're taken to Google Pay's secure payment portal. 

7. The user will enter their gmail address and their credit or debit card details. THey payment portal will show them the total amount they're about to make a payment for. 

8. Once the user is ready to pay, they'll click on the "Pay" button. On the first click it will throw an error message saying that there is insufficient funds, but the next try they'll be able to make their purchase. 

9. If the users payment was successful, they are prompted with a successful payment message and their order details are displayed. 

10. The user is provided with an order number so if the merchant wants to check that their order has been process, they can check the db by taking that order number and entering it in the system. 
