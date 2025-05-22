// Show a popup in a new tab with animation when the contact form is submitted
window.addEventListener('DOMContentLoaded', function() {
    var form = document.querySelector('.contact-background form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            window.open('thankyou.html', '_blank');
            form.reset();
        });
    }
});

// Cookie consent popup (show until accepted or rejected, then hide for future visits)
window.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('cookieConsent')) {
        var popup = document.createElement('div');
        popup.id = 'cookie-popup';
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-modal', 'true');
        popup.setAttribute('aria-label', 'Cookie consent');
        popup.style.position = 'fixed';
        popup.style.bottom = '24px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.background = 'rgba(34,34,41,0.98)';
        popup.style.color = '#fff';
        popup.style.padding = '18px 32px';
        popup.style.borderRadius = '12px';
        popup.style.boxShadow = '0 4px 24px 0 rgba(0,0,0,0.18)';
        popup.style.zIndex = '9999';
        popup.style.display = 'flex';
        popup.style.alignItems = 'center';
        popup.style.gap = '18px';
        popup.innerHTML = `
            <span id="cookie-desc" style="font-size:1.1rem;">This website uses cookies to ensure you get the best experience.</span>
            <button id="cookie-accept" style="background:#4f8cff;color:#fff;border:none;padding:8px 18px;border-radius:6px;cursor:pointer;font-size:1rem;" aria-label="Accept cookies">Accept</button>
            <button id="cookie-reject" style="background:#e53e3e;color:#fff;border:none;padding:8px 18px;border-radius:6px;cursor:pointer;font-size:1rem;" aria-label="Reject cookies">Reject</button>
        `;
        popup.setAttribute('aria-describedby', 'cookie-desc');
        document.body.appendChild(popup);
        document.getElementById('cookie-accept').onclick = function() {
            localStorage.setItem('cookieConsent', 'true');
            popup.style.display = 'none';
        };
        document.getElementById('cookie-reject').onclick = function() {
            localStorage.setItem('cookieConsent', 'rejected');
            popup.style.display = 'none';
        };
        // Focus management for accessibility
        setTimeout(function() {
            document.getElementById('cookie-accept').focus();
        }, 100);
    }
});