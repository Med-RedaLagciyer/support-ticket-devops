import axios from 'axios'

const auth = (token) => ({ headers: { Authorization: `Bearer ${token}` } })

export const getTickets = (token) =>
    axios.get('/api/tickets', auth(token))

export const getTicket = (token, id) =>
    axios.get(`/api/tickets/${id}`, auth(token))

export const createTicket = (token, data) =>
    axios.post('/api/tickets', data, auth(token))

export const updateTicket = (token, id, data) =>
    axios.patch(`/api/tickets/${id}`, data, auth(token))

export const deleteTicket = (token, id) =>
    axios.delete(`/api/tickets/${id}`, auth(token))

export const getComments = (token, ticketId) =>
    axios.get(`/api/tickets/${ticketId}/comments`, auth(token))

export const createComment = (token, ticketId, content) =>
    axios.post(`/api/tickets/${ticketId}/comments`, { content }, auth(token))
