import React from 'react'
import { useState } from 'react'
const GetForm = () => {
    const [selectedBatch,setSelectedBatch] = useState('');
    const [selectedRollNo,setSelectedRollNo] = useState('');
    const [selectedLab,setSelectedLab] = useState('');
    const [selectedExp,setSelectedExp] = useState('');
    const [selectedFile,setSelectedFile] = useState('');
    const[response,setResponse] = useState('');
    function handleSubmit(e){
      e.preventDefault();
      const formData = new FormData();
      formData.append('batch', selectedBatch);
      formData.append('roll_no', selectedRollNo);
      formData.append('lab_id', selectedLab);
      formData.append('exp_id', selectedExp);
      formData.append('file',selectedFile);
      fetch('http://127.0.0.1:8000/api/file',{
        method: 'POST',
        body : formData
      }).then(res => setResponse(res.statusText))
      .catch(error => console.log(error))
    }
    function handleClassChange(e){
        setSelectedBatch(e.target.value)
    }
    function handleRollNoChange(e){
        setSelectedRollNo(e.target.value)
    }
    function handleLabChange(e){
        setSelectedLab(e.target.value)
    }
    function handleExpChange(e){
        setSelectedExp(e.target.value)
    }
    function handleFileChange(e){
        setSelectedFile(e.target.files[0])
    }
  return (
    <div className='formDetials' >
      
        <form  style={{ display: 'flex', flexDirection: 'column' }} >

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

            <label>Lab id</label>
            <input 
            type="text"
            required 
            value={selectedLab}
            onChange={handleLabChange}
            name="lab_id"
            />


            <label>Exp id</label>
            <input 
            type="text"
            required 
            value={selectedExp}
            onChange={handleExpChange}
            name="exp_id"
            />

            <label>File</label>
            <input 
            type="file"
            required 
            onChange={handleFileChange}
            name="file"
            />

            <button onClick={handleSubmit}>Submit</button>
        </form>
        <h3>{response}</h3>
    </div>
  )
}

export default GetForm