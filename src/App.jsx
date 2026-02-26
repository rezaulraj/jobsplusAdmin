import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./layout/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/home" replace />} />
          <Route
            path="/admin/home"
            element={<div className="p-6">Home Content</div>}
          />
          <Route
            path="/admin/dashboard"
            element={<div className="p-6">Dashboard Content</div>}
          />
          <Route
            path="/admin/users"
            element={<div className="p-6">Users Content</div>}
          />
          <Route
            path="/saller/my-customer"
            element={<div className="p-6">My Customer Content</div>}
          />
          <Route
            path="/saller/add-customer"
            element={<div className="p-6">Add Customer Content</div>}
          />
          <Route
            path="/admin/profiles"
            element={<div className="p-6">Profile Setup Content</div>}
          />
          <Route
            path="/admin/glasss"
            element={<div className="p-6">Glass Setup Content</div>}
          />
          <Route
            path="/admin/mosquito-net"
            element={<div className="p-6">Mosquito Setup Content</div>}
          />
          <Route
            path="/admin/all-customer"
            element={<div className="p-6">All Customer Content</div>}
          />
          <Route
            path="/saller/quotation"
            element={<div className="p-6">Quotation Content</div>}
          />
          <Route
            path="/saller/quotation-report"
            element={<div className="p-6">Quotation Report Content</div>}
          />
          <Route
            path="/saller/mail-data"
            element={<div className="p-6">Mail Data Content</div>}
          />
          <Route
            path="/saller/phone-data"
            element={<div className="p-6">Phone Data Content</div>}
          />
          <Route
            path="/admin/vat-setup"
            element={<div className="p-6">Vat Setup Content</div>}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
