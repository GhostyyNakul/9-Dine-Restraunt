import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import twilio from 'twilio';
import { FULL_MENU } from './src/data/restaurantData';

dotenv.config();

const app = express();
const PORT = 3000;

// Security Middleware & CORS
app.use(cors());
app.use(express.json());

// Basic Security & Rate Limit Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// MongoDB Connection & Mongoose Schemas
const mongoUri = process.env.MONGODB_URI;
let isMongoConnected = false;

if (mongoUri) {
  mongoose
    .connect(mongoUri, { serverSelectionTimeoutMS: 3000 })
    .then(() => {
      isMongoConnected = true;
      console.log('✅ Connected to MongoDB Database successfully');
    })
    .catch((err) => {
      isMongoConnected = false;
      console.warn('⚡ MongoDB Atlas connection deferred. Operating smoothly in local/memory mode:', err.message);
    });

  mongoose.connection.on('connected', () => {
    isMongoConnected = true;
  });
  mongoose.connection.on('disconnected', () => {
    isMongoConnected = false;
  });
  mongoose.connection.on('error', () => {
    isMongoConnected = false;
  });
}

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: String,
  customerPhone: String,
  customerEmail: String,
  items: Array,
  orderType: String,
  deliveryAddress: String,
  notes: String,
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: String,
  subtotal: Number,
  taxesAndService: Number,
  deliveryFee: Number,
  total: Number,
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: String,
  smsSentLog: [String]
});

const ReservationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  phone: String,
  email: String,
  date: String,
  time: String,
  guests: Number,
  seating: String,
  occasion: String,
  specialRequests: String,
  offerName: String,
  status: String,
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: String,
  smsSentLog: [String]
});

const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);
const ReservationModel = mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);

let twilioClient: ReturnType<typeof twilio> | null = null;
function getTwilio() {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    } catch (err) {
      console.warn('Twilio initialization skipped or failed:', err);
    }
  }
  return twilioClient;
}

// In-Memory Database Stores with Default Initial Data
let menuItemsStore = FULL_MENU.map((item) => ({
  ...item,
  available: item.available !== false
}));

let ordersStore: any[] = [];

let reservationsStore: any[] = [];

let customersStore: any[] = [];

let notificationsStore: any[] = [];

let adminSettings = {
  adminPhone: process.env.ADMIN_PHONE_NUMBER || '+919876543210',
  autoSmsCustomer: true,
  autoSmsAdmin: true,
  mongodbConfigured: !!process.env.MONGODB_URI,
  twilioConfigured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
};

// Helper: Send SMS via Twilio or fallback simulation
async function sendSMSNotification(to: string, messageText: string, isCustomerSMS = true) {
  const tw = getTwilio();
  const from = process.env.TWILIO_PHONE_NUMBER || '+15005550006';
  const timestamp = new Date().toISOString();

  if (tw && process.env.TWILIO_PHONE_NUMBER) {
    try {
      await tw.messages.create({
        body: messageText,
        from,
        to
      });
      console.log(`[Twilio SMS Sent] To: ${to} | Msg: ${messageText}`);
      return { success: true, mode: 'twilio', time: timestamp };
    } catch (err: any) {
      console.error(`[Twilio SMS Error] ${err?.message || err}`);
      return { success: false, error: err?.message, mode: 'failed', time: timestamp };
    }
  } else {
    console.log(`[SMS Simulation] To: ${to} | Body: ${messageText}`);
    return { success: true, mode: 'simulated', time: timestamp };
  }
}

// Helper: Google Sheets Sync (Skipped for now)
async function syncToGoogleSheets(type: 'orders' | 'reservations' | 'customers', recordData: any) {
  return { success: true, mode: 'skipped' };
}

// Helper: Customer Record Upsert
function upsertCustomer(name: string, phone: string, email: string, orderSpent = 0, isReservation = false) {
  let existing = customersStore.find(
    (c) => c.phone.trim() === phone.trim() || (email && c.email.toLowerCase() === email.toLowerCase())
  );

  if (existing) {
    if (orderSpent > 0) {
      existing.ordersCount += 1;
      existing.totalSpent += orderSpent;
    }
    if (isReservation) {
      existing.reservationsCount += 1;
    }
    existing.lastActive = new Date().toISOString();
  } else {
    existing = {
      id: `cust-${Date.now()}`,
      name,
      phone,
      email: email || 'N/A',
      ordersCount: orderSpent > 0 ? 1 : 0,
      reservationsCount: isReservation ? 1 : 0,
      totalSpent: orderSpent,
      lastActive: new Date().toISOString()
    };
    customersStore.unshift(existing);

    // Notify new customer
    notificationsStore.unshift({
      id: `notif-${Date.now()}`,
      type: 'new_customer',
      title: 'New Customer Registered',
      message: `${name} (${phone}) added to customer database.`,
      timestamp: new Date().toISOString(),
      read: false
    });
  }

  syncToGoogleSheets('customers', existing);
  return existing;
}

// API ROUTES

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    configStatus: {
      stripe: !!process.env.STRIPE_SECRET_KEY,
      twilio: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
      googleSheets: !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID
    }
  });
});

// Admin Auth Login
app.post('/api/admin/login', (req, res) => {
  const { email } = req.body;
  res.json({
    success: true,
    token: 'admin-session-token-7dine-secure',
    user: {
      uid: 'admin-uid-001',
      email: email || 'admin@example.com',
      displayName: 'Restaurant Administrator'
    }
  });
});

// GET Menu
app.get('/api/menu', (req, res) => {
  res.json({ success: true, menu: menuItemsStore });
});

// POST Menu Item
app.post('/api/menu', (req, res) => {
  const newItem = {
    id: `item-${Date.now()}`,
    name: req.body.name || 'Untitled Dish',
    price: Number(req.body.price) || 0,
    description: req.body.description || '',
    image: req.body.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    category: req.body.category || 'Main Course',
    tags: Array.isArray(req.body.tags) ? req.body.tags : ['Chef Special'],
    dietary: req.body.dietary || 'veg',
    isChefSpecial: !!req.body.isChefSpecial,
    available: true
  };
  menuItemsStore.unshift(newItem);
  res.json({ success: true, item: newItem });
});

// PUT Edit Menu Item
app.put('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const idx = menuItemsStore.findIndex((m) => m.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, message: 'Item not found' });
    return;
  }
  menuItemsStore[idx] = { ...menuItemsStore[idx], ...req.body };
  res.json({ success: true, item: menuItemsStore[idx] });
});

// DELETE Menu Item
app.delete('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  menuItemsStore = menuItemsStore.filter((m) => m.id !== id);
  res.json({ success: true, message: 'Item removed' });
});

// PATCH Toggle Availability
app.patch('/api/menu/:id/toggle', (req, res) => {
  const { id } = req.params;
  const idx = menuItemsStore.findIndex((m) => m.id === id);
  if (idx !== -1) {
    menuItemsStore[idx].available = !menuItemsStore[idx].available;
    res.json({ success: true, item: menuItemsStore[idx] });
  } else {
    res.status(404).json({ success: false, message: 'Item not found' });
  }
});

// GET Orders
app.get('/api/orders', (req, res) => {
  const { search, status } = req.query;
  let result = [...ordersStore];

  if (status && status !== 'all') {
    result = result.filter((o) => o.orderStatus?.toLowerCase() === (status as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    result = result.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
    );
  }

  res.json({ success: true, orders: result });
});

// POST Create Order (Order Flow)
app.post('/api/orders', async (req, res) => {
  const code = Math.floor(10000 + Math.random() * 90000);
  const orderId = req.body.id || `7D-ORD-${code}`;

  const newOrder = {
    id: orderId,
    customerName: req.body.customerName,
    customerPhone: req.body.customerPhone,
    customerEmail: req.body.customerEmail || '',
    items: req.body.items || [],
    orderType: req.body.orderType || 'delivery',
    deliveryAddress: req.body.deliveryAddress || '',
    notes: req.body.notes || '',
    paymentMethod: req.body.paymentMethod || 'cash_on_delivery',
    paymentStatus: req.body.paymentStatus || 'Pending',
    orderStatus: 'Pending',
    subtotal: req.body.subtotal || 0,
    taxesAndService: req.body.taxesAndService || 0,
    deliveryFee: req.body.deliveryFee || 0,
    total: req.body.total || 0,
    createdAt: new Date().toISOString(),
    smsSentLog: []
  };

  ordersStore.unshift(newOrder);

  // Save to MongoDB if connected
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    try {
      await OrderModel.create(newOrder);
    } catch (err: any) {
      console.warn('Error saving order to MongoDB:', err?.message);
    }
  }

  // 1. Sync to Google Sheets
  await syncToGoogleSheets('orders', newOrder);

  // 2. Customer Record
  upsertCustomer(
    newOrder.customerName,
    newOrder.customerPhone,
    newOrder.customerEmail,
    newOrder.total,
    false
  );

  // 3. Customer Confirmation SMS
  const customerSmsText = `7 Dine Order Confirmed! Reference: ${newOrder.id}. Amount: ₹${newOrder.total}. Your gourmet meal is being prepared. Thank you for dining with us!`;
  const custSmsRes = await sendSMSNotification(newOrder.customerPhone, customerSmsText, true);
  if (custSmsRes.success) {
    newOrder.smsSentLog.push(`Customer Confirmation SMS (${custSmsRes.mode})`);
  }

  // 4. Admin SMS Notification
  const adminSmsText = `🔔 NEW ORDER ALERT (#${newOrder.id}): ${newOrder.customerName} placed a ${newOrder.orderType} order for ₹${newOrder.total}. Status: ${newOrder.paymentStatus}.`;
  const adminSmsRes = await sendSMSNotification(adminSettings.adminPhone, adminSmsText, false);
  if (adminSmsRes.success) {
    newOrder.smsSentLog.push(`Admin Alert SMS (${adminSmsRes.mode})`);
  }

  // 5. Admin Real-Time Notification
  notificationsStore.unshift({
    id: `notif-${Date.now()}`,
    type: 'new_order',
    title: `New Order Received (#${newOrder.id})`,
    message: `${newOrder.customerName} placed a ${newOrder.orderType} order worth ₹${newOrder.total}.`,
    timestamp: new Date().toISOString(),
    read: false,
    referenceId: newOrder.id
  });

  res.json({ success: true, order: newOrder });
});

// PATCH Order Status Update
app.patch('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  const order = ordersStore.find((o) => o.id === id);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  if (status) order.orderStatus = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  order.updatedAt = new Date().toISOString();

  // Send status update SMS to customer
  let statusSmsMessage = '';
  switch (status) {
    case 'Accepted':
      statusSmsMessage = `Your 7 Dine order #${order.id} has been accepted by the chef!`;
      break;
    case 'Preparing':
      statusSmsMessage = `Master chefs are preparing order #${order.id} with fresh ingredients.`;
      break;
    case 'Ready':
      statusSmsMessage = `Order #${order.id} is ready for pick up / dispatch!`;
      break;
    case 'Out for Delivery':
      statusSmsMessage = `Gourmet Order #${order.id} is out for delivery with our executive express courier.`;
      break;
    case 'Delivered':
    case 'Completed':
      statusSmsMessage = `Order #${order.id} delivered! Enjoy your meal from 7 Dine.`;
      break;
    case 'Cancelled':
    case 'Rejected':
      statusSmsMessage = `Notice: Order #${order.id} has been cancelled. Please contact 7 Dine support for assistance.`;
      break;
  }

  if (statusSmsMessage) {
    const smsRes = await sendSMSNotification(order.customerPhone, statusSmsMessage, true);
    if (smsRes.success) {
      if (!order.smsSentLog) order.smsSentLog = [];
      order.smsSentLog.push(`Status Updated to ${status} (${smsRes.mode})`);
    }
  }

  // Update in Google Sheets
  await syncToGoogleSheets('orders', order);

  res.json({ success: true, order });
});

// DELETE Order / Cancel Order
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const idx = ordersStore.findIndex((o) => o.id === id);

  if (idx !== -1) {
    const order = ordersStore[idx];
    order.orderStatus = 'Cancelled';
    order.updatedAt = new Date().toISOString();

    // Trigger Admin Cancelled Notification
    notificationsStore.unshift({
      id: `notif-${Date.now()}`,
      type: 'cancelled_order',
      title: `Order Cancelled (#${order.id})`,
      message: `Order #${order.id} by ${order.customerName} was cancelled.`,
      timestamp: new Date().toISOString(),
      read: false,
      referenceId: order.id
    });

    // Send SMS
    await sendSMSNotification(
      order.customerPhone,
      `Your 7 Dine order #${order.id} has been cancelled.`,
      true
    );

    res.json({ success: true, message: 'Order cancelled', order });
  } else {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
});

// GET Reservations
app.get('/api/reservations', (req, res) => {
  res.json({ success: true, reservations: reservationsStore });
});

// POST Create Reservation (Reservation Flow)
app.post('/api/reservations', async (req, res) => {
  const code = Math.floor(1000 + Math.random() * 9000);
  const resId = req.body.id || `7D-${code}`;

  const newRes = {
    id: resId,
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    date: req.body.date,
    time: req.body.time,
    guests: req.body.guests || 2,
    seating: req.body.seating || 'Main Dining Room',
    occasion: req.body.occasion || undefined,
    specialRequests: req.body.specialRequests || undefined,
    offerName: req.body.offerName || undefined,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    smsSentLog: []
  };

  reservationsStore.unshift(newRes);

  // 1. Google Sheets Sync
  await syncToGoogleSheets('reservations', newRes);

  // 2. Customer record
  upsertCustomer(newRes.name, newRes.phone, newRes.email, 0, true);

  // 3. Customer Confirmation SMS
  const custSms = `7 Dine Reservation Request #${newRes.id} Received for ${newRes.date} at ${newRes.time} (${newRes.guests} guests). We will confirm your table shortly!`;
  const smsRes = await sendSMSNotification(newRes.phone, custSms, true);
  if (smsRes.success) {
    newRes.smsSentLog.push(`Confirmation Request SMS (${smsRes.mode})`);
  }

  // 4. Admin SMS Alert
  const adminSms = `🍷 NEW RESERVATION (#${newRes.id}): ${newRes.name} for ${newRes.guests} guests on ${newRes.date} @ ${newRes.time} (${newRes.seating}).`;
  await sendSMSNotification(adminSettings.adminPhone, adminSms, false);

  // 5. Admin Notification
  notificationsStore.unshift({
    id: `notif-${Date.now()}`,
    type: 'new_reservation',
    title: `New Reservation Request (#${newRes.id})`,
    message: `${newRes.name} requested table for ${newRes.guests} guests on ${newRes.date} at ${newRes.time}.`,
    timestamp: new Date().toISOString(),
    read: false,
    referenceId: newRes.id
  });

  res.json({ success: true, reservation: newRes });
});

// PATCH Reservation Status
app.patch('/api/reservations/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, date, time, guests, seating } = req.body;

  const resItem = reservationsStore.find((r) => r.id === id);
  if (!resItem) {
    res.status(404).json({ success: false, message: 'Reservation not found' });
    return;
  }

  if (status) resItem.status = status;
  if (date) resItem.date = date;
  if (time) resItem.time = time;
  if (guests) resItem.guests = guests;
  if (seating) resItem.seating = seating;
  resItem.updatedAt = new Date().toISOString();

  // Send status update SMS
  let smsBody = '';
  if (status === 'Approved' || status === 'Confirmed') {
    smsBody = `Great news! Your 7 Dine reservation #${resItem.id} for ${resItem.date} at ${resItem.time} is CONFIRMED. We look forward to welcoming you!`;
  } else if (status === 'Rejected' || status === 'Cancelled') {
    smsBody = `Notice: Reservation #${resItem.id} at 7 Dine could not be confirmed for ${resItem.date}. Please call us to reschedule.`;
  }

  if (smsBody) {
    const sRes = await sendSMSNotification(resItem.phone, smsBody, true);
    if (sRes.success) {
      if (!resItem.smsSentLog) resItem.smsSentLog = [];
      resItem.smsSentLog.push(`Status Updated to ${status} (${sRes.mode})`);
    }
  }

  // Google Sheets sync
  await syncToGoogleSheets('reservations', resItem);

  res.json({ success: true, reservation: resItem });
});

// DELETE Reservation
app.delete('/api/reservations/:id', async (req, res) => {
  const { id } = req.params;
  reservationsStore = reservationsStore.filter((r) => r.id !== id);
  res.json({ success: true, message: 'Reservation deleted' });
});

// GET Customers
app.get('/api/customers', (req, res) => {
  res.json({ success: true, customers: customersStore });
});

// GET Notifications
app.get('/api/notifications', (req, res) => {
  res.json({ success: true, notifications: notificationsStore });
});

// PATCH Read Notifications
app.patch('/api/notifications/read-all', (req, res) => {
  notificationsStore.forEach((n) => (n.read = true));
  res.json({ success: true, notifications: notificationsStore });
});

// GET Admin Settings
app.get('/api/settings', (req, res) => {
  adminSettings.mongodbConfigured = isMongoConnected && mongoose.connection.readyState === 1;
  adminSettings.twilioConfigured = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
  res.json({ success: true, settings: adminSettings });
});

// POST Update Settings
app.post('/api/settings', (req, res) => {
  if (req.body.adminPhone) {
    adminSettings.adminPhone = req.body.adminPhone;
  }
  if (req.body.autoSmsCustomer !== undefined) {
    adminSettings.autoSmsCustomer = !!req.body.autoSmsCustomer;
  }
  if (req.body.autoSmsAdmin !== undefined) {
    adminSettings.autoSmsAdmin = !!req.body.autoSmsAdmin;
  }
  res.json({ success: true, settings: adminSettings });
});

// Vite Middleware & Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`7 Dine Restaurant Management System running on http://localhost:${PORT}`);
  });
}

startServer();
