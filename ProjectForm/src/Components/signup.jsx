import React, { useEffect } from 'react'
import { useState } from 'react'
import { Navigate } from "react-router-dom";
const GetForm = () => {
    const [selectedName,setSelectedName] = useState('');
    const [selectedBatch,setSelectedBatch] = useState('');
    const [selectedRollNo,setSelectedRollNo] = useState('');
    const[response,setResponse] = useState('');
    const[isSubmitted,setIsSubmitted] = useState(false);
    function handleSubmit(e){
      e.preventDefault();
      const formData = new FormData();
      formData.append('name', selectedName);
      formData.append('batch', selectedBatch);
      formData.append('roll_no', selectedRollNo);
      fetch('http://127.0.0.1:8000/api/signup',{
        method: 'POST',
        body : formData
      }).then(res => setResponse(res.statusText))
      .catch(error => console.log(error))
    }
    useEffect(()=>{
        if (response === 'Created'){
            setIsSubmitted(true)
        }
    },[response])

    
    function handleNameChange(e){
        setSelectedName(e.target.value)
    }
    function handleClassChange(e){
        setSelectedBatch(e.target.value)
    }
    function handleRollNoChange(e){
        setSelectedRollNo(e.target.value)
    }
   
  return (
    <>
    {isSubmitted && <Navigate to="/student/login" replace={true} />}
    <div className='formDetials'>
        <form  style={{ display: 'flex', flexDirection: 'column' }} >
            <label>Name:</label>
            <input 
            type="text"
            required 
            value={selectedName}
            onChange={handleNameChange}
            name = "name"
            />

            <label>Class:</label>
            <input 
            type="text"
            required 
            value={selectedBatch}
            onChange={handleClassChange}
            name = "batch"
            />
            <label>Roll No:</label>
            <input 
            type="number"
            required 
            value={selectedRollNo}
            onChange={handleRollNoChange}
            name = "roll_no"
            />
            <button onClick={handleSubmit}>Submit</button>
        </form>
        <h3>{response}</h3>
        
    </div>
    </>

  )
}

export default GetForm