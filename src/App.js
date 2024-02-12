import './App.css';
import {BrowserRouter, Route , Routes, useNavigate} from 'react-router-dom';
import EmpListing from './EmpListing';
import EmpDetail from './EmpDetail';
import EmpCreate from './EmpCreate';
import EmpEdit from './EmpEdit';
import EmpPiechart from './EmpPiechart';
import EmployeeDetails from './MySelf.js';


function App() {
  return (
    <div className="App">
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<EmpListing/>}></Route>
    <Route path='/create' element={<EmpCreate/>}></Route>
    <Route path='/Detail/:empid' element={<EmpDetail/>}></Route>
    <Route path='/Edit/:empid' element={<EmpEdit/>}></Route>
    <Route path="/Chart" element={<EmpPiechart />}></Route>
    <Route path='/' element={<EmployeeDetails/>}></Route>
  </Routes>
  </BrowserRouter>
    </div>
  );

}

export default App;
