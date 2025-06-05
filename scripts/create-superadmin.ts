import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { db } from "../server/db.js";
import { users } from "../shared/schema.js";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createSuperAdmin() {
  try {
    const hashedPassword = await hashPassword("admin123");
    
    const result = await db.insert(users).values({
      username: "superadmin",
      password: hashedPassword,
      businessName: "System Administration",
      email: "superadmin@system.local",
      role: "super_admin",
    }).onConflictDoNothing().returning();

    if (result.length > 0) {
      console.log("✅ Superadmin user created successfully!");
      console.log("Username: superadmin");
      console.log("Password: admin123");
      console.log("Role: super_admin");
    } else {
      console.log("ℹ️ Superadmin user already exists");
    }
  } catch (error) {
    console.error("❌ Error creating superadmin:", error);
  } finally {
    process.exit(0);
  }
}

createSuperAdmin();