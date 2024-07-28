import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthForm from "./Forms/authenticate";
import AdminDashboard from "./dashboard/dash";
// import Companies from "./company/company";
import IncomeEntry from "./Forms/income-entry";
import UserDashboard from "./dashboard/dashboard";
import AdminLogin from "./admin/login";
import { AxiosInterceptor } from "./apiClient";

function App() {
  return (
    <Router>
      <AxiosInterceptor>
        <Routes>
            <Route path='/' element={<AuthForm/>}></Route>
            <Route path='/admin-login' element={<AdminLogin/>}></Route>
            <Route path='/admin-dashboard' element={<AdminDashboard/>}></Route>
            {/* <Route path='/companies' element={<Companies/>}></Route> */}
            <Route path="/income-entry" element={<IncomeEntry />} />
            <Route path="/dash-user" element={<UserDashboard />} />
        </Routes>
        </AxiosInterceptor>
    </Router>
  );
}

export default App;
