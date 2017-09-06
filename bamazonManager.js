var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "tgwalker93",
  
    // Your password
    password: "Mario626",
    database: "bamazon"
  });


  connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    mainMenu();
  
  });

  function mainMenu() {
    inquirer.prompt([{
        name: "menuChoice",
        type: "list",
        message: "What is the ID of the produt that you would like to buy?",
        choices:["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
      }
      ])
      .then(function(answer) {
        if(answer.menuChoice==="View Products for Sale"){
            viewProducts();
        }

        if(answer.menuChoice==="View Low Inventory"){
            viewLowInventory();
        }
        if(answer.menuChoice==="Add to Inventory"){
            addToInventory();
        }
        if(answer.menuChoice==="Add New Product"){
            addNewProduct();
        }
      });
  }

  function viewProducts() {
    connection.query("select * FROM products", function(err, results) {
        if (err) throw err;
    
        console.log("PRODUCTS FOR SALE");
        for(i=0;i<results.length; i++){
            var parseNum = parseInt(i) + 1;
            console.log("Item ID: " + results[i].item_id + " Product Name: " + results[i].product_name + "   |   " + "Department Name: " +  results[i].department_name + "   |   " + "Price: $"+  results[i].price + "   |   " + "Stock Quantity: " + results[i].stock_quantity);
        }
        connection.end();
    });
  }

  function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, results) {
        if (err) throw err;
    
        console.log("LOW INVENTORY: ");
        for(i=0;i<results.length; i++){
            var parseNum = parseInt(i) + 1;
            console.log("Item ID: " + results[i].item_id + " Product Name: " + results[i].product_name + "   |   " + "Department Name: " +  results[i].department_name + "   |   " + "Price: $"+  results[i].price + "   |   " + "Stock Quantity: " + results[i].stock_quantity);
        }
        connection.end();
    });
  }

  var products = [];
  var productsRaw = [];
  var item_ids = [];
  var userChoice = "";

  function addToInventory() {


    connection.query("select * FROM products", function(err, results) {
        if (err) throw err;
        
        productsRaw = results;
   
        
        for(i=0;i<results.length; i++){
            var parseNum = parseInt(i) + 1;       
            products.push(results[i].product_name);
            item_ids.push(results[i].item_id)
        
        }

        askAboutAddingInventory();
    });


function askAboutAddingInventory() {
    var isNum = false;
    if(isNum ===false) {

    inquirer.prompt([{
        name: "itemChoice",
        type: "list",
        message: "What product would you like to add inventory to?",
        choices: products
      },
      {
        name: "howMuch",
        type: "input",
        message: "How much would you like to add?",
      }
      ])
      .then(function(answer) {
        var parseHowMuch = parseInt(answer.howMuch);
        if(isNaN(parseHowMuch)) {
            console.log("Sorry, the quantity that you chose was NOT a number, please try again");
            askAboutAddingInventory();
    
        } else {
            isNum = true;
            executeAddInventory(answer.itemChoice, parseInt(answer.howMuch))
            return;
        }

        



      });


    }
}

function executeAddInventory(itemChoice, howMuch) {

    var totalQuantity = 0;

    connection.query("select * FROM products WHERE product_name=?",itemChoice, function(err, results) {
        if (err) throw err;
    
        
        totalQuantity = results[0].stock_quantity + howMuch;
   
        console.log("INVENTORY HAS BEEN ADDED.")
        console.log("Item ID: " + results[0].item_id + " Product Name: " + results[0].product_name + "   |   " + "Department Name: " +  results[0].department_name + "   |   " + "Price: $"+  results[0].price + "   |   " + "Stock Quantity: " + totalQuantity);

    
        connection.query("UPDATE products SET ? WHERE ?",[
            {
                stock_quantity: totalQuantity
            },
    
            {
                product_name: itemChoice
            }
        ], 
            function(err, results) {
    
            console.log(results.affectedRows + " products updated!\n");
    
            connection.end();
    
        });

    });




        

}
      
  }

  function addNewProduct() {

    inquirer.prompt([{
        name: "productName",
        type: "input",
        message: "What is the name of the product that you want to add?",
      },
      {
        name: "departmentName",
        type: "input",
        message: "What department would this be in?",
      },
      {
        name: "price",
        type: "input",
        message: "What is the price of this product?",
      },
      {
        name: "stockQuantity",
        type: "input",
        message: "How much stock do you want to add to the inventory?",
      },
      ])
      .then(function(answer) {
        var parsePrice = parseInt(answer.price);
        var parseStockQuantity = parseInt(answer.stockQuantity);
        if(isNaN(parsePrice) || isNaN(parseStockQuantity)) {
            console.log("Sorry, the price or the stock quantity that you chose was NOT a number, please try again");
            connection.end();
            return;
        }


        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES(?, ?, ?, ?)", [answer.productName, answer.departmentName, parsePrice, parseStockQuantity], function(err, results) {
            if (err) throw err;
        

            console.log(results.affectedRows + " products updated!\n");
        
            connection.query("select * FROM products", function(err, results) {
                if (err) throw err;
            
                console.log("PRODUCT ADDED TO TABLE");
                for(i=0;i<results.length; i++){
                    console.log("Item ID: " + results[i].item_id + " Product Name: " + results[i].product_name + "   |   " + "Department Name: " +  results[i].department_name + "   |   " + "Price: $"+  results[i].price + "   |   " + "Stock Quantity: " + results[i].stock_quantity);
                }
                connection.end();
            });
        
             });







      });
  }