import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";

// ===== Interfaces =====
export interface DownloadLink {
  platform: string;
  url: string;
  extractCode?: string;
}

export interface Resource {
  id: string;
  name: string;
  version: string;
  releaseDate: string;
  description: string;
  category: string;
  tags: string[];
  platforms: string[];
  icon?: string;
  downloadLinks: DownloadLink[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  createdAt: string;
}

export interface Favorite {
  userId: string;
  toolId: string;
  toolType: "quick" | "resource" | "nav";
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  toolId: string;
  toolType: string;
  rating: number; // 1-5
  content: string;
  likes: number;
  createdAt: string;
}

export interface ToolUsage {
  toolId: string;
  toolType: string;
  count: number;
  lastUsed: string;
}

export interface Submission {
  id: string;
  userId: string;
  userName: string;
  name: string;
  description: string;
  url?: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// ===== File Paths =====
const DATA_DIR = join(process.cwd(), "data");
const RESOURCES_FILE = join(DATA_DIR, "resources.json");
const AUTH_FILE = join(DATA_DIR, "auth.json");
const USERS_FILE = join(DATA_DIR, "users.json");
const FAVORITES_FILE = join(DATA_DIR, "favorites.json");
const REVIEWS_FILE = join(DATA_DIR, "reviews.json");
const USAGE_FILE = join(DATA_DIR, "usage.json");
const SUBMISSIONS_FILE = join(DATA_DIR, "submissions.json");

const DEFAULT_PASSWORD = "admin123";

// ===== Helpers =====
async function ensureDataDir() {
  try { await mkdir(DATA_DIR, { recursive: true }); } catch {}
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDataDir();
  try { return JSON.parse(await readFile(file, "utf-8")); } catch { return fallback; }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await ensureDataDir();
  await writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

// ===== Resources =====
export async function getResources(): Promise<Resource[]> {
  return readJson(RESOURCES_FILE, []);
}

export async function saveResources(resources: Resource[]): Promise<void> {
  await writeJson(RESOURCES_FILE, resources);
}

export async function getResourceById(id: string): Promise<Resource | undefined> {
  const resources = await getResources();
  return resources.find((r) => r.id === id);
}

export async function createResource(data: Omit<Resource, "id" | "createdAt" | "updatedAt">): Promise<Resource> {
  const resources = await getResources();
  const newResource: Resource = {
    ...data,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  resources.unshift(newResource);
  await saveResources(resources);
  return newResource;
}

export async function updateResource(id: string, data: Partial<Resource>): Promise<Resource | null> {
  const resources = await getResources();
  const index = resources.findIndex((r) => r.id === id);
  if (index === -1) return null;
  resources[index] = { ...resources[index], ...data, updatedAt: new Date().toISOString() };
  await saveResources(resources);
  return resources[index];
}

export async function deleteResource(id: string): Promise<boolean> {
  const resources = await getResources();
  const filtered = resources.filter((r) => r.id !== id);
  if (filtered.length === resources.length) return false;
  await saveResources(filtered);
  return true;
}

export async function getCategories(): Promise<string[]> {
  const resources = await getResources();
  return ["全部", ...new Set(resources.map((r) => r.category))];
}

// ===== Auth =====
export async function verifyPassword(password: string): Promise<boolean> {
  try {
    const data = await readJson(AUTH_FILE, { password: DEFAULT_PASSWORD });
    return password === data.password;
  } catch {
    await writeJson(AUTH_FILE, { password: DEFAULT_PASSWORD });
    return password === DEFAULT_PASSWORD;
  }
}

// ===== Users =====
export async function getUsers(): Promise<User[]> {
  return readJson(USERS_FILE, []);
}

export async function createUser(name: string, email?: string): Promise<User> {
  const users = await getUsers();
  const user: User = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name,
    email,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeJson(USERS_FILE, users);
  return user;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.id === id);
}

// ===== Favorites =====
export async function getFavorites(userId: string): Promise<Favorite[]> {
  const all = await readJson<Favorite[]>(FAVORITES_FILE, []);
  return all.filter((f) => f.userId === userId);
}

export async function addFavorite(userId: string, toolId: string, toolType: string): Promise<void> {
  const all = await readJson<Favorite[]>(FAVORITES_FILE, []);
  if (!all.find((f) => f.userId === userId && f.toolId === toolId)) {
    all.push({ userId, toolId, toolType: toolType as "quick" | "resource" | "nav", createdAt: new Date().toISOString() });
    await writeJson(FAVORITES_FILE, all);
  }
}

export async function removeFavorite(userId: string, toolId: string): Promise<void> {
  const all = await readJson<Favorite[]>(FAVORITES_FILE, []);
  const filtered = all.filter((f) => !(f.userId === userId && f.toolId === toolId));
  await writeJson(FAVORITES_FILE, filtered);
}

export async function isFavorited(userId: string, toolId: string): Promise<boolean> {
  const all = await readJson<Favorite[]>(FAVORITES_FILE, []);
  return all.some((f) => f.userId === userId && f.toolId === toolId);
}

// ===== Reviews =====
export async function getReviews(toolId: string, toolType: string): Promise<Review[]> {
  const all = await readJson<Review[]>(REVIEWS_FILE, []);
  return all.filter((r) => r.toolId === toolId && r.toolType === toolType).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addReview(review: Omit<Review, "id" | "createdAt" | "likes">): Promise<Review> {
  const all = await readJson<Review[]>(REVIEWS_FILE, []);
  const newReview: Review = { ...review, id: Date.now().toString(), likes: 0, createdAt: new Date().toISOString() };
  all.push(newReview);
  await writeJson(REVIEWS_FILE, all);
  return newReview;
}

export async function getAverageRating(toolId: string, toolType: string): Promise<{ avg: number; count: number }> {
  const reviews = await getReviews(toolId, toolType);
  if (reviews.length === 0) return { avg: 0, count: 0 };
  return { avg: reviews.reduce((s, r) => s + r.rating, 0) / reviews.length, count: reviews.length };
}

// ===== Usage Stats =====
export async function recordUsage(toolId: string, toolType: string): Promise<void> {
  const all = await readJson<ToolUsage[]>(USAGE_FILE, []);
  const existing = all.find((u) => u.toolId === toolId && u.toolType === toolType);
  if (existing) {
    existing.count++;
    existing.lastUsed = new Date().toISOString();
  } else {
    all.push({ toolId, toolType, count: 1, lastUsed: new Date().toISOString() });
  }
  await writeJson(USAGE_FILE, all);
}

export async function getPopularTools(limit = 10): Promise<ToolUsage[]> {
  const all = await readJson<ToolUsage[]>(USAGE_FILE, []);
  return all.sort((a, b) => b.count - a.count).slice(0, limit);
}

// ===== Submissions =====
export async function getSubmissions(status?: string): Promise<Submission[]> {
  const all = await readJson<Submission[]>(SUBMISSIONS_FILE, []);
  return status ? all.filter((s) => s.status === status) : all;
}

export async function addSubmission(data: Omit<Submission, "id" | "createdAt" | "status">): Promise<Submission> {
  const all = await readJson<Submission[]>(SUBMISSIONS_FILE, []);
  const sub: Submission = { ...data, id: Date.now().toString(), status: "pending", createdAt: new Date().toISOString() };
  all.unshift(sub);
  await writeJson(SUBMISSIONS_FILE, all);
  return sub;
}

export async function updateSubmissionStatus(id: string, status: "approved" | "rejected"): Promise<void> {
  const all = await readJson<Submission[]>(SUBMISSIONS_FILE, []);
  const sub = all.find((s) => s.id === id);
  if (sub) sub.status = status;
  await writeJson(SUBMISSIONS_FILE, all);
}
