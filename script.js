// ── Scroll-triggered reveal ──────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));
}

// ── Contact form submit ──────────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Message Sent ✓';
    btn.style.background = 'linear-gradient(135deg,#4ff7c8,#4ff7c8)';
    setTimeout(() => {
      btn.innerHTML = 'Send Message <span class="material-symbols-outlined">send</span>';
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

// ── Tech tabs (technologies.html) ────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});<!-- ======================================================
     JAVASCRIPT: Form validation, tab switching,
                 password toggle, strength meter
     ====================================================== -->
<script>
    // ── Tab switching ─────────────────────────────────────
    function switchTab(tab) {
        const loginPanel    = document.getElementById('panel-login');
        const registerPanel = document.getElementById('panel-register');
        const loginTab      = document.getElementById('tab-login');
        const registerTab   = document.getElementById('tab-register');

        if (tab === 'login') {
            loginPanel.style.display    = 'block';
            registerPanel.style.display = 'none';
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginTab.setAttribute('aria-selected', 'true');
            registerTab.setAttribute('aria-selected', 'false');
        } else {
            loginPanel.style.display    = 'none';
            registerPanel.style.display = 'block';
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerTab.setAttribute('aria-selected', 'true');
            loginTab.setAttribute('aria-selected', 'false');
        }
    }

    // ── Password visibility toggle ────────────────────────
    function togglePassword(inputId, btn) {
        const input = document.getElementById(inputId);
        const icon  = btn.querySelector('.material-symbols-outlined');
        if (input.type === 'password') {
            input.type  = 'text';
            icon.textContent = 'visibility_off';
        } else {
            input.type  = 'password';
            icon.textContent = 'visibility';
        }
    }

    // ── Password strength meter ───────────────────────────
    document.getElementById('reg-password').addEventListener('input', function () {
        const val  = this.value;
        const bar  = document.getElementById('strength-bar');
        const fill = document.getElementById('strength-fill');
        const label = document.getElementById('strength-label');

        if (val.length === 0) { bar.style.display = 'none'; return; }
        bar.style.display = 'block';

        let score = 0;
        if (val.length >= 8)            score++;
        if (/[A-Z]/.test(val))          score++;
        if (/[0-9]/.test(val))          score++;
        if (/[^A-Za-z0-9]/.test(val))  score++;

        const levels = [
            { width: '25%', color: '#ff6b6b', text: 'Weak' },
            { width: '50%', color: '#f7c94f', text: 'Fair' },
            { width: '75%', color: '#63caff', text: 'Good' },
            { width: '100%',color: '#4ff7c8', text: 'Strong' },
        ];
        const lvl = levels[score - 1] || levels[0];
        fill.style.width      = lvl.width;
        fill.style.background = lvl.color;
        label.textContent     = lvl.text;
        label.style.color     = lvl.color;
    });

    // ── Toast helper ──────────────────────────────────────
    function showToast(msg) {
        const t = document.getElementById('toast');
        document.getElementById('toast-msg').textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3500);
    }

    // ── Field validation helper ───────────────────────────
    function validateField(wrapperId, groupId, errorId, isValid) {
        const wrapper = document.getElementById(wrapperId);
        const group   = document.getElementById(groupId);
        if (isValid) {
            wrapper?.classList.add('valid');
            wrapper?.classList.remove('invalid');
            group?.classList.remove('has-error');
        } else {
            wrapper?.classList.add('invalid');
            wrapper?.classList.remove('valid');
            group?.classList.add('has-error');
        }
        return isValid;
    }

    // ── Login form submission ─────────────────────────────
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const email    = document.getElementById('login-email');
        const password = document.getElementById('login-password');
        const btn      = document.getElementById('loginBtn');

        // Validate email
        const emailOk = validateField('wrapper-email', 'group-email', 'email-error',
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));

        // Validate password length
        const pwOk = validateField('wrapper-password', 'group-password', 'password-error',
            password.value.length >= 8);

        if (!emailOk || !pwOk) return;

        // Simulate loading state
        btn.classList.add('loading');
        setTimeout(() => {
            btn.classList.remove('loading');
            showToast('Signed in successfully! Redirecting to your dashboard…');
            setTimeout(() => { window.location.href = 'index.html'; }, 2000);
        }, 1800);
    });

    // ── Register form submission ──────────────────────────
    document.getElementById('registerForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const name     = document.getElementById('reg-name');
        const email    = document.getElementById('reg-email');
        const password = document.getElementById('reg-password');
        const terms    = document.getElementById('terms');
        const btn      = document.getElementById('registerBtn');

        const nameOk = validateField('wrapper-reg-name', 'group-reg-name', 'reg-name-error',
            name.value.trim().length > 1);

        const emailOk = validateField('wrapper-reg-email', 'group-reg-email', 'reg-email-error',
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));

        const pwOk = validateField('wrapper-reg-password', 'group-reg-password', 'reg-password-error',
            password.value.length >= 8);

        if (!nameOk || !emailOk || !pwOk || !terms.checked) {
            if (!terms.checked) showToast('Please accept the Terms of Service to continue.');
            return;
        }

        btn.classList.add('loading');
        setTimeout(() => {
            btn.classList.remove('loading');
            showToast('Account created! Welcome to IoT University.');
            setTimeout(() => switchTab('login'), 2000);
        }, 1800);
    });

    // ── Real-time inline validation ───────────────────────
    document.getElementById('login-email').addEventListener('blur', function () {
        validateField('wrapper-email', 'group-email', 'email-error',
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value) || this.value === '');
    });

    document.getElementById('login-password').addEventListener('blur', function () {
        validateField('wrapper-password', 'group-password', 'password-error',
            this.value.length >= 8 || this.value === '');
    });
</script>

