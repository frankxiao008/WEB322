

var employees = [];
var departments =[];
const fs = require('fs');

module.exports.initialize =function (){
     
    return new Promise(function(resolve, reject){
        try{
            fs.readFile('./data/employees.json', (err, data)=>{
                if(err) throw err;
                employees = JSON.parse(data);
            });
            fs.readFile('./data/departments.json', (err, data)=>{
                if(err) throw err;
                departments = JSON.parse(data);
            });
        }catch(ex){
            reject('Unable to read file!');
        }

        resolve("The json files are read successfully.")
    });

}



module.exports.getAllEmployees = function(){
    var Allemployees =[];
    return new Promise((resolve, reject)=>{
        for(var i=0; i<employees.length; i++){
            Allemployees.push(employees[i]);
        }
        if(Allemployees.length ==0)
            reject("No result returned");
        resolve(Allemployees);
    });

};

module.exports.getManagers= function(){
    var managersArray =[];
    return new Promise(function(resolve, reject){
        for(var i=0; i<employees.length; i++){
           if(employees[i].isManager ==true){
               managersArray.push(employees[i]);
           }
                
        }
        if(managersArray.length ==0)
            reject("No result returned");
        resolve(managersArray);
    });
};

module.exports.getDepartments= function(){
   
    return new Promise(function(resolve, reject){
       if(departments.length ==0){
           reject('No results returned!')
       }else{
           resolve(departments);
       }
    });
};

