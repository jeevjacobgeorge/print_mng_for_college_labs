import React, { useState, useEffect } from 'react';
import '../assets/dashboard.css';
import { Link } from 'react-router-dom';
import profilepic from '../assets/profilepic.svg';
import { FileUploader } from "./FileUploader.jsx";
import backgroundImage from '../assets/printer.jpg';
const Dashboard = () => {
    const [selectedFile, setSelectedFile] = useState('');
    const [selectedExp, setSelectedExp] = useState('');
    const [response, setResponse] = useState('');
    const [responseRecieved, setResponseRecieved] = useState(false);
    const [data, setdata] = useState([]);
    const [dragging, setDragging] = useState(false); // State to track dragging state
    const [isDroppingFiles, setIsDroppingFiles] = useState(false); // State to track file dropping
    const userData = sessionStorage.getItem('userData');
    const parsedData = JSON.parse(userData);
    const selectedBatch = parsedData.selectedBatch;
    const selectedRollNo = parsedData.selectedRollNo;
    const selectedLab = parsedData.selectedLab;
    const [selectedExpName, setSelectedExpName] = useState(''); // State to store selectedExpName 
    const [filebool,setfilebool] = useState(false);
    
    useEffect(() => {
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
        .then(() => setResponseRecieved(true))
        .catch(error => console.log(error));
    }, []);


    function handleSubmit() {
        const formData = new FormData();
        formData.append('batch', selectedBatch);
        formData.append('roll_no', selectedRollNo);
        formData.append('lab_id', selectedLab);
        formData.append('exp_id', selectedExp);
        formData.append('file', selectedFile);
        // console.log(selectedFile)
        // console.log(selectedExp)
        fetch('http://127.0.0.1:8000/api/file', {
            method: 'POST',
            body: formData
        })
        .then(res => setResponse(res.statusText)).then(window.location.reload())
        .catch(error => console.log(error));
        
    }

    function DragDrop({ exp }) {
        const [fileName, setFileName] = useState("");
        const handleFile =   (file) => {
            setSelectedFile(file);
            setFileName(file.name);
            setSelectedExp(exp.id);
            setSelectedExpName(exp.name.exp_name);
            setfilebool(true);
        };
      return (
          <div className="file-uploader">
               <FileUploader handleFile={handleFile}  />
              
              
          </div>
      );
  }

    return (
        <>
        {filebool &&
         <div className='confirm'>
            <h2>Are you sure you want to upload {selectedFile.name} as {selectedExpName}?</h2>
            <button className='yes' onClick={handleSubmit}>Yes</button>
            <button className='no' onClick={() => setfilebool(false)}>No</button>    
        </div>}
            <div className='dash-whole' style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className="container-dashboard"  >
                    <div className="nav">
                        <h1 className='headertext'>Dash<span>board</span></h1>
                        <div className='logout'>
                            <Link to="/student/login">Logout</Link>
                        </div>
                    </div>
                    
                    <table>
                        <thead className='table_head'>
                            <tr>
                                <th className='head'>Experiment</th>
                                <th className='head'>Upload status</th>
                                <th className='head'>Print Status</th>
                            </tr>
                        </thead>
                        <tbody className='table_body'>
                            {data.map(exp => (
                                <tr key={exp.id}>
                                    <td>{exp.name.exp_name}</td>
                                    <td>
                                        {exp.name.uploaded ? (
                                            <a href={"http://127.0.0.1:8000/" + exp.name.url}>Uploaded</a>
                                        ) : (
                                            <div>
                                                <DragDrop exp={exp} />
                                                
                                            </div>
                                        )}
                                    </td>
                                    <td>{exp.name.printed ? 'Printed' : 'Not Printed'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
