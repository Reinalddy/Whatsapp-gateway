'use client'
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Search } from 'lucide-react';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    lastLogin: string;
};

const sampleUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', lastLogin: '2025-05-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'active', lastLogin: '2025-05-14' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive', lastLogin: '2025-04-23' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Admin', status: 'active', lastLogin: '2025-05-16' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'inactive', lastLogin: '2025-03-12' },
    { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'Editor', status: 'active', lastLogin: '2025-05-10' },
    { id: 7, name: 'Edward Smith', email: 'edward@example.com', role: 'User', status: 'active', lastLogin: '2025-05-11' },
    { id: 8, name: 'Fiona Jones', email: 'fiona@example.com', role: 'User', status: 'active', lastLogin: '2025-05-17' },
    { id: 9, name: 'George Miller', email: 'george@example.com', role: 'Editor', status: 'inactive', lastLogin: '2025-04-30' },
    { id: 10, name: 'Hannah Taylor', email: 'hannah@example.com', role: 'User', status: 'active', lastLogin: '2025-05-08' },
    { id: 11, name: 'Ian Clark', email: 'ian@example.com', role: 'User', status: 'active', lastLogin: '2025-05-13' },
    { id: 12, name: 'Jessica Lee', email: 'jessica@example.com', role: 'Admin', status: 'active', lastLogin: '2025-05-12' },
  ];

type SortConfig = {
    key: keyof User | null;
    direction: 'asc' | 'desc';
  };

export default function SendMessagesPage() {
    const [users, setUsers] = useState<User[]>(sampleUsers);
    const [filteredUsers, setFilteredUsers] = useState<User[]>(sampleUsers);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');

    // Handle sorting
    const requestSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Apply sorting and filtering
    useEffect(() => {
        let sortedUsers = [...users];

        // Apply search filter
        if (searchTerm) {
            sortedUsers = sortedUsers.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        if (sortConfig.key) {
            sortedUsers.sort((a, b) => {
                if (a[sortConfig.key!] < b[sortConfig.key!]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key!] > b[sortConfig.key!]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredUsers(sortedUsers);
        setCurrentPage(1); // Reset to first page when filtering
    }, [users, sortConfig, searchTerm]);

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Pagination controls
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    // Get sort direction icon
    const getSortDirectionIcon = (key: keyof User) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    };

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>

            {/* Search and filters */}
            <div className="mb-4 relative">
                <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                    <div className="px-3 py-2 bg-gray-50">
                        <Search size={20} className="text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, email or role..."
                        className="w-full p-2 border-none focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* BUTTON TO OPEN MODAL */}
            <div className='mb-4'>
                
            </div>

            {/* Items per page selector */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries
                </div>
                <div className="flex items-center">
                    <span className="mr-2 text-sm text-gray-600">Items per page:</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="border rounded p-1 text-sm"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                onClick={() => requestSort('id')}
                                className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center">
                                    ID {getSortDirectionIcon('id')}
                                </div>
                            </th>
                            <th
                                onClick={() => requestSort('name')}
                                className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center">
                                    Name {getSortDirectionIcon('name')}
                                </div>
                            </th>
                            <th
                                onClick={() => requestSort('email')}
                                className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center">
                                    Email {getSortDirectionIcon('email')}
                                </div>
                            </th>
                            <th
                                onClick={() => requestSort('role')}
                                className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center">
                                    Role {getSortDirectionIcon('role')}
                                </div>
                            </th>
                            <th
                                onClick={() => requestSort('status')}
                                className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center">
                                    Status {getSortDirectionIcon('status')}
                                </div>
                            </th>
                            <th
                                onClick={() => requestSort('lastLogin')}
                                className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center">
                                    Last Login {getSortDirectionIcon('lastLogin')}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentItems.length > 0 ? (
                            currentItems.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                    No matching records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredUsers.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-1">
                        <button
                            onClick={goToFirstPage}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded border ${currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            <ChevronsLeft size={16} />
                        </button>
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded border ${currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {/* Page numbers */}
                        <div className="flex space-x-1">
                            {[...Array(totalPages)].map((_, index) => {
                                // Show limited page numbers with ellipsis
                                const pageNum = index + 1;

                                // Always show first, last, current and numbers close to current
                                if (
                                    pageNum === 1 ||
                                    pageNum === totalPages ||
                                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => paginate(pageNum)}
                                            className={`px-3 py-1 rounded border ${currentPage === pageNum
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                }

                                // Show ellipsis (but only once between ranges)
                                if (
                                    (pageNum === 2 && currentPage > 3) ||
                                    (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                                ) {
                                    return <span key={pageNum} className="px-3 py-1">...</span>;
                                }

                                return null;
                            })}
                        </div>

                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded border ${currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            <ChevronRight size={16} />
                        </button>
                        <button
                            onClick={goToLastPage}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded border ${currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            <ChevronsRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}