import { useEffect, useState } from 'react'
import axios from 'axios'
import useAuthStore from '@/store/authStore'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export default function AdminDashboard() {
    const { token } = useAuthStore()
    const [users, setUsers] = useState([])
    const [error, setError] = useState(null)

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` },
            })
            setUsers(res.data)
        } catch {
            setError('Failed to load users')
        }
    }

    const updateRole = async (id, role) => {
        try {
            await axios.patch(`/api/admin/users/${id}/role`, { role }, {
                headers: { Authorization: `Bearer ${token}` },
            })
            fetchUsers()
        } catch {
            setError('Failed to update role')
        }
    }

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get('/api/admin/users', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setUsers(res.data)
            } catch {
                setError('Failed to load users')
            }
        }
        load()
    }, [token])


    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-2 px-4">Name</th>
                        <th className="text-left py-2 px-4">Email</th>
                        <th className="text-left py-2 px-4">Role</th>
                        <th className="text-left py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4">{user.firstName} {user.lastName}</td>
                            <td className="py-2 px-4">{user.email}</td>
                            <td className="py-2 px-4">{user.roles[0]}</td>
                            <td className="py-2 px-4">
                                <Select onValueChange={(role) => updateRole(user.id, role)}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Change role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ROLE_USER">User</SelectItem>
                                        <SelectItem value="ROLE_AGENT">Agent</SelectItem>
                                        <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
