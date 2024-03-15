import React, { useEffect } from 'react'
import { useState } from 'react'
import { Navigate } from "react-router-dom";
import { Link } from 'react-router-dom'
const GetForm = () => {
    const [selectedBatch,setSelectedBatch] = useState('');
    const [selectedRollNo,setSelectedRollNo] = useState('');
    const [selectedLab,setSelectedLab] = useState('');
    const [response,setResponse] = useState('');
    const [labOptions, setLabOptions] = useState([]);
    const [batchOptions, setBatchOptions] = useState([]);
    const [responseRecieved, setResponseRecieved] = useState(false);
    function handleSubmit(e) {
        setResponseRecieved(true)
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
    <div className='formDetials'>
        <form  style={{ display: 'flex', flexDirection: 'column' }} >
        <label>Class:</label>
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
            <br></br><br></br>
            <label>Roll No:</label>
            <input 
            type="number"
            required 
            value={selectedRollNo}
            onChange={e => setSelectedRollNo(e.target.value)}
            name = "roll_no"
            />
            <br></br><br></br>
            <label>Lab:</label>
            <div>
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
            <br></br><br></br>
            <button onClick={handleSubmit}>Log in</button>
        </form>
        <h3>{response}</h3>
        <Link to="/student/signup" > Signup</Link>
    </div>
    </>

  )
}

export default GetForm