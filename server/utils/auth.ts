import jwt from "jsonwebtoken";
import type { H3Event } from "h3";

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'biker';
  companyId?: string | null;
}

export function extractToken(event: H3Event): string | null {
  const authHeader = getHeader(event, "authorization");

  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
    return authHeader;
  }

  // Fallback to cookie
  return getCookie(event, "auth_token") || null;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as any;

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      companyId: decoded.companyId,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function requireAuth(event: H3Event): AuthUser {
  const token = extractToken(event);

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication token required",
    });
  }

  const user = verifyToken(token);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or expired token",
    });
  }

  return user;
}

export async function requireCompanyAccess(
  event: H3Event,
  companyId: string,
  requiredRole?: string
): Promise<AuthUser> {
  const user = requireAuth(event);

  // Check if user has access to this company
  const { getDatabase } = await import("~/server/utils/database");
  const db = getDatabase();

  try {
    const companyUser = await db("company_users")
      .where({
        company_id: companyId,
        user_id: user.id,
        is_active: true,
      })
      .first();

    if (!companyUser) {
      throw createError({
        statusCode: 403,
        statusMessage: "Access denied to this company",
      });
    }

    // Check role if required
    if (requiredRole) {
      const roleHierarchy = ["viewer", "editor", "admin", "owner"];
      const userRoleIndex = roleHierarchy.indexOf(companyUser.role);
      const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

      if (userRoleIndex < requiredRoleIndex) {
        throw createError({
          statusCode: 403,
          statusMessage: `Insufficient permissions. ${requiredRole} role required.`,
        });
      }
    }

    return user;
  } finally {
    await db.destroy();
  }
}
