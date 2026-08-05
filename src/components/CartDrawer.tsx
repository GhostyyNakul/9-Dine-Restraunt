import { useState, FormEvent } from 'react';
import { CartItem } from '../types';
import { apiService } from '../services/apiService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenFullMenu: () => void;
  onOrderPlaced?: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenFullMenu,
  onOrderPlaced
}: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment' | 'success'>('cart');
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'upi_on_delivery' | 'pay_at_restaurant'>('cash_on_delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('***');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const taxesAndService = Math.round(subtotal * 0.12);
  const deliveryFee = orderType === 'delivery' ? 100 : 0;
  const total = subtotal + taxesAndService + deliveryFee;

  const handleDetailsNext = (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim()) return;
    setCheckoutStep('payment');
  };

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const itemsFormatted = cart.map((ci) => ({
        id: ci.menuItem.id,
        name: ci.menuItem.name,
        price: ci.menuItem.price,
        quantity: ci.quantity
      }));

      const response = await apiService.placeOrder({
        customerName,
        customerPhone,
        customerEmail,
        items: itemsFormatted,
        orderType,
        deliveryAddress,
        notes,
        paymentMethod,
        paymentStatus: 'Pending',
        subtotal,
        taxesAndService,
        deliveryFee,
        total
      });

      if (response.success && response.order) {
        setPlacedOrderId(response.order.id);
        try {
          localStorage.removeItem('7dine_cart');
        } catch {
          // ignore
        }
        onClearCart();
        if (onOrderPlaced) onOrderPlaced();
        setCheckoutStep('success');
      }
    } catch (err) {
      console.error('Order placement error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    onClearCart();
    setCheckoutStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0e0e]/80 backdrop-blur-md flex justify-end">
      <div className="bg-[#1c1b1b] border-l border-[#f2ca50]/20 w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#4d4635]/40 flex justify-between items-center bg-[#131313]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#f2ca50]">shopping_bag</span>
            <h3 className="font-headline-md text-xl text-[#e5e2e1]">Your Gourmet Order</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#d0c5af] hover:text-[#f2ca50] focus:outline-none"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* CART STEP */}
        {checkoutStep === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-[#d0c5af] my-12">
                  <span className="material-symbols-outlined text-5xl text-[#4d4635]">
                    restaurant
                  </span>
                  <p className="font-body-md text-lg text-[#e5e2e1]">Your Order is Empty</p>
                  <p className="text-xs max-w-xs text-[#d0c5af]">
                    Explore our Chef's Specials or complete menu to select exquisite dishes.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenFullMenu();
                    }}
                    className="bg-[#f2ca50] text-[#3c2f00] px-6 py-3 rounded-full font-label-caps text-xs uppercase tracking-widest mt-2 hover:opacity-90 transition-opacity font-semibold shadow-md"
                  >
                    Browse Gourmet Menu
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.menuItem.id}
                    className="glass-card p-4 flex gap-4 items-center justify-between border border-[#4d4635]/40 bg-[#131313]/60 rounded-xl"
                  >
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-headline-md text-[#e5e2e1] truncate">
                        {item.menuItem.name}
                      </h4>
                      <p className="text-xs text-[#f2ca50] font-price-display mt-0.5">
                        ₹{item.menuItem.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#4d4635] bg-[#201f1f] rounded-lg overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.menuItem.id, -1)}
                          className="px-2.5 py-1 text-xs text-[#d0c5af] hover:text-[#f2ca50]"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-[#e5e2e1]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.menuItem.id, 1)}
                          className="px-2.5 py-1 text-xs text-[#d0c5af] hover:text-[#f2ca50]"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.menuItem.id)}
                        className="text-[#ffb4ab] hover:text-red-400 p-1"
                        aria-label="Remove item"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer Summary */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#4d4635]/40 bg-[#131313] space-y-3">
                <div className="space-y-1.5 text-xs text-[#d0c5af]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#e5e2e1]">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST & Service Fee (12%)</span>
                    <span className="text-[#e5e2e1]">₹{taxesAndService}</span>
                  </div>
                  <div className="flex justify-between font-headline-md text-base text-[#f2ca50] pt-2 border-t border-[#4d4635]/40">
                    <span>Total Amount</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutStep('details')}
                  className="w-full bg-[#f2ca50] text-[#3c2f00] py-3.5 rounded-full font-label-caps text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Proceed to Delivery Details</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* DETAILS STEP */}
        {checkoutStep === 'details' && (
          <form onSubmit={handleDetailsNext} className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="text-xs text-[#f2ca50] font-label-caps flex items-center gap-1 hover:underline mb-2"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Cart
              </button>

              {/* Order Mode Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#131313] border border-[#4d4635] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`py-2 text-xs font-label-caps transition-all rounded-lg ${
                    orderType === 'delivery'
                      ? 'bg-[#f2ca50] text-[#3c2f00] font-bold shadow-sm'
                      : 'text-[#d0c5af]'
                  }`}
                >
                  Gourmet Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`py-2 text-xs font-label-caps transition-all rounded-lg ${
                    orderType === 'takeaway'
                      ? 'bg-[#f2ca50] text-[#3c2f00] font-bold shadow-sm'
                      : 'text-[#d0c5af]'
                  }`}
                >
                  Restaurant Takeaway
                </button>
              </div>

              <div>
                <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] px-4 py-2.5 text-sm outline-none rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] px-4 py-2.5 text-sm outline-none rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] px-4 py-2.5 text-sm outline-none rounded-xl"
                />
              </div>

              {orderType === 'delivery' && (
                <div>
                  <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Complete address in Yamuna Vihar / Delhi region"
                    className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] p-3 text-sm outline-none rounded-xl"
                  ></textarea>
                </div>
              )}

              <div>
                <label className="block text-xs font-label-caps text-[#d0c5af] mb-1">
                  Chef Preparation Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Extra spicy, no cutlery needed..."
                  className="w-full bg-[#131313] border border-[#4d4635] focus:border-[#f2ca50] text-[#e5e2e1] px-4 py-2.5 text-sm outline-none rounded-xl"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-[#4d4635]/40 mt-6 space-y-3">
              <div className="flex justify-between font-headline-md text-lg text-[#f2ca50]">
                <span>Total Payable</span>
                <span>₹{total}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#f2ca50] text-[#3c2f00] py-3.5 rounded-full font-label-caps text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Payment Method</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </form>
        )}

        {/* PAYMENT STEP */}
        {checkoutStep === 'payment' && (
          <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col justify-between p-6 overflow-y-auto space-y-4">
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setCheckoutStep('details')}
                className="text-xs text-[#f2ca50] font-label-caps flex items-center gap-1 hover:underline mb-2"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Details
              </button>

              <h3 className="font-headline-md text-lg text-[#f2ca50]">Select Payment Method</h3>

              <div className="space-y-2">
                <label
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'bg-[#1c1b1b] border-[#f2ca50] text-[#f2ca50]'
                      : 'bg-[#131313] border-[#4d4635] text-[#d0c5af]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">payments</span>
                    <div>
                      <div className="text-xs font-bold text-[#e5e2e1]">Cash on Delivery (COD)</div>
                      <div className="text-[10px] text-[#d0c5af]">Pay with cash when your order arrives</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="pm"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="accent-[#f2ca50]"
                  />
                </label>

                <label
                  onClick={() => setPaymentMethod('upi_on_delivery')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi_on_delivery'
                      ? 'bg-[#1c1b1b] border-[#f2ca50] text-[#f2ca50]'
                      : 'bg-[#131313] border-[#4d4635] text-[#d0c5af]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                    <div>
                      <div className="text-xs font-bold text-[#e5e2e1]">UPI QR on Delivery</div>
                      <div className="text-[10px] text-[#d0c5af]">Scan QR code via Google Pay, PhonePe, or Paytm</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="pm"
                    checked={paymentMethod === 'upi_on_delivery'}
                    onChange={() => setPaymentMethod('upi_on_delivery')}
                    className="accent-[#f2ca50]"
                  />
                </label>

                <label
                  onClick={() => setPaymentMethod('pay_at_restaurant')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'pay_at_restaurant'
                      ? 'bg-[#1c1b1b] border-[#f2ca50] text-[#f2ca50]'
                      : 'bg-[#131313] border-[#4d4635] text-[#d0c5af]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">storefront</span>
                    <div>
                      <div className="text-xs font-bold text-[#e5e2e1]">Pay at Counter / Restaurant</div>
                      <div className="text-[10px] text-[#d0c5af]">Ideal for takeaway & direct pickups</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="pm"
                    checked={paymentMethod === 'pay_at_restaurant'}
                    onChange={() => setPaymentMethod('pay_at_restaurant')}
                    className="accent-[#f2ca50]"
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#4d4635]/40 space-y-3">
              <div className="flex justify-between font-headline-md text-lg text-[#f2ca50]">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f2ca50] text-[#3c2f00] py-3.5 rounded-full font-label-caps text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Processing Payment & Dispatching...</span>
                ) : (
                  <>
                    <span>Confirm & Pay ₹{total}</span>
                    <span className="material-symbols-outlined text-sm">lock</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* SUCCESS STEP */}
        {checkoutStep === 'success' && (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#005736] text-[#82cba0] flex items-center justify-center border border-[#82cba0]/40 shadow-lg">
              <span className="material-symbols-outlined text-3xl">restaurant</span>
            </div>

            <div>
              <h3 className="font-headline-md text-2xl text-[#f2ca50]">Order Received!</h3>
              <p className="text-xs text-[#d0c5af] mt-1 font-body-md">
                Our master chefs are preparing your dishes with precision.
              </p>
            </div>

            <div className="glass-card p-4 border border-[#f2ca50]/30 w-full text-left space-y-2 text-xs bg-[#131313] rounded-2xl shadow-xl">
              <div className="flex justify-between">
                <span className="text-[#d0c5af]">Order Reference:</span>
                <span className="text-[#f2ca50] font-bold">{placedOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#d0c5af]">Status:</span>
                <span className="text-[#8dd6ab] font-semibold">Kitchen Preparing</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#d0c5af]">Est. Time:</span>
                <span className="text-[#e5e2e1]">30 - 45 Mins</span>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className="bg-[#f2ca50] text-[#3c2f00] px-8 py-3.5 rounded-full font-label-caps text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity shadow-md"
            >
              Close & Enjoy
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
