import React, { useState, useEffect } from 'react';
import { Trash2, Users, Search } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ViewUsers() {
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isClassAdmin = loggedInUser.role === 'admin';
  const isSuperAdmin = loggedInUser.role === 'super_admin';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(` /api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('User removed successfully');
        setUsers(users.filter(user => user.id !== id));
      } else {
        toast.error(data.message || 'Failed to remove user');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error(error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isClassAdmin ? 'Class Student Registry' : 'Manage School Users'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isClassAdmin 
                  ? `View and manage students in ${loggedInUser.className}-${loggedInUser.section}.` 
                  : 'View and remove registered staff, admins, and students.'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search name or email"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              disabled={isClassAdmin}
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              {!isClassAdmin && <option value="teacher">Staff / Teachers</option>}
              {!isClassAdmin && <option value="admin">Class Admins</option>}
              {!isClassAdmin && <option value="super_admin">Super Admins</option>}
            </select>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => setSelectedUser(user)} title="Click to view full profile">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold hover:shadow-md transition-shadow">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="ml-4 hover:text-blue-600 transition-colors">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                            user.role === 'teacher' ? 'bg-purple-100 text-purple-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role === 'student' ? (
                          <>
                            <div>{user.className} - Sec {user.section}</div>
                            <div className="text-xs">Roll: {user.rollNumber}</div>
                          </>
                        ) : user.role === 'teacher' ? (
                          <>
                            <div>{user.designation || 'Staff'}</div>
                            <div className="text-xs">Sub: {user.subjectHandled || 'N/A'}</div>
                          </>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {(isSuperAdmin ? user.id !== loggedInUser.id : user.role === 'student') && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors inline-flex items-center"
                            title="Remove User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-fade-in-up">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center text-white">
              <h3 className="text-xl font-bold">User Profile</h3>
              <button className="text-white hover:text-gray-200 focus:outline-none" onClick={() => setSelectedUser(null)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-2xl shadow-inner">
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="ml-5">
                  <h4 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h4>
                  <span className={`px-3 py-1 mt-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${selectedUser.role === 'admin' ? 'bg-red-100 text-red-800' : 
                      selectedUser.role === 'teacher' ? 'bg-purple-100 text-purple-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {selectedUser.role.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</h5>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                </div>

                {selectedUser.role === 'student' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</h5>
                        <p className="mt-1 text-sm text-gray-900">{selectedUser.className || 'N/A'}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Section</h5>
                        <p className="mt-1 text-sm text-gray-900">{selectedUser.section || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Roll Number</h5>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.rollNumber || 'N/A'}</p>
                    </div>
                  </>
                )}

                {selectedUser.role === 'teacher' && (
                  <>
                    <div>
                      <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Designation</h5>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.designation || 'N/A'}</p>
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject Handled</h5>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.subjectHandled || 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button 
                onClick={() => setSelectedUser(null)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}
