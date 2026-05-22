import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import Header from "../components/Header";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const pathToTitle = {
      "/admin/dashboard": "Dashboard",
      "/admin/home": "Home",
      "/admin/users": "Users",
      "/saller/my-customer": "My Customers",
      "/saller/add-customer": "Add Customer",
      "/admin/profiles": "Profile Setup",
      "/admin/all-customer": "All Customers",
      "/saller/quotation": "Quotation",
      "/saller/quotation-report": "Quotation Report",
      "/saller/mail-data": "Mail Data",
      "/saller/phone-data": "Phone Data",
      "/admin/vat-setup": "VAT Setup",
    };
    setCurrentPage(pathToTitle[location.pathname] || "Dashboard");
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Sidebar */}
      <div
        className={`
          flex-shrink-0 h-full z-30 transition-all duration-300 ease-in-out
          ${isMobile ? "fixed" : "relative"}
          ${
            isSidebarOpen
              ? isMobile
                ? "w-64 translate-x-0"
                : "w-64"
              : isMobile
                ? "w-64 -translate-x-full"
                : "w-[70px]"
          }
        `}
      >
        <SideBar
          isOpen={isSidebarOpen}
          isMobile={isMobile}
          onToggle={toggleSidebar}
        />
      </div>

      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-[#1e2558]/20 backdrop-blur-sm"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onToggleSidebar={toggleSidebar} currentPage={currentPage} />
        <main className="flex-1 overflow-auto bg-slate-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
