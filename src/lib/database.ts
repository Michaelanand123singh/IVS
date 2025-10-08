import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Promisify database methods
const dbRun = promisify(db.run.bind(db)) as (sql: string, params?: unknown[]) => Promise<unknown>;
const dbGet = promisify(db.get.bind(db)) as (sql: string, params?: unknown[]) => Promise<unknown>;
const dbAll = promisify(db.all.bind(db)) as (sql: string, params?: unknown[]) => Promise<unknown>;

export interface ContactSubmission {
  id?: number;
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
  submitted_at: string;
  status: 'new' | 'contacted' | 'closed';
}

export interface AdminUser {
  id?: number;
  username: string;
  password: string;
  created_at: string;
}

// Initialize database tables
export async function initDatabase() {
  try {
    // Create contacts table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT,
        service TEXT NOT NULL,
        message TEXT NOT NULL,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'closed'))
      )
    `);

    // Create admin users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Contact operations
export async function createContact(contact: Omit<ContactSubmission, 'id' | 'submitted_at' | 'status'>) {
  const result = await dbRun(
    'INSERT INTO contacts (name, email, company, service, message) VALUES (?, ?, ?, ?, ?)',
    [contact.name, contact.email, contact.company || '', contact.service, contact.message]
  );
  return result;
}

export async function getAllContacts(): Promise<ContactSubmission[]> {
  const contacts = await dbAll('SELECT * FROM contacts ORDER BY submitted_at DESC');
  return contacts as ContactSubmission[];
}

export async function getContactById(id: number): Promise<ContactSubmission | null> {
  const contact = await dbGet('SELECT * FROM contacts WHERE id = ?', [id]);
  return contact as ContactSubmission | null;
}

export async function updateContactStatus(id: number, status: 'new' | 'contacted' | 'closed') {
  await dbRun('UPDATE contacts SET status = ? WHERE id = ?', [status, id]);
}

// Admin operations
export async function createAdmin(username: string, password: string) {
  await dbRun('INSERT INTO admin_users (username, password) VALUES (?, ?)', [username, password]);
}

export async function getAdminByUsername(username: string): Promise<AdminUser | null> {
  const admin = await dbGet('SELECT * FROM admin_users WHERE username = ?', [username]);
  return admin as AdminUser | null;
}

export { db };
