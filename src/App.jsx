
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home"; 
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Category from "./pages/Category";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Filter from "./pages/Filter";
import { Toaster } from "react-hot-toast";


const App = () => {
  return(
    <>
    <Toaster />
    <BrowserRouter>
      <Routes>
          <Route path = "/" element={<Root />} />
          <Route path = "/dashboard" element={<Home />}/>
          <Route path = "/income" element={<Income />}/>
          <Route path = "/expense" element={<Expense />}/>
          <Route path = "/category" element={<Category />}/>
          <Route path = "/login" element={<Login />}/>
          <Route path = "/signup" element={<Signup />}/>
          <Route path = "/filter" element={<Filter />}/>

      </Routes>
    </BrowserRouter>
    </>
  )
}

const Root = () => {
  const isAuthenticated = !localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard"/>
  ) : (
    <Navigate to="/login" />
  );
}

export default App;