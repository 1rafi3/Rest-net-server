import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { db, User, Booking } from "./lib/db";
import { hashPassword, verifyPassword, signToken, getAuthenticatedUser } from "./lib/auth";
import { Property, Review } from "./lib/mock-data";

const app = express();
const PORT = process.env.PORT || 5000;

// Setup Middleware
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Express Middleware to authenticate requests
const requireAuth = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized access. Please login." });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error during authentication" });
  }
};

/* ============================================
   AUTH ENDPOINTS
   ============================================ */

// Register Account
app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please specify name, email and password." });
  }

  try {
    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Email address already registered." });
    }

    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      id: "user-" + Math.random().toString(36).substr(2, 9),
      name,
      email,
      passwordHash: hashedPassword,
      role: role === "admin" ? "admin" : "user",
      createdAt: new Date().toISOString()
    };

    db.addUser(newUser);

    const token = await signToken({ userId: newUser.id, email: newUser.email, role: newUser.role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "lax",
      path: "/"
    });

    res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server registration failed." });
  }
});

// Login Account
app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please enter your email and password." });
  }

  try {
    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Incorrect credentials." });
    }

    const correctPassword = await verifyPassword(password, user.passwordHash);
    if (!correctPassword) {
      return res.status(401).json({ error: "Incorrect credentials." });
    }

    const token = await signToken({ userId: user.id, email: user.email, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "lax",
      path: "/"
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server login failed." });
  }
});

// Get Current User Profile
app.get("/api/auth/me", async (req: Request, res: Response) => {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized session." });
  }
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Logout Account
app.post("/api/auth/logout", (req: Request, res: Response) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logout successful" });
});

/* ============================================
   PROPERTIES ENDPOINTS
   ============================================ */

// Get All Listings (w/ filters, sorting & pagination)
app.get("/api/properties", (req: Request, res: Response) => {
  const { search, category, location, minPrice, maxPrice, rating, sort, page = "1", limit = "8" } = req.query;

  try {
    let propertiesList = db.getProperties();

    // 1. Filter by Search Query (keywords matching title / description / summary)
    if (search && typeof search === "string" && search.trim()) {
      const q = search.toLowerCase();
      propertiesList = propertiesList.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    }

    // 2. Filter by Category
    if (category && typeof category === "string" && category !== "All") {
      propertiesList = propertiesList.filter(p => p.category === category);
    }

    // 3. Filter by Location
    if (location && typeof location === "string" && location !== "All") {
      const loc = location.toLowerCase();
      propertiesList = propertiesList.filter(p => p.location.toLowerCase().includes(loc));
    }

    // 4. Filter by Price Min/Max
    if (minPrice && typeof minPrice === "string") {
      const minVal = parseFloat(minPrice);
      if (!isNaN(minVal)) {
        propertiesList = propertiesList.filter(p => p.price >= minVal);
      }
    }
    if (maxPrice && typeof maxPrice === "string") {
      const maxVal = parseFloat(maxPrice);
      if (!isNaN(maxVal)) {
        propertiesList = propertiesList.filter(p => p.price <= maxVal);
      }
    }

    // 5. Filter by Rating
    if (rating && typeof rating === "string") {
      const rateVal = parseFloat(rating);
      if (!isNaN(rateVal) && rateVal > 0) {
        propertiesList = propertiesList.filter(p => p.rating >= rateVal);
      }
    }

    // 6. Sort Listings
    if (sort && typeof sort === "string") {
      if (sort === "price_asc") {
        propertiesList.sort((a, b) => a.price - b.price);
      } else if (sort === "price_desc") {
        propertiesList.sort((a, b) => b.price - a.price);
      } else if (sort === "rating_desc") {
        propertiesList.sort((a, b) => b.rating - a.rating);
      } else {
        // Default: newest listed
        propertiesList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } else {
      propertiesList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // 7. Paginate results
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 8;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const total = propertiesList.length;

    const paginatedProperties = propertiesList.slice(startIndex, endIndex);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      properties: paginatedProperties,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load stay properties listings" });
  }
});

// Get Single Property detail
app.get("/api/properties/:id", (req: Request, res: Response) => {
  const property = db.getPropertyById(req.params.id);
  if (!property) {
    return res.status(404).json({ error: "Accommodation stay not found." });
  }
  res.json({ property });
});

// Create Accommodation listing
app.post("/api/properties", requireAuth, (req: any, res: Response) => {
  const { title, shortDescription, description, price, category, location, beds, baths, sqft, amenities, images } = req.body;
  
  if (!title || !shortDescription || !description || !price || !category || !location) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  try {
    const newProperty: Property = {
      id: "prop-" + Math.random().toString(36).substr(2, 9),
      title,
      shortDescription,
      description,
      price: Number(price),
      category,
      location,
      images: images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80"],
      rating: 0,
      reviewsCount: 0,
      beds: Number(beds) || 1,
      baths: Number(baths) || 1,
      sqft: Number(sqft) || 500,
      amenities: amenities || ["High-speed Wi-Fi", "Air Conditioning"],
      createdAt: new Date().toISOString(),
      hostId: req.user.id,
      reviews: []
    };

    db.addProperty(newProperty);
    res.status(201).json({ message: "Property listed successfully.", property: newProperty });
  } catch (error) {
    res.status(500).json({ error: "Failed to publish stay listing." });
  }
});

// Delete Property listing
app.delete("/api/properties/:id", requireAuth, (req: any, res: Response) => {
  const property = db.getPropertyById(req.params.id);
  if (!property) {
    return res.status(404).json({ error: "Accommodation stay not found." });
  }

  // Authorization check (Only host/creator or admin can delete)
  if (property.hostId !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized. Only the owner or site admin can delete listings." });
  }

  try {
    db.deleteProperty(req.params.id);
    res.status(200).json({ message: "Listing deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete listing." });
  }
});

// Add Property review
app.post("/api/properties/:id/reviews", requireAuth, (req: any, res: Response) => {
  const { rating, comment } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ error: "Please enter a rating and comment description." });
  }

  try {
    const newReview: Review = {
      id: "rev-" + Math.random().toString(36).substr(2, 9),
      name: req.user.name,
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split("T")[0],
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
    };

    const added = db.addReview(req.params.id, newReview);
    if (!added) {
      return res.status(404).json({ error: "Accommodation stay not found." });
    }

    res.status(201).json({ message: "Review posted successfully.", review: newReview });
  } catch (error) {
    res.status(500).json({ error: "Failed to add review." });
  }
});

/* ============================================
   BOOKINGS ENDPOINTS
   ============================================ */

// Create Stays Reservation Booking
app.post("/api/bookings", requireAuth, (req: any, res: Response) => {
  const { propertyId, startDate, endDate } = req.body;
  if (!propertyId || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing stay reference dates." });
  }

  const property = db.getPropertyById(propertyId);
  if (!property) {
    return res.status(404).json({ error: "Stay not found." });
  }

  try {
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = property.price * (property.category === "Villa" ? days : 1);

    const newBooking: Booking = {
      id: "book-" + Math.random().toString(36).substr(2, 9),
      propertyId,
      propertyName: property.title,
      userId: req.user.id,
      userName: req.user.name,
      price: totalPrice,
      startDate,
      endDate,
      status: "confirmed",
      createdAt: new Date().toISOString()
    };

    db.addBooking(newBooking);
    res.status(201).json({ message: "Booking confirmed successfully.", booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: "Failed to secure booking reservation." });
  }
});

// Fetch User Bookings list
app.get("/api/bookings", requireAuth, (req: any, res: Response) => {
  try {
    // Admins can see all bookings; users see only their own
    let bookingsList = req.user.role === "admin"
      ? db.getBookings()
      : db.getBookingsByUserId(req.user.id);
    
    // Sort by booking creation date (newest first)
    bookingsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ bookings: bookingsList });
  } catch (error) {
    res.status(500).json({ error: "Failed to load bookings list." });
  }
});

/* ============================================
   DASHBOARD ENDPOINTS
   ============================================ */

// Dashboard Stats Analytics
app.get("/api/dashboard/stats", requireAuth, (req: any, res: Response) => {
  try {
    const properties = db.getProperties();
    const bookings = db.getBookings();

    // 1. Summary numbers
    const totalListings = properties.length;
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0);

    // 2. Build full 12-month baseline so charts always have data
    const ALL_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const revenueByMonth: { [m: string]: number } = {};
    const bookingsByMonth: { [m: string]: number } = {};
    ALL_MONTHS.forEach(m => { revenueByMonth[m] = 0; bookingsByMonth[m] = 0; });

    bookings.forEach(b => {
      const d = new Date(b.startDate);
      if (!isNaN(d.getTime())) {
        const m = ALL_MONTHS[d.getMonth()];
        revenueByMonth[m] = (revenueByMonth[m] || 0) + b.price;
        bookingsByMonth[m] = (bookingsByMonth[m] || 0) + 1;
      }
    });

    // Keep only months that have data OR show last 6 months as rolling window
    const now = new Date();
    const last6: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6.push(ALL_MONTHS[d.getMonth()]);
    }

    const monthlyRevenue = last6.map(m => ({ name: m, revenue: revenueByMonth[m] || 0 }));
    const bookingCounts  = last6.map(m => ({ name: m, bookings: bookingsByMonth[m] || 0 }));

    // 3. Category distribution
    const categoryCounts: { [cat: string]: number } = {};
    properties.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    const categoryData = Object.keys(categoryCounts).map(cat => ({
      name: cat,
      value: categoryCounts[cat]
    }));

    res.json({
      summary: {
        totalListings,
        totalBookings,
        totalRevenue,
        avgRating: 4.8
      },
      charts: {
        monthlyRevenue,
        categoryData,
        bookingCounts
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate analytics stats." });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`RentNest Express server is running on http://localhost:${PORT}`);
});
