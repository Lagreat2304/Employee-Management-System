import React, {useEffect, useState, useRef} from 'react';
import './App.css';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
//import employees from '../dbFiles/employees';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import * as XLSX from 'xlsx';

function App() {

  const [returnedData, setReturnedData] = useState(['']);
  const [employee, setEmployee] = useState({EmployeeID:'', EmployeeName: '' , Department: '', Designation: '', Salary:'',address:'',DOB:'', PhoneNo:''});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedEmployee, setselectedEmployee] = useState(null);
  const [getButtonClicked, setGetButtonClicked] = useState(false);
  const alertRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  const setInput = (e) => {
    const {name,value} = e.target;
    console.log(value);
    setEmployee(prevState => ({
      ...prevState,
      [name] : value
    }));
  }

  const fetchData = async () => {
    try {
      const response = await fetch(`https://employee-management-system-yfip.onrender.com/employeesearch?name=${employee.EmployeeID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const newData = await response.json();
      if (Array.isArray(newData)) {
        setReturnedData(newData);
        setGetButtonClicked(true);
        setSuccessMessage('Fetched Successfully!');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setErrorMessage('Failed to fetch data. Please try again.');
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(returnedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Details');
    XLSX.writeFile(workbook, 'employee_details.xlsx');
  };
  
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#E4E4E4',
      padding: 10,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    employee: {
      marginBottom: 10,
    },
    boldText: {
      fontWeight: 700
    },

    pdfDownloadButton: {
      backgroundColor: '#4CAF50',
      color: '#FFFFFF',
      padding: '8px 16px',
      borderRadius: '5px',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  });
  
  const MyDocument = ({ employees }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Employee Details</Text>
          {employees.map((employee) => (
            <View style={styles.employee} key={employee.EmployeeID}>
              <Text style={styles.boldText}>Employee ID: </Text>
            <Text>{employee.EmployeeID}</Text>
              <Text>Employee Name: {employee.EmployeeName}</Text>
              <Text>Department: {employee.Department}</Text>
              <Text>Designation: {employee.Designation}</Text>
              <Text>Salary: {employee.Salary}</Text>
              <Text>Address: {employee.address}</Text>
              <Text>Date of Birth: {employee.DOB}</Text>
              <Text>Phone No: {employee.PhoneNo}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
  
  const updateemployee = async () => {
    try {
      const newData = await fetch(`https://employee-management-system-yfip.onrender.com/employeeupdate/${selectedEmployee.EmployeeID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(selectedEmployee),
      }).then((res) => res.json());

      if (Array.isArray(newData)) {
        setReturnedData(newData);
        console.log('employee updated successfully');
        setselectedEmployee(null);
        setSuccessMessage('Employee Updated Successfully');
      }
    } catch (error) {
      console.error('Error updating employee:', error.message);
      setErrorMessage('Error Updating employee. Please try again');
    }
  };

  const selectedEmployeeForUpdate = (employee) => {
    setselectedEmployee({ ...employee });
  };
  const addemployee = async() => {
    if(employee.EmployeeID==='' || employee.EmployeeName==='' || employee.Department==='' || employee.Designation==='' || employee.Salary==='' || employee.address==='' || employee.DOB==='' || employee.PhoneNo===''){
      console.log(employee);
      setErrorMessage('All fields are required.');
      return;
    }
    const newData = await fetch('https://employee-management-system-yfip.onrender.com/employeeadd',{
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json'
      },
      body : JSON.stringify({
        ...employee
      })
    })
    .then(res => res.json())
    if(Array.isArray(newData)){
      setReturnedData(newData);
      console.log(newData);
      setSuccessMessage('Employee Added Successfully!');
  }
};

const deleteemployee = async (EmployeeId) => {
  try {
    const newData = await fetch(`https://employee-management-system-yfip.onrender.com/employeedelete/${EmployeeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(res => res.json());

    if (Array.isArray(newData)) {
      setReturnedData(newData);
      console.log('Employee Deleted successfully');
      setSuccessMessage('Employee Deleted successfully!');
    }
  } catch (error) {
    console.error('Error deleting Employee:', error.message);
    setErrorMessage('Error deleting Employee. Please try again.');
  }
};

useEffect(() => {
  if (alertRef.current) {
    alertRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}, [errorMessage, successMessage]);

useEffect(() => {
  const timeoutId = setTimeout(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, 3000);
  return () => clearTimeout(timeoutId);
}, [errorMessage, successMessage]);

const startIndex = (currentPage - 1) * employeesPerPage;
const endIndex = startIndex + employeesPerPage;
const displayedEmployees = returnedData.slice(startIndex, endIndex);

  return (
    <div className="App">
       {errorMessage && (
        <div className="message-box error" ref={alertRef}>
          <Stack spacing={2} sx={{ width: '100%' }}>
            <Alert severity="error" onClose={() => setErrorMessage('')}>
              {errorMessage}
            </Alert>
          </Stack>
        </div>
      )}
      {successMessage && (
        <div className="message-box success" ref={alertRef}>
          <Stack spacing={2} sx={{ width: '100%' }}>
            <Alert severity="success" onClose={() => setSuccessMessage('')}>
              {successMessage}
            </Alert>
          </Stack>
          </div>
      )}
      
    <div className='form-container'>
    <label className='form-label'>Employee ID</label>
      <input type='text' className='form-input' name = 'EmployeeID' placeholder='EmployeeID' onChange={setInput}></input>
      <label className='form-label'>Employee Name</label>
      <input type='text' name = 'EmployeeName' className='form-input' placeholder='Employee Name' onChange={setInput} ></input>
      <label className='form-label'>Department</label>
     <input  name = 'Department' className='form-input' placeholder='Department' onChange={setInput} ></input>
     <label className='form-label'>Designation</label>
      <input type='text' className='form-input' name = 'Designation' placeholder='Designation' onChange={setInput} ></input>
     <label className='form-label'>Salary</label>
      <input type='text' className='form-input' name = 'Salary' placeholder='Salary' onChange={setInput} ></input>
     <label className='form-label'>Address</label>
      <input type='text' className='form-input' name = 'address' placeholder='Address' onChange={setInput} ></input>
     <label className='form-label'>Date of Birth</label>
      <input type='text' className='form-input' name = 'DOB' placeholder='Date of Birth(dd-mm-yyyy)' onChange={setInput} ></input>
      <label className='form-label'>Phone No</label>
      <input type='text' className='form-input' name = 'PhoneNo' placeholder='Phone No' maxLength={10} onChange={setInput} ></input>
      <button className='form-button' onClick={() => fetchData()}> Fetch </button>
      <hr/>
      <button className='form-button' onClick={() => addemployee()}> Create </button>
      <hr/>
    </div>
    <div className='table-conatiner'>
        <table>
          <thead>
            <tr>
              <th>EmployeeID</th>
              <th>EmployeeName</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Address</th>
              <th>Date of Birth</th>
              <th>Phone No</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
          {displayedEmployees.map((data) => (
              <tr key={data.EmployeeID}>
                <td>{data.EmployeeID}</td>
                <td>{data.EmployeeName}</td>
                <td>{data.Department}</td>
                <td>{data.Designation}</td>
                <td>{data.Salary}</td>
                <td>{data.address}</td>
                <td>{data.DOB}</td>
                <td>{data.PhoneNo}</td>
                <td>
                  {getButtonClicked && (
                  <button className='update-button' onClick={() => selectedEmployeeForUpdate(data)}>Update</button>
                  )}
                  </td>
                <td>
                  {getButtonClicked && (
                  <button className='delete-button' onClick={() => deleteemployee(data.EmployeeID)}>Delete</button>
                  )}
                  </td>
              </tr>
            ))}
          </tbody>
          {selectedEmployee && (
        <div className='update-course-overlay'>
          <h3>Update Employee</h3>
          <label>Employee Name</label>
          <input name="EmployeeName" value={selectedEmployee.EmployeeName} onChange={(e) => setselectedEmployee({ ...selectedEmployee, EmployeeName: e.target.value })} />
          <label>Department</label>
          <input name="Department" value={selectedEmployee.Department} onChange={(e) => setselectedEmployee({ ...selectedEmployee, Department: e.target.value })} />
          <label>Designation</label>
          <input  name="Designation" value={selectedEmployee.Designation} onChange={(e) => setselectedEmployee({ ...selectedEmployee, Designation: e.target.value })} />
          <label>Salary</label>
          <input  name="Salary" value={selectedEmployee.Salary} onChange={(e) => setselectedEmployee({ ...selectedEmployee, Salary: e.target.value })} />
          <label>Address</label>
          <input  name="address" value={selectedEmployee.address} onChange={(e) => setselectedEmployee({ ...selectedEmployee, address: e.target.value })} />
          <label>Date of Birth</label>
          <input  name="DOB" value={selectedEmployee.DOB} onChange={(e) => setselectedEmployee({ ...selectedEmployee, DOB: e.target.value })} />
          <label>Phone No</label>
          <input  name="PhoneNo" maxLength={10} value={selectedEmployee.PhoneNo} onChange={(e) => setselectedEmployee({ ...selectedEmployee, PhoneNo: e.target.value })} />
          <div className='button-container'>
          <button className= 'save-button' onClick={updateemployee}>Update</button>
          <button className='cancel-button' onClick={() => setselectedEmployee(null)}>Cancel</button>
          </div>
        </div>
      )}
        </table>
        <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(returnedData.length / employeesPerPage)))
          }
          disabled={currentPage === Math.ceil(returnedData.length / employeesPerPage)}
        >
          Next
        </button>
      </div>
      </div>
      <br/>
      <PDFDownloadLink document={<MyDocument employees={returnedData} />} fileName="employee_details.pdf" style={styles.pdfDownloadButton}>
  {({ blob, url, loading, error }) =>
    loading ? 'Loading document...' : 'Download PDF'
  }
</PDFDownloadLink>
<button className='form-button' onClick={exportToExcel}>Download Excel</button>
      </div>
  );
}

export default App;
