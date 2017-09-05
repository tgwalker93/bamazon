var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "tgwalker93",

  // Your password
  password: "Mario626",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  displayData();

});

var isNumber = false;
var q1 = true;
var q1 = false;
// function which prompts the user for what action they should take
var start = function() {
if(isNumber === false) {

  inquirer.prompt([{
      name: "productChoice",
      type: "input",
      message: "What is the ID of the produt that you would like to buy?"
    }, {
      name: "howMuch",
      type: "input",
      message: "How much of this product do you want to buy?"
    }
    ])
    .then(function(answer) {
    var parseProductChoice = parseInt(answer.productChoice);
    var parseHowMuch = parseInt(answer.howMuch);


    var questionCounter = 0;

      //checking if the user chose a number for q1
    if(isNaN(parseProductChoice)) {
        console.log("Sorry, the ID that you chose was NOT a number.");

    }else{
        questionCounter +=1;
    }

    




    //checking if the user chose a number for q2
    if(isNaN(parseHowMuch)) {
        console.log("Sorry, the quantity that you choice was NOT a number, please try again");

    }else{
        questionCounter +=1;
    }
        
    



    if(questionCounter===2) {
        isNumber = true;
        questionCounter = 0;
        checkStock(parseProductChoice, parseHowMuch)
    }

      // based on their answer, either call the bid or the post functions

    
      start();




    //   if (answer.postOrBid.toUpperCase() === "POST") {
    //     postAuction();
    //   }
    //   else {
    //     bidAuction();
    //   }
    });


}
}

function fufillOrder(product, remainingQuantity, customerQuantity){
    connection.query("UPDATE products SET ? WHERE ?",[
        {
            stock_quantity: remainingQuantity
        },

        {
            item_id: product
        }
    ], 
        function(err, results) {

        console.log(results.affectedRows + " products updated!\n");



    });

    connection.query("select * FROM products WHERE ?",{item_id: product}, function(err, results) {
        if (err) throw err;


        for(i=0;i<results.length; i++){
            var parseNum = parseInt(i) + 1;
            console.log("Item ID: " + results[i].item_id + " Product Name: " + results[i].product_name + "   |   " + "Department Name: " +  results[i].department_name + "   |   " + "Price: $"+  results[i].price + "   |   " + "Stock Quantity: " + results[i].stock_quantity);
            var totalCost = results[i].price * customerQuantity;
            console.log("The customer spent " + totalCost + " and bought " + customerQuantity + " " + results[i].product_name + "(s)");
        }
        
        // connection.end();
    });
}
function checkStock(product, quantity) {
    connection.query("select * FROM products WHERE ?",{item_id: product}, function(err, results) {
        if (err) throw err;

        if(results.length===0){
            console.log("This product ID does not exist!");
            return -1;
        }
        
        if(results[0].stock_quantity<quantity){
            console.log("Insufficient quantity!")
            return -2;
        }else{
            //subtract what customer is purchasing
            var remainingQuantity = results[0].stock_quantity-quantity;

            fufillOrder(product, remainingQuantity, quantity);
        }


        // for(i=0;i<results.length; i++){
        //     var parseNum = parseInt(i) + 1;
        //     console.log("Item ID: " + results[i].item_id + " Product Name: " + results[i].product_name + "   |   " + "Department Name: " +  results[i].department_name + "   |   " + "Price: $"+  results[i].price + "   |   " + "Stock Quantity: " + results[i].stock_quantity);
        // }
        
        // connection.end();
    });
}



// function to handle posting new items up for auction
function postAuction() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the item you would like to submit?"
      },
      {
        name: "category",
        type: "input",
        message: "What category would you like to place your auction in?"
      },
      {
        name: "startingBid",
        type: "input",
        message: "What would you like your starting bid to be?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO auctions SET ?",
        {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid,
          highest_bid: answer.startingBid
        },
        function(err) {
          if (err) throw err;
          console.log("Your auction was created successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}

function displayData() {
    connection.query("select * FROM products", function(err, results) {
        if (err) throw err;
    
    
        for(i=0;i<results.length; i++){
            var parseNum = parseInt(i) + 1;
            console.log("Item ID: " + results[i].item_id + " Product Name: " + results[i].product_name + "   |   " + "Department Name: " +  results[i].department_name + "   |   " + "Price: $"+  results[i].price + "   |   " + "Stock Quantity: " + results[i].stock_quantity);
        }
        start();
        // connection.end();
    });

    
    
}


function bidAuction() {
  // query the database for all items being auctioned
//   connection.query("select * FROM products", function(err, results) {
//     if (err) throw err;
//     var resultJSON = JSON.stringify(results);


//     for(i=0;i<results.length; i++){
//         var parseNum = parseInt(i) + 1;
//         console.log("Product " + parseNum+ " Name: " + results[i].product_name + "   |   " + "Department Name: " +  results[i].department_name + "   |   " + "Price: $"+  results[i].price + "   |   " + "Stock Quantity: " + results[i].stock_quantity);
//     }

    // mysql -u tgwalker93 --password=Mario626 -e “SELECT * FROM products;” 
    // console.log(results[1])
    // console.log(JSON.stringify(results));


    // once you have the items, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices: function() {
//             var choiceArray = [];
//             for (var i = 0; i < results.length; i++) {
//               choiceArray.push(results[i].item_name);
//             }
//             return choiceArray;
//           },
//           message: "What auction would you like to place a bid in?"
//         },
//         {
//           name: "bid",
//           type: "input",
//           message: "How much would you like to bid?"
//         }
//       ])
//       .then(function(answer) {
//         // get the information of the chosen item
//         var chosenItem;
//         for (var i = 0; i < results.length; i++) {
//           if (results[i].item_name === answer.choice) {
//             chosenItem = results[i];
//           }
//         }

//         // determine if bid was high enough
//         if (chosenItem.highest_bid < parseInt(answer.bid)) {
//           // bid was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE auctions SET ? WHERE ?",
//             [
//               {
//                 highest_bid: answer.bid
//               },
//               {
//                 id: chosenItem.id
//               }
//             ],
//             function(error) {
//               if (error) throw err;
//               console.log("Bid placed successfully!");
//               start();
//             }
//           );
//         }
//         else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });



}
