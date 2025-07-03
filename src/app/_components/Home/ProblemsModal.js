"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { FiX, FiSearch } from "react-icons/fi";

const DEFAULT_PROBLEM_IMAGE = "/problem-image-default.png";

const ProblemsModal = ({
  showProblemsModal,
  setShowProblemsModal,
  loading,
  problems,
  onProblemSelect,
}) => {
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [search, setSearch] = useState("");

  const filteredProblems = useMemo(() => {
    if (!search) return problems;
    return problems.filter((problem) => {
      const name = (problem.problem_type || problem.type || "").toLowerCase();
      const desc = (problem.description || "").toLowerCase();
      return (
        name.includes(search.toLowerCase()) ||
        desc.includes(search.toLowerCase())
      );
    });
  }, [problems, search]);

  if (!showProblemsModal) return null;

  const handleCheckboxChange = (problemId) => {
    setSelectedProblems((prev) =>
      prev.includes(problemId)
        ? prev.filter((id) => id !== problemId)
        : [...prev, problemId]
    );
  };

  const handleSubmit = () => {
    const selected = problems.filter((p) => selectedProblems.includes(p.id));
    if (onProblemSelect) onProblemSelect(selected);
    setShowProblemsModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm" style={{ background: "#000000cf" }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl shadow-2xl animate-fade-in border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 text-css">Select Issues</h3>
          <button
            onClick={() => setShowProblemsModal(false)}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            aria-label="Close problems modal"
          >
            <FiX className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search issues..."
            className="w-full pl-8 pr-3 py-2 text-sm border-0 ring-1 ring-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredProblems.length > 0 ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto py-2 pr-2">
              {filteredProblems.map((problem) => (
                <label
                  key={problem.id}
                  className="flex items-center space-x-3 bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedProblems.includes(problem.id)}
                    onChange={() => handleCheckboxChange(problem.id)}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded-md border-2 border-gray-300"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50">
                      <Image
                        src={problem.image || DEFAULT_PROBLEM_IMAGE}
                        alt={problem.problem_type || problem.type || "Problem"}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-base">
                        {problem.problem_type || problem.type || "Problem"}
                      </div>
                      {problem.description && (
                        <div className="text-sm text-gray-500 mt-1">
                          {problem.description}
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedProblems.length === 0}
              >
                Confirm Selection
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 text-gray-500 space-y-2">
            <div className="text-3xl">📭</div>
            <div className="text-gray-600">No issues found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemsModal;