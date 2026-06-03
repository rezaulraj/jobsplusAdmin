import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiEyeOff,
  HiSearch,
  HiX,
  HiTag,
  HiPhotograph,
  HiCheckCircle,
  HiExclamationCircle,
  HiRefresh,
} from "react-icons/hi";
import useCategoryStore from "../../store/categoryStore"; // adjust path

// ─────────────────────────────────────────────────────────────────────────────
// Tiny toast (no library needed)
// ─────────────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold transition-all
        ${
          type === "success"
            ? "bg-white border-[#4eb956]/40 text-[#1e2558]"
            : "bg-white border-red-300 text-red-600"
        }`}
    >
      {type === "success" ? (
        <HiCheckCircle className="text-[#4eb956] text-xl flex-shrink-0" />
      ) : (
        <HiExclamationCircle className="text-red-500 text-xl flex-shrink-0" />
      )}
      {msg}
      <button
        onClick={onClose}
        className="ml-2 text-slate-400 hover:text-slate-600"
      >
        <HiX />
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────────────────────────────────────
const MODAL_ANIM = `
  @keyframes modalIn {
    from { opacity:0; transform:scale(0.94) translateY(12px); }
    to   { opacity:1; transform:scale(1)    translateY(0);    }
  }
  .modal-in { animation: modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) forwards; }
`;

const Modal = ({ mode, initial, onClose, onSave, loading }) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [icon, setIcon] = useState(initial?.categoryIcon || "");
  const [titleErr, setTitleErr] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 60);
  }, []);

  const validate = () => {
    if (!title.trim()) {
      setTitleErr("Title is required");
      return false;
    }
    setTitleErr("");
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({ title: title.trim(), categoryIcon: icon.trim() || null });
  };

  return (
    <>
      <style>{MODAL_ANIM}</style>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-[#1e2558]/30 backdrop-blur-[3px] flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Panel */}
        <div className="modal-in w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1e2558] flex items-center justify-center">
                <HiTag className="text-[#4eb956] text-base" />
              </div>
              <span className="text-base font-bold text-[#1e2558]">
                {mode === "create" ? "New Category" : "Edit Category"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-[#1e2558] transition-all duration-150"
            >
              <HiX className="text-lg" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-[12px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Category Title <span className="text-red-400">*</span>
              </label>
              <input
                ref={inputRef}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setTitleErr("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="e.g. Software Engineering"
                className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1e2558] font-medium outline-none transition-all duration-150
                  placeholder-slate-400 bg-slate-50
                  ${
                    titleErr
                      ? "border-red-400 focus:border-red-400 bg-red-50/30"
                      : "border-slate-200 focus:border-[#1e2558] focus:bg-white focus:shadow-sm"
                  }`}
              />
              {titleErr && (
                <p className="mt-1.5 text-[12px] text-red-500 font-medium flex items-center gap-1">
                  <HiExclamationCircle /> {titleErr}
                </p>
              )}
            </div>

            {/* Icon */}
            <div>
              <label className="block text-[12px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Icon URL{" "}
                <span className="text-slate-400 font-normal normal-case">
                  (optional)
                </span>
              </label>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {icon ? (
                    <img
                      src={icon}
                      alt="preview"
                      className="w-7 h-7 object-contain"
                      onError={() => setIcon("")}
                    />
                  ) : (
                    <HiPhotograph className="text-slate-300 text-xl" />
                  )}
                </div>
                <input
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="https://example.com/icon.svg"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1e2558] bg-slate-50 focus:bg-white text-sm text-[#1e2558] outline-none transition-all duration-150 placeholder-slate-400 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-slate-500 border border-slate-200 hover:bg-white hover:text-[#1e2558] transition-all duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-[13px] font-bold bg-[#1e2558] text-white hover:bg-[#1e2558]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2 shadow-sm"
            >
              {loading && (
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              )}
              {mode === "create" ? "Create" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Delete confirm modal
// ─────────────────────────────────────────────────────────────────────────────
const DeleteModal = ({ category, onClose, onConfirm, loading }) => (
  <>
    <style>{MODAL_ANIM}</style>
    <div
      className="fixed inset-0 z-[100] bg-[#1e2558]/30 backdrop-blur-[3px] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-in w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 pt-6 pb-5 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
            <HiTrash className="text-red-500 text-2xl" />
          </div>
          <h3 className="text-base font-bold text-[#1e2558] mb-1">
            Delete Category
          </h3>
          <p className="text-[13px] text-slate-500">
            Are you sure you want to delete{" "}
            <span className="font-bold text-[#1e2558]">
              "{category?.title}"
            </span>
            ? This action cannot be undone.
          </p>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-all duration-150 flex items-center justify-center gap-2"
          >
            {loading && (
              <svg
                className="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// Category row card
// ─────────────────────────────────────────────────────────────────────────────
const CategoryRow = React.memo(
  ({ cat, index, onEdit, onDelete, onToggle, actionLoading }) => {
    const busy = actionLoading === cat._id;

    return (
      <div
        style={{ animationDelay: `${index * 40}ms` }}
        className="row-fade flex items-center gap-4 px-5 py-4 bg-white border border-slate-200 rounded-2xl hover:border-[#1e2558]/20 hover:shadow-md transition-all duration-200 group"
      >
        {/* Icon / Initials */}
        <div className="w-11 h-11 rounded-xl bg-[#1e2558]/5 border border-[#1e2558]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {cat.categoryIcon ? (
            <img
              src={cat.categoryIcon}
              alt={cat.title}
              className="w-7 h-7 object-contain"
            />
          ) : (
            <span className="text-[13px] font-extrabold text-[#1e2558]/50">
              {cat.title?.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-bold text-[#1e2558] truncate">
            {cat.title}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-slate-400 font-medium">
              {cat.totalJobs ?? 0} job{cat.totalJobs !== 1 ? "s" : ""}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-[11px] text-slate-400 font-medium">
              {new Date(cat.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Status badge */}
        <span
          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border
          ${
            cat.isActive
              ? "bg-[#4eb956]/10 text-[#4eb956] border-[#4eb956]/25"
              : "bg-slate-100 text-slate-400 border-slate-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? "bg-[#4eb956]" : "bg-slate-400"}`}
          />
          {cat.isActive ? "Active" : "Hidden"}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {/* Toggle visibility */}
          <button
            onClick={() => onToggle(cat)}
            disabled={busy}
            title={cat.isActive ? "Hide" : "Activate"}
            className={`p-2 rounded-xl border transition-all duration-150 text-[15px]
            ${
              cat.isActive
                ? "border-slate-200 text-slate-400 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                : "border-slate-200 text-slate-400 hover:bg-[#4eb956]/10 hover:text-[#4eb956] hover:border-[#4eb956]/30"
            } disabled:opacity-40`}
          >
            {cat.isActive ? <HiEyeOff /> : <HiEye />}
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(cat)}
            className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-[#1e2558]/5 hover:text-[#1e2558] hover:border-[#1e2558]/20 transition-all duration-150 text-[15px]"
          >
            <HiPencil />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(cat)}
            className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all duration-150 text-[15px]"
          >
            <HiTrash />
          </button>
        </div>
      </div>
    );
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_ANIM = `
  @keyframes rowFade {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0);   }
  }
  .row-fade { animation: rowFade 0.25s ease forwards; opacity:0; }
`;

const JobCategorys = () => {
  const {
    categories,
    isLoading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
  } = useCategoryStore();

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | { mode: 'create'|'edit', data?: cat }
  const [deleteTarget, setDeleteTarget] = useState(null); // cat | null
  const [actionLoading, setActionLoading] = useState(null); // cat._id being processed
  const [toast, setToast] = useState(null); // { msg, type }

  const hasFetched = useRef(false);

  // Fetch once on mount
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchCategories();
    }
  }, [fetchCategories]);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
  }, []);

  // ── filtered list (stable reference while search unchanged) ───────────────
  const filtered = search.trim()
    ? categories.filter((c) =>
        c.title.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : categories;

  // ── counts ────────────────────────────────────────────────────────────────
  const totalActive = categories.filter((c) => c.isActive).length;

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleSave = useCallback(
    async (payload) => {
      const isEdit = modal?.mode === "edit";
      const id = modal?.data?._id;

      if (isEdit) {
        setActionLoading(id);
        const res = await updateCategory(id, payload);
        setActionLoading(null);
        if (res.success) {
          showToast("Category updated!");
          setModal(null);
        } else showToast(res.error || "Update failed", "error");
      } else {
        setActionLoading("new");
        const res = await createCategory(payload);
        setActionLoading(null);
        if (res.success) {
          showToast("Category created!");
          setModal(null);
        } else showToast(res.error || "Create failed", "error");
      }
    },
    [modal, createCategory, updateCategory, showToast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget._id);
    const res = await deleteCategory(deleteTarget._id);
    setActionLoading(null);
    setDeleteTarget(null);
    if (res.success) showToast("Category deleted.");
    else showToast(res.error || "Delete failed", "error");
  }, [deleteTarget, deleteCategory, showToast]);

  const handleToggle = useCallback(
    async (cat) => {
      setActionLoading(cat._id);
      const res = await toggleCategoryStatus(cat._id, !cat.isActive);
      setActionLoading(null);
      if (res.success)
        showToast(cat.isActive ? "Category hidden." : "Category activated.");
      else showToast(res.error || "Status update failed", "error");
    },
    [toggleCategoryStatus, showToast],
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{PAGE_ANIM}</style>

      <div className="min-h-screen bg-slate-50 p-5 md:p-7">
        {/* ── Page header ── */}
        <div className="mb-6">
          {/* Top accent line */}
          <div className="h-[3px] w-16 rounded-full bg-gradient-to-r from-[#1e2558] to-[#4eb956] mb-4" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1e2558] tracking-tight">
                Job Categories
              </h1>
              <p className="text-[13px] text-slate-500 mt-0.5">
                Manage all job categories across the platform
              </p>
            </div>

            <button
              onClick={() => setModal({ mode: "create" })}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e2558] text-white text-[13px] font-bold rounded-xl hover:bg-[#1e2558]/90 transition-all duration-150 shadow-sm flex-shrink-0"
            >
              <HiPlus className="text-[#4eb956] text-lg" />
              Add Category
            </button>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total", value: categories.length, accent: "#1e2558" },
            { label: "Active", value: totalActive, accent: "#4eb956" },
            {
              label: "Hidden",
              value: categories.length - totalActive,
              accent: "#94a3b8",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex flex-col gap-1"
            >
              <span
                className="text-2xl font-extrabold"
                style={{ color: s.accent }}
              >
                {s.value}
              </span>
              <span className="text-[12px] text-slate-500 font-semibold">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus-within:border-[#1e2558] focus-within:shadow-sm transition-all duration-150">
            <HiSearch className="text-slate-400 text-base flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories…"
              className="flex-1 text-[13px] text-[#1e2558] bg-transparent outline-none placeholder-slate-400 font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-slate-300 hover:text-slate-500"
              >
                <HiX />
              </button>
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={() => {
              hasFetched.current = false;
              fetchCategories();
              hasFetched.current = true;
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-500 hover:border-[#1e2558]/30 hover:text-[#1e2558] transition-all duration-150 disabled:opacity-50"
          >
            <HiRefresh
              className={`text-base ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* ── List ── */}
        {isLoading && categories.length === 0 ? (
          // Skeleton
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[74px] bg-white border border-slate-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <HiTag className="text-slate-300 text-3xl" />
            </div>
            <p className="text-[14px] font-bold text-slate-400">
              {search ? "No categories match your search" : "No categories yet"}
            </p>
            {!search && (
              <button
                onClick={() => setModal({ mode: "create" })}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e2558] text-white text-[13px] font-bold rounded-xl"
              >
                <HiPlus className="text-[#4eb956]" /> Add First Category
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((cat, i) => (
              <CategoryRow
                key={cat._id}
                cat={cat}
                index={i}
                onEdit={(c) => setModal({ mode: "edit", data: c })}
                onDelete={(c) => setDeleteTarget(c)}
                onToggle={handleToggle}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}

        {/* Result count */}
        {filtered.length > 0 && (
          <p className="mt-4 text-[12px] text-slate-400 font-medium text-right">
            Showing {filtered.length} of {categories.length} categories
          </p>
        )}
      </div>

      {/* ── Modals ── */}
      {modal && (
        <Modal
          mode={modal.mode}
          initial={modal.data || null}
          onClose={() => setModal(null)}
          onSave={handleSave}
          loading={actionLoading === (modal.data?._id || "new")}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          category={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={actionLoading === deleteTarget._id}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default JobCategorys;
