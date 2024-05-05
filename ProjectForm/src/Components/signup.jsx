import React, { useEffect } from 'react'
import { useState } from 'react'
import { Navigate } from "react-router-dom";
import '../assets/signup.css'
import SignupImage from '../assets/cube.jpg'
import profilepic from '../assets/profilepic.svg'
import { Link } from 'react-router-dom'
const GetForm = () => {
    const [selectedName,setSelectedName] = useState('');
    const [selectedBatch,setSelectedBatch] = useState('');
    const [selectedRollNo,setSelectedRollNo] = useState('');
    const [batchOptions, setBatchOptions] = useState([]);
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
    useEffect(() => {
      fetch('http://127.0.0.1:8000/api/batches')
          .then(response => response.json())
          .then(data => setBatchOptions(data))
          .catch(error => console.error('Error fetching batch options:', error));
  }, []);
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
    <div className="container">
      <div className='formDetials'>
          <form >
          <img src={profilepic} alt="" className='profile' />
              <h1>Signup</h1>
              <div className="form-group">
                <label>Name:</label>
                  <input 
                  type="text"
                  required 
                  value={selectedName}
                  onChange={handleNameChange}
                  name = "name"
                  />
              </div>
              
              <div className="form-group">
                <label>Class:</label>
                <select
                        value={selectedBatch}
                        name="batch"
                        required
                        onChange={handleClassChange}
                    >
                        <option value="">Select Batch</option>
                        {batchOptions.map(batch => (
                            <option key={batch} value={batch}>
                                {batch}
                            </option>
                        ))}
                    </select>
                {/* <input 
                type="text"
                required 
                value={selectedBatch}
                onChange={handleClassChange}
                name = "batch"
                /> */}
              </div>
              <div className="form-group">
              <label>Roll No:</label>
                <input 
                type="number"
                required 
                value={selectedRollNo}
                onChange={handleRollNoChange}
                name = "roll_no"
                />
              </div>
              
              <button onClick={handleSubmit} className = "signup">Sign Up</button>
              <br />
              <Link to="/student/login" className='Signup'> Registered? <span>Login</span></Link>
          </form>
        <img src={SignupImage} alt="SignupImage" className="signup-image" />
          
      </div>
    </div>
    
    </>

  )
}

export default GetForm