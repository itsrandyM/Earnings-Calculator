import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthForm from "./Forms/authenticate";
import AdminDashboard from "./dashboard/dash";
// import Companies from "./company/company";
import IncomeEntry from "./Forms/income-entry";
import UserDashboard from "./dashboard/dashboard";
import AdminLogin from "./admin/login";
import { AxiosInterceptor } from "./apiClient";
import EditIncome from "./Forms/income-edit";
import AdminUpdateRequest from "./admin/updateRequest";
import UserAccountDetails from "./Forms/userProfile";
import ErrorPage from "./Errors/errorPage";

function App() {
  return (
    <Router>
      <AxiosInterceptor>
        <Routes>
            <Route path='/' element={<AuthForm/>}></Route>
            <Route path='/admin-login' element={<AdminLogin/>}></Route>
            <Route path='/admin-dashboard' element={<AdminDashboard/>}></Route>
            <Route path='/income-edit/:id' element={<EditIncome/>}></Route>
            <Route path="/income-entry" element={<IncomeEntry />} />
            <Route path="/dash-user" element={<UserDashboard />} />
            <Route path="/update-requests" element={<AdminUpdateRequest />} />
            <Route path="/user-profile" element={<UserAccountDetails />} /> 
            <Route path="/error-page" element={<ErrorPage />} />
        </Routes>
        </AxiosInterceptor>
    </Router>
  );
}

export default App;
