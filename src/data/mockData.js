import dish1 from '../assets/dishes/dish-1.jpg';
import dish3 from '../assets/dishes/dish-3.jpg';
import dish9 from '../assets/dishes/dish-9.jpg';
import dish11 from '../assets/dishes/dish-11.jpg';

export const demoUsers = [
  {
    id: "usr-admin-1",
    name: "Chef Antoine Blanc",
    nameAr: "أنطوان بلان",
    email: "admin@savoria.com",
    password: "admin123",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80",
    phone: "+1 (555) 019-2834"
  },
  {
    id: "usr-cust-1",
    name: "Elena Rostova",
    nameAr: "إيلينا روستوفا",
    email: "guest@savoria.com",
    password: "guest123",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    phone: "+1 (555) 438-9201"
  }
];

export const validCoupons = {
  "SAVOR10": { discountPercent: 10, minSpend: 30, description: "10% off on orders over $30" },
  "FEAST20": { discountPercent: 20, minSpend: 60, description: "20% off on orders over $60" },
  "WELCOME15": { discountPercent: 15, minSpend: 25, description: "15% off welcome gift" }
};

export const initialTestimonials = [
  {
    id: 1,
    name: "Marcus Vance",
    nameAr: "ماركوس فانس",
    role: "Culinary Editor, Epicurean Post",
    roleAr: "محرر طهي، إيبيكيوريان بوست",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    text: "The Truffle Ribeye at Savoria is nothing short of celestial. A masterclass in heat, smoke, and exquisite richness.",
    textAr: "طبق ستيك ريب آي بالترافل في سافوريا هو عمل فني حقيقي. تجربة مبهرة تجمع بين دفء الطهي والحرارة والنكهات الاستثنائية.",
    date: "March 2026"
  },
  {
    id: 2,
    name: "Sophia Al-Mansoor",
    nameAr: "صوفيا المنصور",
    role: "Lifestyle Blogger & Foodie",
    roleAr: "مدونة أسلوب حياة وناقدة طعام",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    text: "From the delicate sea bass to the handcrafted cannoli, Savoria creates a multisensory experience that lingers long after you leave.",
    textAr: "من سمك القاروص الرقيق إلى الكانولي المصنوع يدوياً، يقدم سافوريا تجربة حسية فريدة تدوم في الذاكرة طويلاً.",
    date: "February 2026"
  },
  {
    id: 3,
    name: "David Chen",
    nameAr: "ديفيد تشن",
    role: "Private Sommelier",
    roleAr: "خبير ضيافة ومشروبات",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    text: "The botanical spritz mocktails pair flawlessly with their wood-fired dishes. Truly rare dining sophistication.",
    textAr: "الموكتيلات الفوارة العشبية تتناغم بسلاسة مطلقة مع المشاوي على الحطب. رقي وتناغم قلما تجده في مكان آخر.",
    date: "January 2026"
  }
];

export const initialOrders = [
  {
    id: "ORD-9821",
    customerEmail: "guest@savoria.com",
    customerName: "Elena Rostova",
    customerPhone: "+1 (555) 438-9201",
    items: [
      { id: "dish-1", name: "Truffle Ribeye & Smoked Bone Marrow", nameAr: "ستيك ريب آي بالترافل ونخاع العظم المدخن", price: 44.50, quantity: 1, image: dish1 },
      { id: "dish-11", name: "Sparkling Rose & Lychee Botanica", nameAr: "موكتيل الورد والباشن فروت الفوار", price: 11.00, quantity: 2, image: dish11 }
    ],
    subtotal: 66.50,
    discount: 6.65,
    couponCode: "SAVOR10",
    tax: 3.32,
    deliveryFee: 0,
    total: 63.17,
    orderType: "delivery",
    deliveryAddress: "742 Evergreen Terrace, Apt 4B",
    paymentMethod: "creditCard",
    status: "Preparing", // 'Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'
    createdAt: "2026-09-20T10:15:00.000Z",
    notes: "Please pack the mocktail ice in a separate insulated cup."
  },
  {
    id: "ORD-8419",
    customerEmail: "guest@savoria.com",
    customerName: "Elena Rostova",
    customerPhone: "+1 (555) 438-9201",
    items: [
      { id: "dish-3", name: "Artisanal Burrata & Heirloom Peach", nameAr: "بوراتا إيطالية مع الخوخ المشوي", price: 18.50, quantity: 1, image: dish3 },
      { id: "dish-9", name: "Golden Valrhona Chocolate Fondant", nameAr: "فوندان شوكولاتة فالرونا مع الذهب", price: 15.00, quantity: 2, image: dish9 }
    ],
    subtotal: 48.50,
    discount: 0,
    couponCode: null,
    tax: 2.42,
    deliveryFee: 4.99,
    total: 55.91,
    orderType: "delivery",
    deliveryAddress: "742 Evergreen Terrace, Apt 4B",
    paymentMethod: "applePay",
    status: "Delivered",
    createdAt: "2026-09-18T19:30:00.000Z",
    notes: "Cutlery included please."
  }
];

export const initialReservations = [
  {
    id: "RES-4029",
    customerEmail: "guest@savoria.com",
    customerName: "Elena Rostova",
    customerPhone: "+1 (555) 438-9201",
    date: "2026-09-22",
    time: "19:30",
    guests: 2,
    seatingArea: "seatingWindow",
    occasion: "occasionRomantic",
    notes: "Celebrating our 3rd anniversary, window view requested.",
    status: "Confirmed", // 'Pending', 'Confirmed', 'Seated', 'Cancelled'
    createdAt: "2026-09-19T14:20:00.000Z"
  },
  {
    id: "RES-3812",
    customerEmail: "sarah.k@example.com",
    customerName: "Sarah Jenkins",
    customerPhone: "+1 (555) 789-1234",
    date: "2026-09-21",
    time: "20:00",
    guests: 4,
    seatingArea: "seatingTerrace",
    occasion: "occasionBirthday",
    notes: "Please bring out a small candle with dessert.",
    status: "Confirmed",
    createdAt: "2026-09-18T11:00:00.000Z"
  }
];
