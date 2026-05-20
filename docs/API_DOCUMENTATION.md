# Guestly API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected endpoints require authentication via httpOnly cookies:
- `access_token` - JWT access token
- `refresh_token` - JWT refresh token
- `role` - User role (attendee, organiser, vendor, admin)
- `user_id` - User identifier

## Endpoints

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login with email and password |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/logout` | Logout and clear cookies |
| GET | `/api/auth/me` | Get current user profile |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/verify` | Verify email address |
| POST | `/api/auth/forgot` | Request password reset |

### Events

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/events` | List events (with filters) |
| GET | `/api/events/[id]` | Get event details |
| POST | `/api/events` | Create new event |
| PUT | `/api/events/[id]` | Update event |
| DELETE | `/api/events/[id]` | Delete event |
| GET | `/api/events/[id]/metrics` | Get event metrics |

### Orders

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/orders` | List orders |
| GET | `/api/orders/user` | Get user orders |
| POST | `/api/orders` | Create order |
| POST | `/api/orders/pay` | Process payment |
| POST | `/api/orders/[id]/refund` | Request refund |

### Vendors

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/vendors` | List vendors |
| GET | `/api/vendors/[id]` | Get vendor details |
| POST | `/api/vendors` | Create vendor profile |
| GET | `/api/vendors/invitations` | List invitations |

### Wallet

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/wallet` | Get wallet balance |
| POST | `/api/wallet/add` | Add funds |
| GET | `/api/wallet/transactions` | List transactions |
| POST | `/api/wallet/withdraw` | Request withdrawal |

### Search

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/search?q=...` | Search events |

### Cities

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/cities/[city]/stats` | Get city statistics |
| GET | `/api/cities/[city]/events` | Get city events |
| GET | `/api/cities/[city]/heatmap` | Get event heatmap data |

## WebSocket Events

### Connection

```
Path: /api/socket/io
```

### Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-event` | Client → Server | Join event room |
| `leave-event` | Client → Server | Leave event room |
| `send-message` | Client → Server | Send chat message |
| `new-message` | Server → Client | Receive chat message |
| `poll-created` | Client → Server | Create poll |
| `poll-voted` | Client → Server | Vote on poll |
| `qa-question` | Client → Server | Submit Q&A question |
| `reaction` | Client → Server | Send reaction |
| `room-state` | Server → Client | Current room state |
| `presence-update` | Server → Client | User presence changed |
