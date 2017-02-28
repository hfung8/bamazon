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
	startIt();
});

function startIt(){
connection.query('SELECT * FROM Products', function(err,rows,fields){
	if (err) throw err; 
	console.log(rows);
	start();
});
}

var start = function(){
	var questions = [{
		type: "input",
		name: "firstQuestion",
		message: "What is the ID of the products that you would like to buy ?",
		validate: function(value){
		if (isNaN(value) == false){
			return true;
		} else {
			return false;
		}
	}
},
	{
		type: "input",
		name: "secondQuestion",
		message: "How many units of product would you like to buy?", 
		validate: function(value){
		if (isNaN(value) == false){
			return true;
		} else {
			return false;
		}
	}	
	}]

inquirer.prompt(questions).then(function(answer){
	var firstAnswer = answer.firstQuestion;
	var secondAnswer = answer.secondQuestion;
	var query = "SELECT ItemID,StockQuantity FROM Products WHERE ? = ItemID";
	connection.query(query,firstAnswer,function (err,res){
		for (var i = 0; i<res.length; i++){
			if (res[i].StockQuantity >= secondAnswer){
				var query = "UPDATE Products SET StockQuantity = StockQuantity - ? WHERE ? = ItemID";
				connection.query(query,[secondAnswer,firstAnswer], function (err,res){
				var query = "SElECT Price * ? FROM Products WHERE ? = ItemID";
				connection.query(query,[secondAnswer,firstAnswer], function (err,res){
				console.log(res);
				})
				})
				} else { 
				console.log("Insufficient Supply!");
				start();		
				}
			}
		})
	})
}




