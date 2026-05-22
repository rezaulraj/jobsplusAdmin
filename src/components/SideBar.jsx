import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  HiChartBar,
  HiUsers,
  HiUserGroup,
  HiViewGrid,
  HiShieldCheck,
  HiCalculator,
  HiMail,
  HiPhone,
  HiChevronDown,
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
      id: 2,
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <HiChartBar className="text-lg" />,
    },
    {
      id: 4,
      label: "Job Management",
      icon: <HiViewGrid className="text-lg" />,
      subBar: [
        { id: 41, label: "All Jobs", path: "/admin/all-jobs" },
        { id: 42, label: "Post Job", path: "/admin/add-new-job" },
        { id: 43, label: "Job Categories", path: "/admin/job-categories" },
        { id: 44, label: "Country Setup", path: "/admin/country-setup" },
        { id: 45, label: "City Setup", path: "/admin/city-setup" },
        { id: 46, label: "Area Setup", path: "/admin/area-setup" },
        { id: 47, label: "Job Type Setup", path: "/admin/job-type-setup" },
      ],
    },
    {
      id: 5,
      label: "Employer Management",
      icon: <HiUserGroup className="text-lg" />,
      subBar: [
        { id: 51, label: "All Employers", path: "/admin/all-employers" },
        { id: 52, label: "Create Employer", path: "/admin/create-employer" },
        { id: 53, label: "Employer Package", path: "/admin/employer-package" },
        {
          id: 54,
          label: "Package Orders",
          path: "/admin/employer-package-order",
        },
        { id: 55, label: "Employer Profile", path: "/admin/employer-profile" },
        { id: 56, label: "Employer Payment", path: "/admin/employer-payment" },
        { id: 57, label: "Mail Notify", path: "/admin/employer-mail-notify" },
      ],
    },
    {
      id: 6,
      label: "Seeker Management",
      icon: <HiUsers className="text-lg" />,
      subBar: [
        { id: 61, label: "All Seekers", path: "/admin/all-seekers" },
        { id: 62, label: "Create Seeker", path: "/admin/create-seeker" },
        { id: 63, label: "Seeker Profile", path: "/admin/seeker-profile" },
        { id: 64, label: "Seeker Payment", path: "/admin/seeker-payment" },
        { id: 65, label: "Job Apply", path: "/admin/seeker-job-apply" },
        { id: 66, label: "Mail Notify", path: "/admin/seeker-mail-notify" },
      ],
    },
    {
      id: 7,
      label: "Payment Setup",
      icon: <HiCalculator className="text-lg" />,
      subBar: [
        { id: 71, label: "Create Package", path: "/admin/create-package" },
        { id: 72, label: "All Packages", path: "/admin/all-package" },
      ],
    },
    {
      id: 8,
      label: "CRM Management",
      icon: <HiShieldCheck className="text-lg" />,
      subBar: [
        {
          id: 81,
          label: "Create Notification",
          path: "/admin/create-notification",
        },
        { id: 82, label: "All Notifications", path: "/admin/all-notification" },
      ],
    },
    {
      id: 9,
      label: "User Management",
      icon: <HiUserGroup className="text-lg" />,
      subBar: [
        { id: 91, label: "All Users", path: "/admin/all-users" },
        { id: 92, label: "Create User", path: "/admin/create-user" },
      ],
    },
  ];

  const toggleSubmenu = (id) =>
    setOpenSubmenus((prev) => ({ ...prev, [id]: !prev[id] }));

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

  const isSubActive = (sub) => location.pathname === sub.path;

  const renderTooltip = (label) =>
    ReactDOM.createPortal(
      <div
        className="fixed px-3 py-1.5 bg-[#1e2558] text-white text-xs font-semibold rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-[9999]"
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
    <div className="h-full flex flex-col bg-white border-r border-slate-200 shadow-sm">
      {/* Sidebar top green accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#1e2558] to-[#4eb956] flex-shrink-0" />

      {/* Logo */}
      <div
        className={`flex items-center ${isOpen ? "justify-between" : "justify-center"} px-3.5 py-3.5 border-b border-slate-100 flex-shrink-0`}
      >
        {isOpen && (
          <div className="flex items-center gap-2.5">
            <div>
              <div className="font-extrabold text-[18px] text-[#1e2558] tracking-tight leading-tight">
                Jobs<span className="text-[#4eb956]">Plus</span>
              </div>
              <div className="text-[12px] font-bold text-[#4eb956] tracking-widest leading-tight">
                ADMIN PORTAL
              </div>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg text-[#1e2558] hover:bg-[#4eb956]/10 hover:text-[#4eb956] transition-all duration-150"
        >
          {isOpen ? (
            <HiX className="text-xl" />
          ) : (
            <HiMenu className="text-xl" />
          )}
        </button>
      </div>

      {/* Nav label */}
      {isOpen && (
        <div className="px-4 pt-4 pb-1.5 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
          Main Menu
        </div>
      )}

      {/* Nav items */}
      <nav
        className="flex-1 overflow-y-auto py-2 scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        <ul className="px-2 space-y-0.5">
          {sideBarData.map((item) => {
            const active = isItemActive(item);
            return (
              <li key={item.id}>
                {/* Parent item */}
                <div
                  onClick={() => {
                    if (item.subBar) toggleSubmenu(item.id);
                    else handleNavigation(item.path);
                  }}
                  onMouseEnter={(e) => {
                    if (!isOpen) {
                      setHoveredItem(item.id);
                      const r = e.currentTarget.getBoundingClientRect();
                      setTooltipPos({
                        x: r.right + 10,
                        y: r.top + r.height / 2,
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    flex items-center ${isOpen ? "justify-between" : "justify-center"}
                    px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group
                    ${
                      active
                        ? "bg-[#1e2558] text-white shadow-md"
                        : "text-slate-600 hover:bg-[#4eb956]/10 hover:text-[#1e2558]"
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[18px] flex items-center flex-shrink-0 transition-colors duration-150
                      ${active ? "text-[#4eb956]" : "text-slate-400 group-hover:text-[#4eb956]"}`}
                    >
                      {item.icon}
                    </span>
                    {isOpen && (
                      <span className="text-[13.5px] font-medium leading-none">
                        {item.label}
                      </span>
                    )}
                  </div>
                  {item.subBar && isOpen && (
                    <HiChevronDown
                      className={`text-sm transition-transform duration-200 flex-shrink-0
                        ${active ? "text-[#4eb956]" : "text-slate-400"}
                        ${openSubmenus[item.id] ? "rotate-180" : "rotate-0"}`}
                    />
                  )}
                </div>

                {!isOpen &&
                  hoveredItem === item.id &&
                  renderTooltip(item.label)}

                {/* Submenu */}
                {item.subBar && openSubmenus[item.id] && (
                  <ul
                    className="mt-0.5 mb-1 space-y-0.5 overflow-hidden"
                    style={{
                      paddingLeft: isOpen ? "14px" : "4px",
                      animation: "subOpen 0.2s ease forwards",
                    }}
                  >
                    <style>{`
                      @keyframes subOpen {
                        from { opacity:0; transform:translateY(-6px); }
                        to   { opacity:1; transform:translateY(0); }
                      }
                    `}</style>
                    {item.subBar.map((sub) => {
                      const sa = isSubActive(sub);
                      return (
                        <li key={sub.id}>
                          <div
                            onClick={() => handleNavigation(sub.path)}
                            onMouseEnter={(e) => {
                              if (!isOpen) {
                                setHoveredItem(sub.id);
                                const r =
                                  e.currentTarget.getBoundingClientRect();
                                setTooltipPos({
                                  x: r.right + 10,
                                  y: r.top + r.height / 2,
                                });
                              }
                            }}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`
                              flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer
                              text-[13px] transition-all duration-150 group
                              ${isOpen ? "" : "justify-center"}
                              ${
                                sa
                                  ? "bg-[#4eb956]/10 text-[#1e2558] font-bold border-l-[3px] border-[#4eb956]"
                                  : "text-slate-500 hover:bg-[#4eb956]/10 hover:text-[#1e2558] border-l-[3px] border-transparent"
                              }
                            `}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors
                              ${sa ? "bg-[#4eb956]" : "bg-slate-300 group-hover:bg-[#4eb956]"}`}
                            />
                            {isOpen && sub.label}
                          </div>
                          {!isOpen &&
                            hoveredItem === sub.id &&
                            renderTooltip(sub.label)}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#4eb956] animate-pulse flex-shrink-0" />
          <span className="text-[11px] text-slate-400 font-medium">
            v1.0.0 · Online
          </span>
        </div>
      )}
    </div>
  );
};

export default SideBar;
