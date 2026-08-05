// MongoDB & Admin Auth Service Helper
export interface AdminAuthUser {
  uid: string;
  email: string;
  displayName?: string;
}

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; user?: AdminAuthUser; token?: string; message?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error during login' };
  }
}
