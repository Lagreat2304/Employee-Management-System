const Employees = require('./Employees');
require('dotenv').config();
var config = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
    options: {
      trustedconnection: false,
      enableArithAbort: true,
      trustServerCertificate: true,
      instancename: process.env.INSTANCE,
    },
    port: parseInt(process.env.PORT,10)
};

const sql = require('mssql');
const deleteemployee = async (employeeID) => {
    try {
        let pool = await sql.connect(config);
        let employees = await pool.request().query(`DELETE FROM EmployeeMaster WHERE EmployeeID = '${employeeID}'`);
        console.log(employees);
        return employees;
    } catch (error) {
        console.log(error);
    }
};


const updateemployee = async (EmployeeID, updatedData) => {
    try {
        let pool = await sql.connect(config);
        let employees = await pool.request()
            .input('EmployeeName', sql.NVarChar, updatedData.EmployeeName)
            .input('Department', sql.NVarChar, updatedData.Department)
            .input('Designation', sql.NVarChar, updatedData.Designation)
            .input('Salary', sql.NChar, updatedData.Salary)
            .input('address', sql.NVarChar, updatedData.address)
            .input('DOB', sql.NVarChar, updatedData.DOB)
            .input('PhoneNo',sql.NVarChar, updatedData.PhoneNo)
            .input('EmployeeID', sql.NVarChar, EmployeeID)
            .query(`
                UPDATE EmployeeMaster 
                SET EmployeeName = @EmployeeName, 
                    Department = @Department, 
                    Designation = @Designation,
                    address = @address,
                    DOB = @DOB,
                    PhoneNo = @PhoneNo
                WHERE EmployeeID = @EmployeeID`);
        console.log(employees);
        return employees;
    } catch (error) {
        console.log(error);
        throw error;
    }
};


const addemployee = async(newemployee) => {
    try{
        let pool = await sql.connect(config);
        let employees = await pool.request().query(`insert into EmployeeMaster Values('${newemployee.EmployeeID}', '${newemployee.EmployeeName}' , '${newemployee.Department}' , '${newemployee.Designation}', '${newemployee.Salary}' , '${newemployee.address}',  '${newemployee.DOB}' , '${newemployee.PhoneNo}')`);
        console.log(employees);
        return employees;
    }
    catch(error){
        console.log(error);
    }
}
const getemployee = async(Employees) => {
    try{
        let pool = await sql.connect(config);
        let employees =await pool.request().query(`SELECT * from EmployeeMaster`);
        console.log(employees);
        return employees;
    }
    catch(error){
        console.log(error);
    }
}


module.exports = {
    addemployee,
    getemployee,
    deleteemployee,
    updateemployee
}

  