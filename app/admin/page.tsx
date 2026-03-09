'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'PROFESSOR' | 'ADMIN';
    department: string;
    accountCreatedAt: string;
    rating: number;
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('ALL');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/welcome');
        }
    }, [status, router]);

    useEffect(() => {
        const checkAdminAndFetchUsers = async () => {
            if (!session?.user?.email) return;

            try {
                // Check if user is admin
                const userRes = await fetch(`/api/forProfile/byEmail/${session.user.email}`);
                const userData = await userRes.json();

                if (userData.role !== 'ADMIN') {
                    router.push('/dashboard');
                    return;
                }

                setIsAdmin(true);

                // Fetch all users
                const usersRes = await fetch('/api/admin/users');
                const usersData = await usersRes.json();
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            checkAdminAndFetchUsers();
        }
    }, [session, status, router]);

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const res = await fetch('/api/admin/update-role', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, newRole }),
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || 'Failed to update role');
                return;
            }

            // Update local state
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
            alert('Role updated successfully!');
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'ALL' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader />
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage users and assign roles</p>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="w-full md:w-48 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="ALL">All Roles</option>
                                <option value="USER">Students</option>
                                <option value="PROFESSOR">Professors</option>
                                <option value="ADMIN">Admins</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <p className="text-gray-600 text-sm">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <p className="text-gray-600 text-sm">Students</p>
                        <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'USER').length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <p className="text-gray-600 text-sm">Professors</p>
                        <p className="text-2xl font-bold text-green-600">{users.filter(u => u.role === 'PROFESSOR').length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <p className="text-gray-600 text-sm">Admins</p>
                        <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'ADMIN').length}</p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rating
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.department}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.rating}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.role === 'ADMIN'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : user.role === 'PROFESSOR'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                disabled={user.email === session?.user?.email}
                                            >
                                                <option value="USER">Student</option>
                                                <option value="PROFESSOR">Professor</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No users found</p>
                        </div>
                    )}
                </div>

                {/* Back to Dashboard */}
                <div className="mt-6">
                    <Button
                        onClick={() => router.push('/dashboard')}
                        className="bg-gray-900 hover:bg-gray-700"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}
