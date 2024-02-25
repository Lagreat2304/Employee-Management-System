const express  = require('express');
const Employees = require("./dbFiles/Employees");
const dbOperation = require("./dbFiles/dbOperation");
const cors = require('cors');
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://employeee.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });

app.use(express.json());
app.use(cors());
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
    port: process.env.PORT
};
const port = process.env.PORT || 5000;

app.get('/employeesearch', async(req,res) => {
    console.log('called');
    const result = await dbOperation.getemployee(req.body.name);
    res.send(result.recordset);
});

app.post('/employeeadd', async(req,res) => {
    await dbOperation.addemployee(req.body);
    const result = await dbOperation.getemployee(req.body.EmployeeID);
    res.send(result.recordset);
});

app.put('/employeeupdate/:id', async (req, res) => {
    try {
        const EmployeeID = req.params.id;
        await dbOperation.updateemployee(EmployeeID, req.body);
        const result = await dbOperation.getemployee(EmployeeID);
        res.send(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});


app.delete('/employeedelete/:id', async (req, res) => {
    try {
        const employeeID = req.params.id;
        await dbOperation.deleteemployee(employeeID);
        const result = await dbOperation.getemployee(employeeID);
        res.send(result.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => console.log(`Listening at ${port}`));
