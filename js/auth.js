import { auth } from './firebase-init.js';
import { 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Handle Login Form
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('error-message');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = 'admin.html';
        } catch (error) {
            console.error("Login error:", error);
            errorEl.textContent = "Accès refusé. Informations d'identification invalides.";
            errorEl.classList.remove('hidden');
        }
    });
}

// Redirect if already logged in (on login page)
if (window.location.pathname.includes('login.html')) {
    onAuthStateChanged(auth, user => {
        if (user) {
            window.location.href = 'admin.html';
        }
    });
}

// Global Auth Check for Admin Page
export function checkAdminAuth() {
    onAuthStateChanged(auth, user => {
        if (!user) {
            window.location.href = 'login.html';
        }
    });
}

// Global Logout
window.logout = async function() {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error("Logout error:", error);
    }
};
