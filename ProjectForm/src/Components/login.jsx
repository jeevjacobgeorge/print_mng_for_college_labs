import React, { useEffect } from 'react'
import { useState } from 'react'
import { Navigate, redirect, resolvePath } from "react-router-dom";
import { Link } from 'react-router-dom'
import loginImage from '../assets/cube.jpg'
import profilepic from '../assets/profilepic.svg'
import '../assets/login.css'
const GetForm = () => {
    const [selectedBatch,setSelectedBatch] = useState('');
    const [selectedRollNo,setSelectedRollNo] = useState('');
    const [selectedLab,setSelectedLab] = useState('');
    const [response,setResponse] = useState('');
    const [labOptions, setLabOptions] = useState([]);
    const [batchOptions, setBatchOptions] = useState([]);
    const [responseRecieved, setResponseRecieved] = useState(false);


    function handleSubmit(e) {
        e.preventDefault();
        fetch(`http://127.0.0.1:8000/api/student?roll_no=${selectedRollNo}&batch=${selectedBatch}`, {
            method: 'GET',
        })
        .then(res => {
            if (res.statusText === "OK" ){
                setResponseRecieved(true);
            }
            else{
                alert("Please sign up. Selected Roll No or Batch have not been registered")
            }
        })
        
        .catch(error => console.log(error))

           
            
    }

    const userData = {
        selectedBatch: selectedBatch,
        selectedRollNo: selectedRollNo,
        selectedLab: selectedLab
      };
    sessionStorage.setItem('userData', JSON.stringify(userData));

    useEffect(() => {
        if (selectedBatch) {
            fetch(`http://127.0.0.1:8000/api/lab?batch=${selectedBatch}`, {
                method: 'GET',
            })
            .then(res => res.json())
            .then(data => {
                const labOptions = Object.entries(data).map(([labId, labName]) => ({
                    id: labId,
                    name: labName
                }));
                setLabOptions(labOptions);
            })
            .catch(error => console.log(error));
        }
    }, [selectedBatch]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/batches')
            .then(response => response.json())
            .then(data => setBatchOptions(data))
            .catch(error => console.error('Error fetching batch options:', error));
    }, []);
  return (
    <>
    {responseRecieved && <Navigate to="/student/dashboard" replace={true} />}
    <div className="container">
        <div className='formDetails'>
            <form>
                <img src={profilepic} alt="" className='profile' />
                <h1>LOGIN</h1>
                <div className="form-group">
                    <label htmlFor="batch">Class:</label>
                    <select
                        value={selectedBatch}
                        name="batch"
                        required
                        onChange={e => setSelectedBatch(e.target.value)}
                    >
                        <option value="">Select Batch</option>
                        {batchOptions.map(batch => (
                            <option key={batch} value={batch}>
                                {batch}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="roll_no">Roll No:</label>
                    <input 
                        type="number"
                        required 
                        value={selectedRollNo}
                        onChange={e => setSelectedRollNo(e.target.value)}
                        name="roll_no"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lab">Lab:</label>
                    <select
                        value={selectedLab}
                        name="lab"
                        required
                        onChange={e => setSelectedLab(e.target.value)}
                    >
                        <option value="">Select Lab</option>
                        {labOptions.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={handleSubmit} className='login'>Login</button>
                <br />
            <Link to="/student/signup" className='Signup'>Not Registered? <span>Signup</span></Link>
            </form>
            {/* <h3>{response}</h3> */}
        <img src={loginImage} alt="loginimage" className="login-image" />
        </div>
    </div>
    
   </>

  )
}

export default GetForm