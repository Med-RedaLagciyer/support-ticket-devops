import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTicket, updateTicket } from '@/services/ticketService'
import { getComments, createComment } from '@/services/ticketService'
import useAuthStore from '@/store/authStore'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export default function TicketDetail() {
    const { id } = useParams()
    const { token, user } = useAuthStore()
    const navigate = useNavigate()
    const [ticket, setTicket] = useState(null)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [error, setError] = useState(null)

    const isAgentOrAdmin = user?.roles?.includes('ROLE_AGENT') || user?.roles?.includes('ROLE_ADMIN')

    useEffect(() => {
        const load = async () => {
            try {
                const [ticketRes, commentsRes] = await Promise.all([
                    getTicket(token, id),
                    getComments(token, id),
                ])
                setTicket(ticketRes.data)
                setComments(commentsRes.data)
            } catch {
                setError('Failed to load ticket')
            }
        }
        load()
    }, [token, id])

    const handleStatusChange = async (status) => {
        try {
            const res = await updateTicket(token, id, { status })
            setTicket(res.data)
        } catch {
            setError('Failed to update status')
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return
        try {
            const res = await createComment(token, id, newComment)
            setComments([...comments, res.data])
            setNewComment('')
        } catch {
            setError('Failed to add comment')
        }
    }

    if (!ticket) return <div className="p-8">Loading...</div>

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Button variant="outline" className="mb-6" onClick={() => navigate('/dashboard')}>
                ← Back
            </Button>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <h1 className="text-2xl font-bold mb-2">{ticket.title}</h1>
            <div className="flex gap-4 text-sm text-gray-500 mb-6">
                <span>By: {ticket.user.firstName} {ticket.user.lastName}</span>
                <span>Priority: {ticket.priority}</span>
                <span>Status: {ticket.status}</span>
                <span>Created: {ticket.createdAt}</span>
            </div>
            <p className="text-gray-700 mb-6">{ticket.description}</p>

            {isAgentOrAdmin && (
                <div className="border-t pt-4 mb-6">
                    <p className="text-sm font-medium mb-2">Update Status</p>
                    <Select value={ticket.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="border-t pt-4">
                <h2 className="font-semibold mb-4">Comments ({comments.length})</h2>
                <div className="space-y-3 mb-6">
                    {comments.map(comment => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm font-medium">{comment.author.firstName} {comment.author.lastName}</p>
                            <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                            <p className="text-xs text-gray-400 mt-1">{comment.createdAt}</p>
                        </div>
                    ))}
                    {comments.length === 0 && <p className="text-sm text-gray-400">No comments yet.</p>}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2">
                    <textarea
                        className="flex-1 border rounded-md p-2 text-sm min-h-16"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                    />
                    <Button type="submit">Send</Button>
                </form>
            </div>
        </div>
    )
}
