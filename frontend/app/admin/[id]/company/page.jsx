"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, XCircle } from "lucide-react";

// Helper components for modals
const ModalBackdrop = ({ onClick, children }) => (
  <motion.div
    className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center"
    onClick={onClick}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {children}
  </motion.div>
);

const ModalContainer = ({ children }) => (
  <motion.div
    className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full"
    onClick={(e) => e.stopPropagation()}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
  >
    {children}
  </motion.div>
);

export default function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyDescription, setNewCompanyDescription] = useState("");

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [deleteCompanyId, setDeleteCompanyId] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/admin/companies", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      setError(`Error fetching companies: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async () => {
    if (!newCompanyName) {
      setError("Company name is required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/admin/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: newCompanyName,
          description: newCompanyDescription,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setNewCompanyName("");
      setNewCompanyDescription("");
      setShowAddModal(false);
      fetchCompanies();
    } catch (err) {
      setError(`Error adding company: ${err.message}`);
    }
  };

  const editCompany = async () => {
    if (!selectedCompany) return;

    try {
      const response = await fetch(`http://localhost:8000/api/admin/companies/${selectedCompany.company_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: selectedCompany.company_name,
          description: selectedCompany.description,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setShowEditModal(false);
      fetchCompanies();
    } catch (err) {
      setError(`Error editing company: ${err.message}`);
    }
  };

  const deleteCompany = async (companyId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/companies/${companyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setShowDeleteModal(false);
      fetchCompanies();
    } catch (err) {
      setError(`Error deleting company: ${err.message}`);
    }
  };

  return (
    <motion.div
      className="container mx-auto p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Manage Companies</h1>
      <p className="mb-4 text-gray-600 dark:text-gray-400">Add, edit, or delete companies.</p>

      {error && <div className="bg-red-100 border border-red-500 text-red-700 py-3 px-4 rounded mb-4">{error}</div>}

      <div className="mb-6">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Company
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">Loading companies...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {companies.map((company) => (
            <motion.div
              key={company.company_id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{company.company_name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{company.description}</p>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => {
                    setSelectedCompany(company);
                    setShowEditModal(true);
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  <Edit className="h-4 w-4 mr-1 inline-block" /> Edit
                </button>
                <button
                  onClick={() => {
                    setDeleteCompanyId(company.company_id);
                    setShowDeleteModal(true);
                  }}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  <Trash2 className="h-4 w-4 mr-1 inline-block" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Company Modal */}
      {showAddModal && (
        <ModalBackdrop onClick={() => setShowAddModal(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Add New Company</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Enter company name"
            />

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1">Company Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={newCompanyDescription}
              onChange={(e) => setNewCompanyDescription(e.target.value)}
              placeholder="Enter company description"
            />

            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={addCompany}
                className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
              >
                Add Company
              </button>
            </div>
          </ModalContainer>
        </ModalBackdrop>
      )}

      {/* Edit Company Modal */}
      {showEditModal && selectedCompany && (
        <ModalBackdrop onClick={() => setShowEditModal(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Edit Company</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={selectedCompany.company_name}
              onChange={(e) => setSelectedCompany({ ...selectedCompany, company_name: e.target.value })}
              placeholder="Enter company name"
            />

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1">Company Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={selectedCompany.description}
              onChange={(e) => setSelectedCompany({ ...selectedCompany, description: e.target.value })}
              placeholder="Enter company description"
            />

            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={editCompany}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
              >
                Save Changes
              </button>
            </div>
          </ModalContainer>
        </ModalBackdrop>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteCompanyId && (
        <ModalBackdrop onClick={() => setShowDeleteModal(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Are you sure you want to delete this company?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteCompany(deleteCompanyId)}
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
              >
                Delete
              </button>
            </div>
          </ModalContainer>
        </ModalBackdrop>
      )}
    </motion.div>
  );
}