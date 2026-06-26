import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import { Button } from '@/components/ui/button'

export default function Navbar() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="border-b px-8 py-3 flex justify-between items-center">
            <span className="font-semibold">Support Tickets</span>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                    {user?.email} — {user?.roles?.[0]}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </nav>
    )
}
