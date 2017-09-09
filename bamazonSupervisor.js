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
        message: "What would you like to do as Supervisor?",
        choices:["View Product Sales by Department", "Create New Column", "Remove Column"]
      }
      ])
      .then(function(answer) {
        if(answer.menuChoice==="View Product Sales by Department"){
            viewProductSalesByDepartments();
        }

        if(answer.menuChoice==="Create New Column"){
            askNewColumn();
        }

        if(answer.menuChoice==="Remove Column") {
            askRemoveColumn();
        }

      });
  }

  function viewProductSalesByDepartments() {
var query = "SELECT * FROM departments JOIN (SELECT products.department_name, sum(products.product_sales) as product_sales_total,"
+ "sum(products.product_sales)-departments.over_head_costs as total_profit from products, departments group by department_name )" 
+ "as totalProfitTable ON departments.department_name=totalProfitTable.department_name";

connection.query(query, function(err, results) {
    if (err) throw err;

    console.log(results);

    for(i=0;i<results.length; i++){
        var parseNum = parseInt(i) + 1;
        console.log("Department ID: " + results[i].department_id + " department_name: " + results[i].department_name + " | " + "Over Head Costs: " +  results[i].over_head_costs + " | " + "department_name: "+  results[i].department_name + "   |   " + "Product total: " + results[i].product_sales_total +  "| total_profit: " + results[i].total_profit);
    }
    connection.end();

});

  }









  function askNewColumn() {
    inquirer.prompt([{
        name: "newColumn",
        type: "input",
        message: "What is the name of the column that you would like to create and add to the departments table?",
      },
      {
        name: "dataType",
        type: "list",
        message: "What is the data type for this column?",
        choices: ["VARCHAR(50)", "INTEGER(255)", "DECIMAL(10,2)"]
      },
      
      ])
      .then(function(answer) {
        createNewColumn(answer.newColumn, answer.dataType)

      });     
  }

  function createNewColumn(newColumn, dataType) {
      var query = "ALTER TABLE departments ADD " + newColumn + " " +dataType;
    
    connection.query(query, function(err, results) {
        if (err) throw err;
    
    
        console.log(newColumn + " has been added to the departments table!");
        connection.end();
    });

  }

  function askRemoveColumn() {
    inquirer.prompt([{
        name: "removeColumn",
        type: "input",
        message: "What is the name of the column that you would like to remove from the departments table?",
      }
      ])
      .then(function(answer) {
        removeColumn(answer.removeColumn)

      });     



  }

  function removeColumn(removeColumn) {
    var query = "ALTER TABLE departments DROP " + removeColumn;
    
    connection.query(query, function(err, results) {
        if (err) throw err;
    
    
        console.log(removeColumn + " has been deleted from the departments table!");
        connection.end();
    });
  }