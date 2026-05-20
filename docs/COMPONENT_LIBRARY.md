# Guestly Component Library

## UI Components

### Button
```tsx
import Button from "@/components/Button";
<Button variant="primary" onClick={handleClick}>Click me</Button>
```

Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`

### Card
```tsx
import Card from "@/components/ui/Card";
<Card title="Title" description="Description">{children}</Card>
```

### Icon
```tsx
import Icon from "@/components/ui/Icon";
<Icon name="calendar" size={24} />
```

### EmptyState
```tsx
import EmptyState from "@/components/ui/EmptyState";
<EmptyState title="No results" description="Try a different search" />
```

## Layout Components

- `TopNav` - Top navigation bar
- `BottomNav` - Mobile bottom navigation
- `Footer` - Site footer
- `Sidebar` - Dashboard sidebar
- `AttendeeSidebar` - Attendee dashboard sidebar
- `VendorSidebar` - Vendor dashboard sidebar
- `AdminSidebar` - Admin dashboard sidebar

## Feature Components

### Events
- `EventCard` - Event listing card
- `EventHero` - Event detail hero section
- `SearchBar` - Event search
- `CategoryFilter` - Category filtering
- `TimeFilter` - Time range filtering
- `CommunityFilter` - Community filtering

### Virtual Events
- `VirtualLobbyClient` - Virtual event lobby
- `StreamEmbed` - Video stream embed
- `ChatPanel` - Live chat
- `ReactionBar` - Emoji reactions
- `PollPanel` - Live polls
- `QAPanel` - Q&A panel

### Wallet
- `WalletCard` - Wallet balance display
- `AddFundsForm` - Add funds form
- `TransactionItem` - Transaction list item
- `SavingsProgressBar` - Savings progress
- `GroupSavingsCard` - Group savings card
- `CryptoPaymentUI` - Crypto payment interface

### Marketing (50+ components)
- Campaign builder and management
- Email/SMS/Push notification forms
- Social media connectors
- Referral dashboards
- A/B testing tools
- Analytics panels
