import React from 'react'

const Dashboard = () => {
    const data = JSON.parse(sessionStorage.getItem('exp_data'));

    console.log(data)

    return (
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
                <td>{exp.name.uploaded ? <a href={"http://127.0.0.1:8000/" + exp.name.url}>Uploaded</a> : 'Not Uploaded'}</td>
                <td>{exp.name.printed ? 'Printed' : 'Not Printed'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
}

export default Dashboard