import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  HiHome,
  HiChartBar,
  HiUsers,
  HiUserGroup,
  HiCog,
  HiViewGrid,
  HiShieldCheck,
  HiCalculator,
  HiMail,
  HiPhone,
  HiChevronDown,
  HiChevronRight,
  HiMenu,
  HiX,
} from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "/logo.png";

const SideBar = ({ isOpen, isMobile, onToggle }) => {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  const sideBarData = [
    {
      id: 1,
      label: "Home",
      path: "/admin/home",
      role: ["admin"],
      icon: <HiHome className="text-xl" />,
    },
    {
      id: 2,
      label: "Dashboard",
      path: "/admin/dashboard",
      role: ["admin"],
      icon: <HiChartBar className="text-xl" />,
    },
    {
      id: 3,
      label: "Users",
      path: "/admin/users",
      role: ["admin"],
      icon: <HiUsers className="text-xl" />,
    },
    {
      id: 4,
      label: "Customer",
      role: ["admin", "saller"],
      icon: <HiUserGroup className="text-xl" />,
      subBar: [
        { id: 41, label: "My Customer", path: "/saller/my-customer" },
        { id: 42, label: "Add Customer", path: "/saller/add-customer" },
      ],
    },
    {
      id: 5,
      label: "Profile",
      role: ["admin"],
      icon: <HiCog className="text-xl" />,
      subBar: [{ id: 51, label: "Profile Setup", path: "/admin/profiles" }],
    },
    {
      id: 6,
      label: "Glass",
      role: ["admin"],
      icon: <HiViewGrid className="text-xl" />,
      subBar: [{ id: 61, label: "Glass Setup", path: "/admin/glasss" }],
    },
    {
      id: 7,
      label: "Mosquito",
      role: ["admin"],
      icon: <HiShieldCheck className="text-xl" />,
      subBar: [
        { id: 71, label: "Mosquito Setup", path: "/admin/mosquito-net" },
      ],
    },
    {
      id: 8,
      label: "Vat & Installation",
      role: ["admin"],
      icon: <HiCalculator className="text-xl" />,
      subBar: [{ id: 81, label: "Vat Setup", path: "/admin/vat-setup" }],
    },
    {
      id: 9,
      label: "All Customer",
      role: ["admin"],
      icon: <HiUserGroup className="text-xl" />,
      subBar: [{ id: 91, label: "All Customer", path: "/admin/all-customer" }],
    },
    {
      id: 10,
      label: "Quotation",
      role: ["admin", "saller"],
      icon: <HiCalculator className="text-xl" />,
      subBar: [
        { id: 101, label: "Quotation", path: "/saller/quotation" },
        {
          id: 102,
          label: "Quotation Report",
          path: "/saller/quotation-report",
        },
      ],
    },
    {
      id: 11,
      label: "Mail Data",
      role: ["admin", "saller"],
      icon: <HiMail className="text-xl" />,
      subBar: [{ id: 111, label: "Mail Data", path: "/saller/mail-data" }],
    },
    {
      id: 12,
      label: "Phone Data",
      role: ["admin", "saller"],
      icon: <HiPhone className="text-xl" />,
      subBar: [{ id: 121, label: "Phone Data", path: "/saller/phone-data" }],
    },
  ];

  const toggleSubmenu = (id) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) onToggle();
  };

  const isItemActive = (item) => {
    if (item.path) return location.pathname === item.path;
    if (item.subBar)
      return item.subBar.some((s) => location.pathname === s.path);
    return false;
  };

  const isSubItemActive = (subItem) => location.pathname === subItem.path;

  const renderTooltip = (label) =>
    ReactDOM.createPortal(
      <div
        className="fixed px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-[9999] whitespace-nowrap transition-all duration-150"
        style={{
          top: tooltipPos.y,
          left: tooltipPos.x,
          transform: "translateY(-50%)",
        }}
      >
        {label}
      </div>,
      document.body,
    );

  return (
    <div className="h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {isOpen && (
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="w-8 h-8 rounded" />
            <span className="font-bold text-md">JobsPlus</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {isOpen ? (
            <HiX className="text-xl" />
          ) : (
            <HiMenu className="text-xl" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {sideBarData.map((item) => (
            <li key={item.id}>
              <div
                className={`group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  isItemActive(item)
                    ? "bg-blue-600 text-white shadow-lg"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
                onClick={() => {
                  if (item.subBar) toggleSubmenu(item.id);
                  else handleNavigation(item.path);
                }}
                onMouseEnter={(e) => {
                  if (!isOpen) {
                    setHoveredItem(item.id);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltipPos({
                      x: rect.right + 12,
                      y: rect.top + rect.height / 2,
                    });
                  }
                }}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="flex items-center space-x-3">
                  <span>{item.icon}</span>
                  {isOpen && <span className="font-medium">{item.label}</span>}
                </div>

                {item.subBar && isOpen && (
                  <span className="transform transition-transform duration-200">
                    {openSubmenus[item.id] ? (
                      <HiChevronDown className="text-lg" />
                    ) : (
                      <HiChevronRight className="text-lg" />
                    )}
                  </span>
                )}
              </div>

              {!isOpen && hoveredItem === item.id && renderTooltip(item.label)}

              {item.subBar && openSubmenus[item.id] && (
                <ul className={`mt-1 space-y-1 ${isOpen ? "ml-6" : "ml-2"}`}>
                  {item.subBar.map((subItem) => (
                    <li key={subItem.id}>
                      <div
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          isSubItemActive(subItem)
                            ? "bg-blue-500 text-white shadow-md"
                            : "hover:bg-gray-700 text-gray-300"
                        }`}
                        onClick={() => handleNavigation(subItem.path)}
                        onMouseEnter={(e) => {
                          if (!isOpen) {
                            setHoveredItem(subItem.id);
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            setTooltipPos({
                              x: rect.right + 12,
                              y: rect.top + rect.height / 2,
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        {isOpen ? (
                          <>
                            <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                            <span className="text-sm">{subItem.label}</span>
                          </>
                        ) : (
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        )}
                      </div>
                      {!isOpen &&
                        hoveredItem === subItem.id &&
                        renderTooltip(subItem.label)}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {isOpen && (
        <div className="p-4 border-t border-gray-700 text-center text-gray-400 text-sm">
          v1.0.0
        </div>
      )}
    </div>
  );
};

export default SideBar;
