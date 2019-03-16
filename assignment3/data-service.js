

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

module.exports.getDepartmentsById= function(id){
    var byid =[];
    return new Promise(function(resolve, reject){
       if(departments.length ==0){
           reject('No results returned!');
       }else{
           for(let i=0; i<departments.length; i++){
               if(id = departments.id)
                byid.push(departments[i]);
           }

           resolve(byid);
       }
    });
};

module.exports.addEmployees = function( employeeData ){

    return new Promise(function(resolve, reject){
 
            if(employeeData.isManager == undefined)
                employeeData.isManager = false;
             else
                 employeeData.isManager = true;
            employeeData.employeeNum = (employees.length)+1;
            employees.push(employeeData);
            resolve("the data has been update successfully!");
        

    });
}

module.exports.getEmployeesByStatus=function(status){
    var employeesbystatus = [];
    return new Promise(function(resolve, reject){
        for(var i=0; i<employees.length; i++){
            if(employees[i].status ==status)
            employeesbystatus.push(employees[i]);
        }  
        
         if(employeesbystatus.length ==0)
                reject("No result returned");
        resolve(employeesbystatus);
    });
}

module.exports.getEmployeesByDepartment = function(department){
    var bydepartment =[];
    return new Promise((resolve, reject)=>{
        for(let i=0; i<employees.length; i++){
            // if(employees[i].department == department)
            //         bydepartment.push(employees[i]);
         bydepartment = employees.filter(employee=>{ return employee.department == department;});
            
        }
        if(bydepartment.length == 0)
            reject("No result returned!");
        resolve(bydepartment);
    });
    
}
module.exports.getEmployeesByManager = function(manager){
    var bymanager =[];
    return new Promise((resolve, reject)=>{
        bymanager = employees.filter(employee=>{return employee.employeeManagerNum==manager});
        if(bymanager.length ==0)
            reject("No result returned!");
        resolve(bymanager);
    });
}

module.exports.getEmployeeByNum = function(num){
    var theemployee;
    return new Promise((resolve, reject)=>{
            theemployee = employees.filter(element=>{return element.employeeNum==num});
            if(theemployee.length ==0)
                reject("No result returned!");
            resolve(theemployee);
    });
}