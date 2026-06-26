import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getTickets, deleteTicket } from '@/services/ticketService'
import useAuthStore from '@/store/authStore'
import { Button } from '@/components/ui/button'

export default function TicketList() {
    const navigate = useNavigate()
    const [tickets, setTickets] = useState([])
    const [error, setError] = useState(null)

    const { token, user } = useAuthStore()
    const isAgent = user?.roles?.includes('ROLE_AGENT')
    // const isAdmin = user?.roles?.includes('ROLE_ADMIN')


    useEffect(() => {
        const load = async () => {
            try {
                const res = await getTickets(token)
                setTickets(res.data)
            } catch {
                setError('Failed to load tickets')
            }
        }
        load()
    }, [token])

    const handleDelete = async (id) => {
        try {
            await deleteTicket(token, id)
            setTickets(tickets.filter(t => t.id !== id))
        } catch {
            setError('Failed to delete ticket')
        }
    }

    const priorityColor = {
        low: 'text-green-600',
        medium: 'text-yellow-600',
        high: 'text-red-600',
    }

    const statusColor = {
        open: 'bg-blue-100 text-blue-700',
        'in_progress': 'bg-yellow-100 text-yellow-700',
        resolved: 'bg-green-100 text-green-700',
        closed: 'bg-gray-100 text-gray-700',
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tickets</h1>
                {!isAgent && (
                    <Button onClick={() => navigate('/tickets/new')}>New Ticket</Button>
                )}
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-3">
                {tickets.map(ticket => (
                    <div key={ticket.id} className="border rounded-lg p-4 flex justify-between items-start">
                        <div>
                            <Link to={`/tickets/${ticket.id}`} className="font-semibold hover:underline">
                                {ticket.title}
                            </Link>
                            <p className="text-sm text-gray-500 mt-1">
                                {ticket.user.firstName} {ticket.user.lastName} · {ticket.createdAt}
                            </p>
                            <p className={`text-sm font-medium mt-1 ${priorityColor[ticket.priority]}`}>
                                Priority: {ticket.priority}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[ticket.status]}`}>
                                {ticket.status}
                            </span>
                            {!isAgent && (
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(ticket.id)}>
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
                {tickets.length === 0 && <p className="text-gray-500">No tickets yet.</p>}
            </div>
        </div>
    )
}
