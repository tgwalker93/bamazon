var mysql = require("mysql");
var inquirer = require("inquirer");


var globalPrice;
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
      message: "What is the ID of the product that you would like to buy?"
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


    
      start();


    });


}
}

function fufillOrder(product, remainingQuantity, customerQuantity, price){  

    connection.query("UPDATE products SET ? WHERE ?",[
        {
            stock_quantity: remainingQuantity, product_sales: customerQuantity*price
        },

        {
            item_id: product
        },
    ], 
        function(err, results) {

        console.log(results.affectedRows + " products updated!\n");



    });

    connection.query("select * FROM products WHERE ?",{item_id: product}, function(err, results) {
        if (err) throw err;


        for(i=0;i<results.length; i++){
            var parseNum = parseInt(i) + 1;
            console.log("Item ID: " + results[i].item_id + " Product Name: " + results[i].product_name + "   |   " + "Department Name: " +  results[i].department_name + "   |   " + "Price: $"+  results[i].price + "   |   " + "Stock Quantity: " + results[i].stock_quantity + "      |      Product Sales: " + results[i].product_sales);
            var totalCost = results[i].price * customerQuantity;
            console.log("The customer spent " + totalCost + " dollars, and bought " + customerQuantity + " " + results[i].product_name + "(s)");
        }
        
         connection.end();
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
            
            console.log(results[0].price);
            globalPrice = results[0].price;
            fufillOrder(product, remainingQuantity, quantity, results[0].price);
        }

    });
}

function displayData() {
    connection.query("select * FROM products", function(err, results) {
        if (err) throw err;
    
    
        for(i=0;i<results.length; i++){
            var parseNum = parseInt(i) + 1;
            console.log("Item ID: " + results[i].item_id + " Product Name: " + results[i].product_name + "   |   " + "Department Name: " +  results[i].department_name + "   |   " + "Price: $"+  results[i].price + "   |   " + "Stock Quantity: " + results[i].stock_quantity +  "    |    Product Sales: " + results[i].product_sales);
        }
        start();
    });

    
    
}