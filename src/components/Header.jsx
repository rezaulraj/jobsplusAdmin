import React, { useState, useEffect, useRef } from "react";
import {
  HiCog,
  HiLogout,
  HiUser,
  HiMenu,
  HiChevronDown,
  HiBell,
  HiSearch,
  HiShieldCheck,
} from "react-icons/hi";
import logo from "/logo.png";
import useAuthStore from "../store/authStore";

// ── tiny helpers ─────────────────────────────────────────────────────────────
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const roleLabel = (role = "") => role.charAt(0).toUpperCase() + role.slice(1);

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ── component ─────────────────────────────────────────────────────────────────
const Header = ({ onToggleSidebar, currentPage }) => {
  const { user, logout } = useAuthStore();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const notifications = [
    {
      id: 1,
      icon: "👤",
      text: "New employer registered",
      time: "2m ago",
      unread: true,
    },
    {
      id: 2,
      icon: "📋",
      text: "Job application submitted",
      time: "15m ago",
      unread: true,
    },
    {
      id: 3,
      icon: "💼",
      text: "Package order confirmed",
      time: "1h ago",
      unread: true,
    },
    {
      id: 4,
      icon: "✅",
      text: "Profile verification done",
      time: "3h ago",
      unread: false,
    },
    {
      id: 5,
      icon: "📊",
      text: "Monthly report ready",
      time: "1d ago",
      unread: false,
    },
  ];
  const unread = notifications.filter((n) => n.unread).length;

  // close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // derived display values
  const displayName = user?.fullName || "Admin";
  const displayRole = user?.role || "admin";
  const initials = getInitials(displayName);
  const isVerified = user?.isEmailVerified;

  return (
    <>
      <style>{`
        @keyframes dropIn {
          from { opacity:0; transform:translateY(-8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)   scale(1);    }
        }
        .drop-anim { animation: dropIn 0.18s cubic-bezier(0.4,0,0.2,1) forwards; }
      `}</style>

      <header className="bg-white border-b border-slate-200 shadow-sm relative z-40 flex-shrink-0">
        {/* gradient bar */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#1e2558] to-[#4eb956]" />

        <div className="flex items-center justify-between h-[60px] px-5">
          {/* ── Left ──── */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg border border-slate-200 text-[#1e2558] hover:bg-[#4eb956]/10 hover:border-[#4eb956]/30 hover:text-[#4eb956] transition-all duration-150"
            >
              <HiMenu className="text-xl" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
              <img src={logo} alt="Logo" className="w-auto h-4" />
            </div>

            <div className="hidden md:flex items-center gap-2">
    
              <span className="text-sm font-bold text-[#1e2558]">
                {currentPage}
              </span>
            </div>
          </div>

          {/* ── Right ─── */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div
              className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-200
                ${
                  searchFocused
                    ? "bg-white border-[#1e2558] shadow-sm w-52"
                    : "bg-slate-50 border-slate-200 w-36"
                }`}
            >
              <HiSearch
                className={`text-base flex-shrink-0 transition-colors duration-200 ${searchFocused ? "text-[#1e2558]" : "text-slate-400"}`}
              />
              <input
                placeholder="Search..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent border-none outline-none text-[13px] text-[#1e2558] placeholder-slate-400 w-full"
              />
            </div>

            {/* Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                }}
                className="relative p-2.5 rounded-xl border border-slate-200 text-[#1e2558] hover:bg-[#4eb956]/10 hover:border-[#4eb956]/30 hover:text-[#4eb956] transition-all duration-150"
              >
                <HiBell className="text-[18px]" />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4eb956] border-2 border-white" />
                )}
              </button>

              {isNotifOpen && (
                <div className="drop-anim absolute right-0 top-[calc(100%+8px)] w-[308px] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <span className="text-sm font-bold text-[#1e2558]">
                      Notifications
                    </span>
                    <span className="text-[11px] font-bold text-[#4eb956] bg-[#4eb956]/10 border border-[#4eb956]/20 px-2.5 py-0.5 rounded-full">
                      {unread} New
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 cursor-pointer transition-colors duration-150 hover:bg-[#4eb956]/5
                          ${n.unread ? "bg-slate-50/60" : "bg-white"}`}
                      >
                        <span className="text-lg w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg flex-shrink-0">
                          {n.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-[13px] leading-snug truncate ${n.unread ? "text-[#1e2558] font-semibold" : "text-slate-500 font-normal"}`}
                          >
                            {n.text}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {n.time}
                          </p>
                        </div>
                        {n.unread && (
                          <span className="w-2 h-2 rounded-full bg-[#4eb956] flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                    <button className="text-[13px] font-bold text-[#1e2558] hover:text-[#4eb956] transition-colors duration-150">
                      View all notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#4eb956]/10 hover:border-[#4eb956]/30 transition-all duration-150"
              >
                {/* Avatar: initials circle */}
                <div className="w-8 h-8 rounded-full bg-[#1e2558] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#4eb956] text-[11px] font-extrabold tracking-wide">
                    {initials}
                  </span>
                </div>

                <div className="hidden md:block text-left">
                  <div className="text-[13px] font-bold text-[#1e2558] leading-tight max-w-[110px] truncate">
                    {displayName}
                  </div>
                  <div className="text-[10px] font-bold text-[#4eb956] leading-tight capitalize">
                    {displayRole}
                  </div>
                </div>

                <HiChevronDown
                  className={`hidden md:block text-slate-400 text-sm transition-transform duration-200 ${isProfileOpen ? "rotate-180" : "rotate-0"}`}
                />
              </button>

              {isProfileOpen && (
                <div className="drop-anim absolute right-0 top-[calc(100%+8px)] w-60 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
                  {/* ── User card ── */}
                  <div className="px-4 py-4 border-b border-slate-100">
                    {/* Avatar large */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#1e2558] flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-[#4eb956] text-base font-extrabold tracking-wide">
                          {initials}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[#1e2558] truncate">
                          {displayName}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className="text-[10px] font-bold text-[#4eb956] bg-[#4eb956]/10 border border-[#4eb956]/20 px-2 py-0.5 rounded-full capitalize">
                            {roleLabel(displayRole)}
                          </span>
                          {isVerified && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-blue-500 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                              <HiShieldCheck className="text-xs" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="mt-3 space-y-1.5 bg-slate-50 rounded-xl p-3">
                      <InfoRow label="Email" value={user?.email || "—"} />
                      <InfoRow label="Phone" value={user?.phone || "—"} />
                      <InfoRow
                        label="Joined"
                        value={formatDate(user?.createdAt)}
                      />
                      <InfoRow
                        label="Status"
                        value={
                          <span
                            className={`font-semibold capitalize ${user?.isActive === "active" ? "text-[#4eb956]" : "text-red-500"}`}
                          >
                            {user?.isActive || "—"}
                          </span>
                        }
                      />
                    </div>
                  </div>

                  {/* ── Menu ── */}
                  <div className="p-1.5">
                    {[
                      { icon: <HiUser />, label: "My Profile" },
                      { icon: <HiCog />, label: "Settings" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-[#4eb956]/10 hover:text-[#1e2558] transition-all duration-150"
                      >
                        <span className="text-base text-[#1e2558]">
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                    ))}
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
                    >
                      <HiLogout className="text-base" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile breadcrumb */}
        <div className="md:hidden px-5 pb-3">
          <span className="text-base font-bold text-[#1e2558]">
            {currentPage}
          </span>
        </div>
      </header>
    </>
  );
};

// ── tiny sub-component for info rows ─────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-2">
    <span className="text-[11px] text-slate-400 font-medium flex-shrink-0">
      {label}
    </span>
    <span className="text-[11px] text-[#1e2558] font-semibold text-right truncate max-w-[130px]">
      {value}
    </span>
  </div>
);

export default Header;
