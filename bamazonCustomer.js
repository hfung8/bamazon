var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "BAMAZON_DB"
});

connection.connect(function(err){
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	makeTable();
});

var makeTable = function(){
connection.query('SELECT * FROM Products', function(err,res){
	if (err) throw err;
	for (var i = 0; i < res.length; i++){
	console.log(res[i].ItemID+" || "+ res[i].ProductName+" || "+ res[i].DepartmentName+" || "+ res[i].Price+" || "+ res[i].StockQuantity+"\n");
		}
		promptCustomer(res);
	})
}

var promptCustomer = function(res){
	inquirer.prompt({
		type: "input",
		name: "choice",
		message: "What would you like to purchase? Quit with [Q]",
	}).then(function(answer){
		console.log(answer);
		var correct = false; 
		if(answer.choice.toUpperCase()=="Q"){
			process.exit();
		}
		for (var i = 0; i<res.length;i++){
			if(res[i].ProductName==answer.choice){
				correct=true;
				var product=answer.choice;
				var id = i;
				inquirer.prompt({
					type: "input",
					name: "quant",
					message: "How many units of product would you like to buy?", 
					validate: function(value){
					if (isNaN(value) == false){
						return true;
					} else {
						return false;
					}
				}
			}).then(function(answer){
				if((res[id].StockQuantity-answer.quant)>0){
					connection.query("UPDATE Products SET StockQuantity='"+(res[id].StockQuantity-answer.quant)+"'WHERE ProductName='"+product+"'", function(err,res2){
						console.log("Product Bought!");
						makeTable();
					})
				} else {
					console.log("Not a valid selection!");
					promptCustomer(res);
				}
			})
		}
	}
if(i==res.length && correct==false){
	console.log("Not a valid selection!")
	promptCustomer(res);
}
	})
		}
