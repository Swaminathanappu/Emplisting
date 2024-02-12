import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const EmpEdit = () => {
  const { empid } = useParams();

  useEffect(() => {
    fetch("http://localhost:8000/employee/" + empid)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        // idchange(resp.id);
        namechange(resp.name);
        agechange(resp.age);
        actionchange(resp.action);
        setLogin(resp.login);
        setLogintime(resp.logintime);
        setLogout(resp.logout);
        setStatus(resp.status);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  const [id, idchange] = useState("");
  const [name, namechange] = useState("");
  const [age, agechange] = useState("");
  const [login, setLogin] = useState("");
  const [logintime, setLogintime] = useState("");
  const [logout, setLogout] = useState("");
  const [status, setStatus] = useState("");
  const [action, actionchange] = useState(true);
  const navigate = useNavigate();
  const handlesumbit = (e) => {
    e.preventDefault();
    const empdata = { name, age, action, login, logintime, logout, status };
    console.log({ id, name, age, action, login, logintime, logout, status });

    fetch("http://localhost:8000/employee/" + empid, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(empdata),
    })
      .then((res) => {
        alert("saved sucessfully.");
        navigate("/");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div>
      <form className="container" onSubmit={handlesumbit}>
        <div className="" style={{ textAlign: "left" }}>
          <div className="col-lg-12">
            <div className="from-group">
              <label htmlFor="">ID</label>
              <input
                value={id}
                disabled="disabled"
                onChange={(e) => idchange(e.target.value)}
                className="form-control"
              ></input>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="from-group">
              <label htmlFor="">Name</label>
              <input
                required
                value={name}
                onChange={(e) => namechange(e.target.value)}
                className="form-control"
              ></input>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="from-group">
              <label htmlFor="">Age</label>
              <input
                value={age}
                onChange={(e) => agechange(e.target.value)}
                className="form-control"
              ></input>
            </div>
          </div>
          <br />
          <div className="col-lg-12">
            <div className="form-group">
              <button className="btn btn-success" type="sumbit">
                save
              </button>{" "}
              <b></b>
              <Link to="/" className="btn btn-danger">
                Back
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default EmpEdit;
