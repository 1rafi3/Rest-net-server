import fs from "fs";
import path from "path";
import { INITIAL_PROPERTIES, Property, Review } from "./mock-data";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // bcrypt hash
  role: "user" | "admin";
  createdAt: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  userId: string;
  userName: string;
  price: number;
  startDate: string;
  endDate: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

interface DatabaseSchema {
  users: User[];
  properties: Property[];
  bookings: Booking[];
}

const DB_PATH = path.join(process.cwd(), "src", "data", "database.json");

// Helper to ensure database file exists and is initialized
function initDatabase(): DatabaseSchema {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    // Seed default users: admin@rentnest.com and user@rentnest.com
    // Password for both is: password123
    // Hashed with bcryptjs (password123 hash: $2a$10$wK1Fw73aCpeG5D5s7R8.zexy2vY6Wl9zKkWYmXl4fH9fA5o43wV7u)
    // Let's use standard pre-hashed values or write a helper to hash if needed.
    // Hash generated via: bcrypt.hash('password123', 10) — verified match
    const PASSWORD_HASH = "$2a$10$uR5fBFvqmfgX359DSDonMu2xUlzsbrdRJ2P2A3aRQOyfaeB2yrCdC";

    const defaultUsers: User[] = [
      {
        id: "host-admin",
        name: "Admin Host",
        email: "admin@rentnest.com",
        passwordHash: PASSWORD_HASH, // "password123"
        role: "admin",
        createdAt: new Date().toISOString()
      },
      {
        id: "host-user",
        name: "Demo Renter",
        email: "user@rentnest.com",
        passwordHash: PASSWORD_HASH, // "password123"
        role: "user",
        createdAt: new Date().toISOString()
      }
    ];

    // Seed default bookings for charts
    const defaultBookings: Booking[] = [
      {
        id: "book-1",
        propertyId: "prop-1",
        propertyName: "Urban Nest Co-Living Space",
        userId: "host-user",
        userName: "Demo Renter",
        price: 1200,
        startDate: "2026-06-01",
        endDate: "2026-06-30",
        status: "confirmed",
        createdAt: "2026-05-15T12:00:00.000Z"
      },
      {
        id: "book-2",
        propertyId: "prop-2",
        propertyName: "Sunset Boulevard Modern Studio",
        userId: "host-user",
        userName: "Demo Renter",
        price: 1850,
        startDate: "2026-07-01",
        endDate: "2026-07-31",
        status: "confirmed",
        createdAt: "2026-06-10T15:30:00.000Z"
      },
      {
        id: "book-3",
        propertyId: "prop-3",
        propertyName: "The Oasis - Luxury Coastal Villa",
        userId: "user-unknown",
        userName: "Sarah Jenkins",
        price: 4500,
        startDate: "2026-05-10",
        endDate: "2026-05-20",
        status: "confirmed",
        createdAt: "2026-04-25T09:00:00.000Z"
      },
      {
        id: "book-4",
        propertyId: "prop-4",
        propertyName: "Sleek Loft near Millennium Park",
        userId: "user-unknown-2",
        userName: "Michael Chen",
        price: 2100,
        startDate: "2026-06-12",
        endDate: "2026-06-26",
        status: "confirmed",
        createdAt: "2026-06-01T10:15:00.000Z"
      },
      {
        id: "book-5",
        propertyId: "prop-5",
        propertyName: "Silicon Valley Executive Suite",
        userId: "host-user",
        userName: "Demo Renter",
        price: 2800,
        startDate: "2026-08-01",
        endDate: "2026-08-15",
        status: "pending",
        createdAt: "2026-07-05T14:00:00.000Z"
      }
    ];

    const initialData: DatabaseSchema = {
      users: defaultUsers,
      properties: INITIAL_PROPERTIES,
      bookings: defaultBookings
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const content = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(content) as DatabaseSchema;
  } catch (error) {
    console.error("Database reading error, resetting database", error);
    // If corruption occurs, recreate the structure
    const initialData: DatabaseSchema = {
      users: [],
      properties: INITIAL_PROPERTIES,
      bookings: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }
}

function saveDatabase(data: DatabaseSchema) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export const db = {
  // Users Operations
  getUsers: (): User[] => {
    return initDatabase().users;
  },
  getUserById: (id: string): User | undefined => {
    return initDatabase().users.find((u) => u.id === id);
  },
  getUserByEmail: (email: string): User | undefined => {
    return initDatabase().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  addUser: (user: User): void => {
    const data = initDatabase();
    data.users.push(user);
    saveDatabase(data);
  },

  // Properties Operations
  getProperties: (): Property[] => {
    return initDatabase().properties;
  },
  getPropertyById: (id: string): Property | undefined => {
    return initDatabase().properties.find((p) => p.id === id);
  },
  addProperty: (property: Property): void => {
    const data = initDatabase();
    data.properties.push(property);
    saveDatabase(data);
  },
  updateProperty: (property: Property): void => {
    const data = initDatabase();
    const idx = data.properties.findIndex((p) => p.id === property.id);
    if (idx !== -1) {
      data.properties[idx] = property;
      saveDatabase(data);
    }
  },
  deleteProperty: (id: string): boolean => {
    const data = initDatabase();
    const lenBefore = data.properties.length;
    data.properties = data.properties.filter((p) => p.id !== id);
    if (data.properties.length < lenBefore) {
      saveDatabase(data);
      return true;
    }
    return false;
  },

  // Reviews Operations
  addReview: (propertyId: string, review: Review): boolean => {
    const data = initDatabase();
    const idx = data.properties.findIndex((p) => p.id === propertyId);
    if (idx !== -1) {
      const property = data.properties[idx];
      property.reviews = property.reviews || [];
      property.reviews.push(review);
      property.reviewsCount = property.reviews.length;
      
      // Re-calculate average rating
      const sum = property.reviews.reduce((acc, r) => acc + r.rating, 0);
      property.rating = Number((sum / property.reviews.length).toFixed(1));
      
      data.properties[idx] = property;
      saveDatabase(data);
      return true;
    }
    return false;
  },

  // Bookings Operations
  getBookings: (): Booking[] => {
    return initDatabase().bookings;
  },
  getBookingsByUserId: (userId: string): Booking[] => {
    return initDatabase().bookings.filter((b) => b.userId === userId);
  },
  addBooking: (booking: Booking): void => {
    const data = initDatabase();
    data.bookings.push(booking);
    saveDatabase(data);
  }
};
