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
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const pathToTitle = {
      "/admin/home": "Home",
      "/admin/dashboard": "Dashboard",
      "/admin/users": "Users",
      "/saller/my-customer": "My Customers",
      "/saller/add-customer": "Add Customer",
      "/admin/profiles": "Profile Setup",
      "/admin/glasss": "Glass Setup",
      "/admin/mosquito-net": "Mosquito Net Setup",
      "/admin/all-customer": "All Customers",
      "/saller/quotation": "Quotation",
      "/saller/quotation-report": "Quotation Report",
      "/saller/mail-data": "Mail Data",
      "/saller/phone-data": "Phone Data",
      "/admin/vat-setup": "VAT Setup",
    };

    setCurrentPage(pathToTitle[location.pathname] || "Dashboard");
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`fixed md:relative z-30 transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "w-64 translate-x-0"
            : isMobile
            ? "-translate-x-full"
            : "w-20 -translate-x-0"
        }`}
      >
        <SideBar
          isOpen={isSidebarOpen}
          isMobile={isMobile}
          onToggle={toggleSidebar}
        />
      </div>

      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} currentPage={currentPage} />
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
