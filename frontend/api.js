/**
 * AMPLE.AI — API Service Module
 * Sends form data to the Vercel backend endpoints.
 * 
 * Configuration:
 *   Set API_BASE_URL below to your deployed Vercel backend URL.
 */

// ============================================================
// CONFIG — Replace with your deployed Vercel URL
// ============================================================
const API_BASE_URL = 'YOUR_VERCEL_BACKEND_URL';  // e.g. https://ample-api.vercel.app

// ============================================================
// Helper
// ============================================================
async function apiRequest(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || 'Something went wrong.');
        }

        return result;
    } catch (error) {
        console.error(`[API] ${endpoint} error:`, error);
        throw error;
    }
}

// ============================================================
// API Methods
// ============================================================

/** Submit a free trial signup */
async function submitTrialSignup(formData) {
    return apiRequest('/api/trial-signup', formData);
}

/** Submit NPS feedback */
async function submitFeedback(score, comment) {
    return apiRequest('/api/feedback', { score, comment });
}

/** Submit a test-agent call request */
async function submitTestAgent(formData) {
    return apiRequest('/api/test-agent', formData);
}

/** Submit a contact form */
async function submitContact(formData) {
    return apiRequest('/api/contact', formData);
}
