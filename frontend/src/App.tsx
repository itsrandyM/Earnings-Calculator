import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthForm from "./Forms/authenticate";
import AdminDashboard from "./dashboard/dash";
import Companies from "./company/company";
import IncomeEntry from "./Forms/income-entry";
import AdminLogin from "./admin/login";

function App() {
  return (
    <Router>
        <Routes>
            <Route path='/' element={<AuthForm/>}></Route>
            <Route path='/admin-login' element={<AdminLogin/>}></Route>
            <Route path='/admin-dashboard' element={<AdminDashboard/>}></Route>
            <Route path='/companies' element={<Companies/>}></Route>
            <Route path="/income-entry" element={<IncomeEntry />} />
        </Routes>
    </Router>
  );
}

export default App;
