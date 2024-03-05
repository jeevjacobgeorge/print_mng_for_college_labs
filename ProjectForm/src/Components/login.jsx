import React, { useEffect } from 'react'
import { useState } from 'react'

const GetForm = () => {
    const [selectedBatch,setSelectedBatch] = useState('');
    const [selectedRollNo,setSelectedRollNo] = useState('');
    const [selectedLab,setSelectedLab] = useState('');
    const [response,setResponse] = useState('');
    const [labOptions, setLabOptions] = useState([]);
    const [batchOptions, setBatchOptions] = useState([]);
    function handleSubmit(e){
      e.preventDefault();
      const formData = new FormData();
      formData.append('batch', selectedBatch);
      formData.append('roll_no', selectedRollNo);
      formData.append('lab_id', selectedLab);
      fetch('http://127.0.0.1:8000/api/',{
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

    function handleRollNoChange(e){
        setSelectedRollNo(e.target.value)
    }
    function handleLabChange(e){
        setSelectedLab(e.target.value)
    }
   
  return (
    <>
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
            onChange={handleRollNoChange}
            name = "roll_no"
            />
            <br></br><br></br>
            <label>Lab:</label>
            <div>
                {labOptions.map(option => (
                    <label key={option.id}>
                        <input type="radio" value={option.id} />
                        {option.name}
                    </label>
                ))}
            </div>
            <br></br><br></br>
            <button onClick={handleSubmit}>Log in</button>
        </form>
        <h3>{response}</h3>
        
    </div>
    </>

  )
}

export default GetForm