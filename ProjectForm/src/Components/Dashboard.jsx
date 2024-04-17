import React from 'react'
import  { useState, useEffect } from 'react';
import '../assets/dashboard.css'
const Dashboard = () => {

    const [selectedFile,setSelectedFile] = useState('');
    const [selectedExp,setSelectedExp] = useState('');
    const [response,setResponse] = useState('');
    const [responseRecieved, setResponseRecieved] = useState(false);
    const [data,setdata] = useState([]);
    const userData = sessionStorage.getItem('userData')
    const parsedData = JSON.parse(userData);
    const selectedBatch = parsedData.selectedBatch;
    const selectedRollNo = parsedData.selectedRollNo;
    const selectedLab = parsedData.selectedLab;
    useEffect(()=>{
        // Parse JSON string to JavaScript object

            // console.log("Use effect has been initiated the values of the selectedBatch, selectedRollNo and selectedLab are ",selectedBatch,selectedRollNo,selectedLab)
            fetch(`http://127.0.0.1:8000/api/exp?batch=${selectedBatch}&roll_no=${selectedRollNo}&lab_id=${selectedLab}`, {
                method: 'GET',
            })
            .then(res => res.json())
            .then(data => {
                const expOptions = Object.entries(data).map(([expId, expName]) => ({
                    id: expId,
                    name: expName
                }));
                setdata(expOptions);
            })
            
            .then(() => 
            setResponseRecieved(true)
            )
            .catch(error => console.log(error))
        
    },[])
    function handleSubmit(e){
        // e.preventDefault();
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
        .then(console.log(response))
        .catch(error => console.log(error))
        console.log(response)
        // window.location.reload()

    }
    
    function handleUpload(e){
        setSelectedFile(e.target.files[0])
    }

    return (
        <>
        <div>
            <h1>Student Dashboard</h1>
            <table>
            <thead>
                <tr>
                <th>Experiment Name</th>
                <th>Uploaded</th>
                <th>Printed</th>
                </tr>
            </thead>
            <tbody>
                {data.map(exp => (
                <tr key={exp.id}>
                    <td>{exp.name.exp_name}</td>

                    <td>{exp.name.uploaded ? <a href={"http://127.0.0.1:8000/" + exp.name.url}>Uploaded</a> : 
                    <form >
                        <input type="file" onChange={(e)=>{setSelectedExp(exp.id);handleUpload(e)}} />
                        <button type="submit" onClick={handleSubmit}>Upload</button>
                    </form>}
                    </td>

                    <td>{exp.name.printed ? 'Printed' : 'Not Printed'}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
    </>
        
    )
}

export default Dashboard