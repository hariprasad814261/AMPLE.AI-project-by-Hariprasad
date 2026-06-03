/**
 * AMPLE.AI — Supabase Auth Module
 * Handles Google OAuth login/logout and session management.
 * 
 * Configuration:
 *   Set SUPABASE_URL and SUPABASE_ANON_KEY below or via a config file.
 */

// ============================================================
// CONFIG — Replace these with your real Supabase project values
// ============================================================
const SUPABASE_URL  = 'https://scxrktkbdvsmctwnbktb.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjeHJrdGtiZHZzbWN0d25ia3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NjQxMjAsImV4cCI6MjA5NjA0MDEyMH0.KhOvx5l2nlMTNJ-WOjBoCxyirKtU3fv6gkdV_D2-HB8';

// ============================================================
// Initialize Supabase Client (loaded via CDN in index.html)
// ============================================================
let supabaseClient = null;

function initSupabase() {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    } else {
        console.warn('[Auth] Supabase SDK not loaded. Auth features disabled.');
    }
    return supabaseClient;
}

// ============================================================
// Auth Functions
// ============================================================

/** Sign in with Google via Supabase OAuth */
async function signInWithGoogle() {
    if (!supabaseClient) return;
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    });
    if (error) {
        console.error('[Auth] Google sign-in error:', error.message);
    }
}

/** Sign out the current user */
async function signOut() {
    if (!supabaseClient) return;
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error('[Auth] Sign-out error:', error.message);
    }
    updateAuthUI(null);
}

/** Get the current session (user or null) */
async function getCurrentUser() {
    if (!supabaseClient) return null;
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session?.user || null;
}

// ============================================================
// UI Updates
// ============================================================

function updateAuthUI(user) {
    const authBtn = document.getElementById('auth-btn');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');

    if (!authBtn) return; // Auth UI elements not present

    if (user) {
        // Logged in state
        authBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (userName) userName.textContent = user.user_metadata?.full_name || user.email;
        if (userAvatar) {
            userAvatar.src = user.user_metadata?.avatar_url || '';
            userAvatar.style.display = user.user_metadata?.avatar_url ? 'block' : 'none';
        }
    } else {
        // Logged out state
        authBtn.style.display = 'inline-flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// ============================================================
// Initialize on DOM Ready
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
    initSupabase();

    // Check current session
    const user = await getCurrentUser();
    updateAuthUI(user);

    // Listen for auth state changes (e.g. after redirect from Google)
    if (supabaseClient) {
        supabaseClient.auth.onAuthStateChange((_event, session) => {
            updateAuthUI(session?.user || null);
        });
    }

    // Bind login button
    const authBtn = document.getElementById('auth-btn');
    if (authBtn) {
        authBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signInWithGoogle();
        });
    }

    // Bind logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signOut();
        });
    }
});
