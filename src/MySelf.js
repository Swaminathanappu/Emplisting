import React, { useState, useEffect } from 'react';
import moment from 'moment';

const EmployeeDetails = () => {
  const [employeeData, setEmployeeData] = useState({
    logInDate: '2/1/2024',
    logDetails: [],
  });



  const [logInTime, setLogInTime] = useState('');



  const [logOutTime, setLogOutTime] = useState('');
  const [logInOutDifference, setLogInOutDifference] = useState('');

  const setCurrentTime = (inputId) => {
    const currentTime = moment().format('hh:mm A');
    if (inputId === 'logInTimeInput') {
      setLogInTime(currentTime);
    } else if (inputId === 'logOutTimeInput' && !logOutTime) {
      console.log(currentTime);
      setLogOutTime(currentTime);
      const logInTimeMoment = moment(logInTime, 'hh:mm A');
      const logOutTimeMoment = moment(currentTime, 'hh:mm A');

      if (logInTimeMoment.isValid() && logOutTimeMoment.isValid()) {
        setEmployeeData((prevData) => ({
          ...prevData,
          logDetails: [
            ...prevData.logDetails,
            { logInTime: logInTime, logOutTime: currentTime },
          ],
        }));
        setLogInTime('');
        setLogOutTime('');
      } else {
        alert('Invalid log in or log out time. Please enter a valid time.');
      }
    }
  };




console.log(logOutTime);
  const addLogEntry = () => {
    // debugger
    if (logInTime && logOutTime) {
      // debugger
      const logInTimeMoment = moment(logInTime, 'hh:mm A');
      const logOutTimeMoment = moment(logOutTime, 'hh:mm A');

      if (logInTimeMoment.isValid() && logOutTimeMoment.isValid()) {
        setEmployeeData((prevData) => ({
          ...prevData,
          logDetails: [
            ...prevData.logDetails,
            { logInTime: logInTime, logOutTime: logOutTime },
          ],
        }));
        setLogInTime('');
        setLogOutTime('');
      } else {
        alert('Invalid log in or log out time. Please enter a valid time.');
      }
    } else {
      alert('Please enter both log in and log out times.');
    }
  };




  const calculateTotalDuration = () => {
    let totalSeconds = 0;

    for (let i = 0; i < employeeData.logDetails.length; i++) {
      const logInTime = moment(
        employeeData.logDetails[i]?.logInTime,
        'hh:mm A'
      );
      const logOutTime = moment(
        employeeData.logDetails[i]?.logOutTime,
        'hh:mm A'
      );

      if (logInTime.isValid() && logOutTime.isValid()) {
        const duration = moment.duration(logOutTime.diff(logInTime));
        totalSeconds += duration.asSeconds();
      }
    }

    const totalDurationMoment = moment.duration(totalSeconds, 'seconds');
    return formatDuration(totalDurationMoment);
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes()) % 60;
    return `${hours} hours, ${minutes} minutes`;
  };

  useEffect(() => {
    const totalDuration = calculateTotalDuration();
    setLogInOutDifference(
      `${totalDuration}`
    );
  }, [employeeData.logDetails,logOutTime]);




  return (
    <div id="employeeDetails">
      <h3>Employee Details</h3>
      <table className='table table-striped'>
        <tr>
          <th>Buttons</th>
          <th>Login in Time</th>
          <th>Log out time</th>
          <th>Total differerenc</th>
        </tr>

        <tr>
          <td>
        
          <button onClick={() => setCurrentTime('logInTimeInput')}>logintime</button>
        <button onClick={() => setCurrentTime('logOutTimeInput')}>logouttime</button>

          </td>
          <td>
          <label htmlFor="logInTimeInput"></label>
      <input
        type="text"
        id="logInTimeInput"
        value={logInTime}
        
        placeholder="Click to set log in time"
      />

          </td>
      
      <td>
      <label htmlFor="logOutTimeInput"></label>
      <input
        type="text"
        id="logOutTimeInput"
        value={logOutTime}
       
        // onBlur={addLogEntry} // This will be called when the user clicks outside the input
        placeholder="Click to set log out time"
      />
</td>
   <td><p id="logInOutDifference">{logInOutDifference}</p></td>  
      </tr>
        <tbody>

          {employeeData.logDetails.map((entry, index) => (
            <tr key={index}>
              <td>
                {moment(entry.logInTime, 'hh:mm A').format('hh:mm A')}
              </td>
              <td>
                {moment(entry.logOutTime, 'hh:mm A').format('hh:mm A')}
              </td>
            </tr>
          ))}

        </tbody>
      </table>
     
     
      
    </div>
  );
};

export default EmployeeDetails;
