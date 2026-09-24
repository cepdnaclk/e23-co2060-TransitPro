# TransitPRO Booking Setup

## Backend

From `code/backend`:

1. Create `.env`:

```env
MONGO_URL=mongodb+srv://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_CLUSTER.mongodb.net/test?retryWrites=true&w=majority
PORT=5001
```

2. Run:

```bash
npm install
npm run dev
```

3. Verify in a browser:

`http://localhost:5001/api/health`

Expected:

```json
{"ok":true,"database":true}
```

## Frontend

From `code/frontend`:

1. Create `.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

2. Run:

```bash
npm install
npm run dev
```

## Booking test

1. Open a route.
2. Open its booking page.
3. Select a future date.
4. Select one or more available seats.
5. Enter customer name and contact.
6. Enter pickup location.
7. Click Confirm My Booking.

The browser sends the request to:

`POST http://localhost:5001/api/bookings`

If a seat was already booked for that route/date, the backend returns HTTP 409 and the seat map is refreshed.

## Admin approval and trip manifest

1. Open Admin Portal -> Bookings.
2. Pending bookings can be Approved or Rejected. Completed is available only after approval.
3. Open Admin Portal -> Trip Manifest.
4. Select a route and travel date, then Generate Manifest.
5. The manifest contains confirmed (Approved/Completed) bookings by default. Use Include pending bookings only when needed.
6. Occupancy is calculated from passenger seat quantity and the selected vehicle capacity.
7. Use Print or PDF to produce an operational passenger list.

## Passenger gender categorisation
Trip bookings now require a passenger gender (Male or Female). The admin Booking Control Center provides All/Male/Female filters, and the Trip Passenger Manifest shows male/female passenger counts and gender per passenger. Gender is also included on the digital ticket.
