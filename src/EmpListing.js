import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmpPiechart from "./EmpPiechart";
import moment from "moment";

const baseURL = "http://localhost:8000/employee";

const EmpListing = () => {
  const [empdata, setempdatachange] = useState([]);
  const [totalWorkingPersons, setTotalWorkingPersons] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [freezeButtons, setFreezeButtons] = useState({});
  const [loginTimestamps, setLoginTimestamps] = useState({});
  const [logoutTimestamps, setLogoutTimestamps] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString()
  );

  const [logOutTime, setLogOutTime] = useState("");
  const [logInOutDifference, setLogInOutDifference] = useState("");
  const [logInTime, setLogInTime] = useState("");
  const [employeeTotalWorkingHours, setEmployeeTotalWorkingHours] = useState(
    {}
  );

  const navigate = useNavigate();

  const LoadEdit = (id) => {
    navigate(`/Edit/${id}`);
  };

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("empdata"));
    setempdatachange(savedData);
    const workingPersons = savedData.filter((item) => item.status === "Out");
    setTotalWorkingPersons(workingPersons.length);
    setTotalEmployees(savedData.length);
    fetchEmployees();
  }, []);

  const handleLogIn = (id) => {
    updateTimestamp("Login", id);

    if (!freezeButtons[id]) {
      const updatedEmpData = [...empdata];
      const index = updatedEmpData.findIndex((item) => item.id === id);

      if (index !== -1) {
        updatedEmpData[index].logInTime = new Date().toLocaleTimeString();
        updatedEmpData[index].logInDate = new Date().toLocaleDateString();
        updatedEmpData[index].status = "Out";
        // updatedEmpData[index].logOutTime = null;

        const currentTime = moment().format("hh:mm A");
        if (id === "logInTimeInput") {
          setLogInTime(currentTime);
        } else if (id === "logOutTimeInput" && !logOutTime) {
          console.log(currentTime);
          setLogOutTime(currentTime);
          const logInTimeMoment = moment(logInTime, "hh:mm A");
          const logOutTimeMoment = moment(currentTime, "hh:mm A");

          if (logInTimeMoment.isValid() && logOutTimeMoment.isValid()) {
            setempdatachange((prevData) => ({
              ...prevData,
              logDetails: [
                ...prevData.logDetails,
                { logInTime: logInTime, logOutTime: currentTime },
              ],
            }));
            setLogInTime("");
            setLogOutTime("");
          } else {
            alert("Invalid log in or log out time. Please enter a valid time.");
          }
        }
        const updatedEmployee = {
          id: updatedEmpData[index].id,
          name: updatedEmpData[index].name,
          age: updatedEmpData[index].age,
          action: true,
          status: updatedEmpData[index].status,
          logInDate: updatedEmpData[index].logInDate,
          arrem: [
            ...updatedEmpData[index].arrem,
            {
              logInDate: updatedEmpData[index].logInDate,
              logDetails: [
                {
                  logInTime: new Date().toLocaleTimeString(),
                },
              ],
            },
          ],
        };

        updateServer(updatedEmployee);

        setempdatachange(updatedEmpData);

        const workingPersons = updatedEmpData.filter(
          (item) => item.status === "Out"
        );
        setTotalWorkingPersons(workingPersons.length);

        setFreezeButtons((prevButtons) => ({ ...prevButtons, [id]: true }));

        const d = new Date();
        let currentSeconds = d.getSeconds();
        let millisecondsUntilNextMinute = (60 - currentSeconds) * 1000;
        setTimeout(() => {
          setFreezeButtons((prevButtons) => ({ ...prevButtons, [id]: false }));
        }, millisecondsUntilNextMinute);
      }
    }
  };

  const handleLogOut = (id) => {
    updateTimestamp("Logout", id);

    if (!freezeButtons[id]) {
      const updatedEmpData = [...empdata];
      const index = updatedEmpData.findIndex((item) => item.id === id);

      if (index !== -1) {
        updatedEmpData[index].logOutTime = new Date().toLocaleTimeString();
        updatedEmpData[index].status = "In";
        updatedEmpData[index].logInTime = null;

        const currentTime = moment().format("hh:mm A");
        if (id === "logInTimeInput") {
          setLogInTime(currentTime);
        } else if (id === "logOutTimeInput" && !logOutTime) {
          console.log(currentTime);
          setLogOutTime(currentTime);
          const logInTimeMoment = moment(logInTime, "hh:mm A");
          const logOutTimeMoment = moment(currentTime, "hh:mm A");

          if (logInTimeMoment.isValid() && logOutTimeMoment.isValid()) {
            setempdatachange((prevData) => ({
              ...prevData,
              logDetails: [
                ...prevData.logDetails,
                { logInTime: logInTime, logOutTime: currentTime },
              ],
            }));
            setLogInTime("");
            setLogOutTime("");
          } else {
            alert("Invalid log in or log out time. Please enter a valid time.");
          }
        }

        const updatedEmployee = {
          id: updatedEmpData[index].id,
          name: updatedEmpData[index].name,
          age: updatedEmpData[index].age,
          action: true,
          status: updatedEmpData[index].status,
          logInDate: updatedEmpData[index].logInDate,
          arrem: [
            ...updatedEmpData[index].arrem,
            {
              logInDate: updatedEmpData[index].logInDate,
              logDetails: [
                {
                  logOutTime: new Date().toLocaleTimeString(),
                },
              ],
            },
          ],
        };

        updateServer(updatedEmployee);

        setempdatachange(updatedEmpData);

        const workingPersons = updatedEmpData.filter(
          (item) => item.status === "Out"
        );
        setTotalWorkingPersons(workingPersons.length);

        setFreezeButtons((prevButtons) => ({ ...prevButtons, [id]: true }));

        const d = new Date();
        let currentSeconds = d.getSeconds();
        let millisecondsUntilNextMinute = (60 - currentSeconds) * 1000;
        setTimeout(() => {
          setFreezeButtons((prevButtons) => ({ ...prevButtons, [id]: false }));
        }, millisecondsUntilNextMinute);
      }
    }
  };

  const updateServer = (updatedData) => {
    const url = `${baseURL}/${updatedData.id}`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((resp) => {
        console.log(resp);
        localStorage.setItem("empdata", JSON.stringify(empdata));
        fetchEmployees();
      })
      .catch((err) => {
        console.log("Error updating server:", err.message);
      });
  };

  const Delete = (id) => {
    if (window.confirm("Do you want to delete?")) {
      const url = `${baseURL}/${id}`;

      fetch(url, {
        method: "DELETE",
      })
        .then((res) => {
          alert("Removed successfully.");
          fetchEmployees();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const updateStatusAtEndOfDay = () => {
    const currentHour = new Date().getHours();

    if (currentHour === 0) {
      const updatedEmpData = empdata.map((item) => ({
        ...item,
        status: "In",
        logInTime: "",
        logInDate: "",
        logOutTime: "",
      }));

      updatedEmpData.forEach(updateServer);

      setempdatachange(updatedEmpData);

      const workingPersons = updatedEmpData.filter(
        (item) => item.status === "Out"
      );
      setTotalWorkingPersons(workingPersons.length);
    }
  };

  const updateTimestamp = (action, id) => {
    const d = new Date();
    const timestamp = d.toLocaleTimeString();

    if (action === "Login") {
      setLoginTimestamps((prevTimestamps) => ({
        ...prevTimestamps,
        [id]: (prevTimestamps[id] || "") + `${timestamp}<br>`,
      }));
    } else if (action === "Logout") {
      setLogoutTimestamps((prevTimestamps) => ({
        ...prevTimestamps,
        [id]: (prevTimestamps[id] || "") + `${timestamp}<br>`,
      }));
    }
  };
  const fetchEmployees = () => {
    fetch(baseURL)
      .then((res) => res.json())
      .then((resp) => {
        console.log(resp);
        setempdatachange(resp);

        const workingPersons = resp.filter((item) => item.status === "Out");
        setTotalWorkingPersons(workingPersons.length);
        setTotalEmployees(resp.length);
        localStorage.setItem("empdata", JSON.stringify(resp));
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const currentDate = new Date().toLocaleDateString();
  useEffect(() => {
    const intervalId = setInterval(updateStatusAtEndOfDay, 1000 * 60 * 60);

    return () => clearInterval(intervalId);
  }, []);
  // const calculateTotalDuration = () => {
  //   let totalSeconds = 0;

  //   for (let i = 0; i < (empdata.logDetails || []).length; i++) {
  //     const logInTime = moment(
  //       empdata.logDetails[i]?.logInTime,
  //       'hh:mm A'
  //     );
  //     const logOutTime = moment(
  //       empdata.logDetails[i]?.logOutTime,
  //       'hh:mm A'
  //     );

  //     if (logInTime.isValid() && logOutTime.isValid()) {
  //       const duration = moment.duration(logOutTime.diff(logInTime));
  //       totalSeconds += duration.asSeconds();
  //     }
  //   }

  //   const totalDurationMoment = moment.duration(totalSeconds, 'seconds');
  //   return formatDuration(totalDurationMoment);
  // };

  const calculateTotalDuration = (employeeId) => {
    let totalSeconds = 0;

    for (let i = 0; i < (empdata.logDetails || []).length; i++) {
      const logInTime = moment(empdata.logDetails[i]?.logInTime, "hh:mm A");
      const logOutTime = moment(empdata.logDetails[i]?.logOutTime, "hh:mm A");

      if (
        empdata.logDetails[i]?.employeeId === employeeId &&
        logInTime.isValid() &&
        logOutTime.isValid()
      ) {
        const duration = moment.duration(logOutTime.diff(logInTime));
        totalSeconds += duration.asSeconds();
      }
    }

    const totalDurationMoment = moment.duration(totalSeconds, "seconds");
    return formatDuration(totalDurationMoment);
  };

  const formatDuration = (duration) => {
    // console.log(formatDuration());
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes()) % 60;
    return `${hours} hours, ${minutes} minutes`;
  };

  // useEffect(() => {
  //   const totalDuration = calculateTotalDuration();
  //   setLogInOutDifference(
  //     `${totalDuration}`
  //   );
  // }, [empdata.logDetails,logOutTime]);

  useEffect(() => {
    const employeeTotalHours = {};

    empdata.forEach((employee) => {
      const totalDuration = calculateTotalDuration(employee.id);
      employeeTotalHours[employee.id] = totalDuration;
    });

    setEmployeeTotalWorkingHours(employeeTotalHours);
  }, [empdata.logDetails]);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-title">
          {" "}
          <br />
          <h2>Employee List</h2>
          <button class="btn btn-secondary">
            <input type="date" />
          </button>
        </div>
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th className="w-5">ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Attendance</th>
              <th>Log In Time</th>
              <th>Log Out Time</th>
              <th>Total working hours</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {empdata &&
              empdata.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>
                    <div>
                      {item.status === "Out" ? (
                        <button
                          type="button"
                          onClick={() => handleLogOut(item.id)}
                          className={`btn btn-danger btn-sm${
                            freezeButtons[item.id] ? " disabled" : ""
                          }`}
                        >
                          Logout
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleLogIn(item.id)}
                          className={`btn btn-success btn-sm${
                            freezeButtons[item.id] ? " disabled" : ""
                          }`}
                        >
                          Login
                        </button>
                      )}
                    </div>
                  </td>
                  <td>
                    {item?.arrem
                      ?.filter((a) => a.logInDate === currentDate)
                      .map((a, entry) => (
                        <div key={a.logInDate}>
                          {Array.isArray(a?.logDetails) &&
                            a.logDetails.map((logDetail) => (
                              <div key={logDetail.logInTime}>
                                {logDetail?.logInTime && (
                                  <>
                                    <div>
                                      {logDetail.logInTime}
                                      {/* {moment(entry.logInTime, 'hh:mm A').format('hh:mm A')} */}
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                        </div>
                      ))}
                  </td>

                  <td>
                    {item?.arrem
                      ?.filter((a) => a.logInDate === currentDate)
                      .map((a, entry) => (
                        <div key={a.logInDate}>
                          {Array.isArray(a?.logDetails) &&
                            a.logDetails.map((logDetail) => (
                              <div key={logDetail.logOutTime}>
                                {logDetail?.logOutTime && (
                                  <>
                                    <div>
                                      {logDetail?.logOutTime}
                                      {/* {moment(entry.logOutTime, 'hh:mm A').format('hh:mm A')} */}
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                        </div>
                      ))}
                  </td>

                  {/* <td id="logInOutDifference">{logInOutDifference}</td> */}

                  <td>
                    {employeeTotalWorkingHours[item.id] || "0 hours, 0 minutes"}
                  </td>

                  <td>{item.logInDate || ""}</td>
                  <td>{item.status || ""}</td>
                  <td>
                    <a
                      onClick={() => LoadEdit(item.id)}
                      className="btn btn-primary btn-sm"
                    >
                      Edit
                    </a>{" "}
                    <a
                      onClick={() => Delete(item.id)}
                      className="btn btn-warning btn-sm"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
          <tbody>
            {empdata &&
              Array.isArray(empdata.logDetails) &&
              empdata.logDetails.map((i, index) => (
                <tr key={index.id}>
                  <td>{moment(i.logInTime, "hh:mm A").format("hh:mm A")}</td>
                  <td>{moment(i.logOutTime, "hh:mm A").format("hh:mm A")}</td>
                </tr>
              ))}
          </tbody>

          <tfoot>
            <td colSpan="9">
              <h5 style={{ textAlign: "left" }}>
                Total no of Emp: {totalEmployees}{" "}
              </h5>
              <h5 className="mt-3" style={{ textAlign: "left" }}>
                Total no of LogIn Emp: <b>{totalWorkingPersons}</b>
              </h5>
            </td>
          </tfoot>
        </table>
        <div className="divbtn">
          <Link to="/create" className="btn btn-info">
            Create
          </Link>
        </div>{" "}
        <br />
      </div>
      <EmpPiechart></EmpPiechart>
    </div>
  );
};
export default EmpListing;
