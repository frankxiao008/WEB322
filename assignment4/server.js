/********************************************************************************* 
 *  WEB322 – Assignment 04 * 
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
 * No part of this assignment has been copied manually or electronically from any other source  *
 *   (including 3rd party web sites) or distributed to other students. *  
 * *  Name: _____Saihong Xiao_____ Student ID: __140777178___ Date: _01/26/2019__ *
 *  *  Online (Heroku) Link: ___________https://afternoon-woodland-75219.herokuapp.com/____ *
 *  ********************************************************************************/  
const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path= require("path");
const dataService = require("./data-service.js");
const fs = require('fs');
const exphbs= require('express-handlebars');
const HTTP_PORT = process.env.PORT || 8080;
const app = express();


function onHttpStart() {

    console.log("Express http server listening on "+ HTTP_PORT);
  
    return new Promise(function(reslove, reject){
        dataService.initialize().then(function(value){
            console.log(value);
        }).catch(function(reason){
                console.log(reason);
            }); 
    });
}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(function(req,res,next){     
    let route = req.baseUrl + req.path;     
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");     
    next(); 
}); 
 
app.engine('.hbs', exphbs({ 
    extname: ".hbs",
    defaultLayout: "main",
    helpers:{
        navLink: function(url, options){     return '<li' +          
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +  
            '><a href="' + url + '">' + options.fn(this) + '</a></li>'; } ,
        
            equal:(lvalue, rvalue, options)=>{
            if(arguments.length <3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue){
                return options.inverse(this);
            }else{
                return options.fn(this);
            }
        }
    }
}));
app.set("view engine", ".hbs");


app.get("/", function(req, res){
    res.render("home");
});

app.get("/about", function(req, res){
    res.render("about");
});


app.get("/employees", function(req, res){


    if(req.query.status ){
        dataService.getEmployeesByStatus(req.query.status).then((data)=>{
           
            res.render("employees", {employees: data});
           // res.render("employees", { data: data, title: "Employees" });
        }).catch(function(err){
                res.render({message: err});
            })
    }else if(req.query.department){
        dataService.getEmployeesByDepartment(req.query.department).then(data=>{
            res.render("employees", {employees: data});
            
        }).catch(err=>{
            res.render({message: err});
        }) }else if(req.query.manager){
            dataService.getEmployeesByManager(req.query.manager).then(data=>{
                res.render("employees", {employees: data});
            }).catch(err=>{ res.render({message: err})});

        }else {
            dataService.getAllEmployees().then(data=>{              
                res.render("employees",  {employees:data});
            }).catch(              
                err=>{res.render({message: err})}            
            );
    } 
});

app.get('/employee/:value', (req, res)=>{
    dataService.getEmployeeByNum(req.params.value).then(data=>{
        res.render("employee", {employee: data }); 
    }).catch(
        (err)=>{
        res.render("employee", {message: err});   
    });
});


app.get("/managers", function(req,res){
   
   dataService.getManagers().then(function(data){
        res.json(data);
   }).catch(function(err){
       res.json({message: err});
   });
 
 });


app.get("/departments", function(req,res){
    
    dataService.getDepartments().then(function(data){
       
        res.render("departments", { departments: data });
    }).catch(function(err){
        res.render({message: err});
    });
 
   
});

app.get("/employees/add", function(req,res){
    res.render("addEmployee");
});

app.get("/images/add", function(req, res){
    res.render("addImage");
               
});

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req, file, cb){
        cb(null, Date.now()+path.extname(file.originalname));
    }
});
const upload = multer({storage:storage});

app.post("/images/add", upload.single("imageFile"), function(req, res){
    res.redirect('/images');
} );


 app.get("/images",  function(req, res){  
      
     fs.readdir("./public/images/uploaded", function(err, items){      
         res.render("images", {data:items});
    });

 });

 
app.post("/employees/add", function(req, res){
    dataService.addEmployees(req.body).then(
        res.redirect('/employees')
 
    )
     .catch(function(err){
        res.json({message: err});
   });


});

app.post("/employee/update", function(req, res){
    console.log(req.body);
    dataService.updateEmployee(req.body).then(
        ()=>res.redirect('/employees')
    );
       
});




app.use(function(req, res){
    res.status(404).send("PAGE NOT FOUND!!!!!!!!!!!");
});

app.listen(HTTP_PORT, onHttpStart);


