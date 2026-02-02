document.addEventListener('DOMContentLoaded', () => {

    // Impact Meter Animation
    const counters = document.querySelectorAll('.counter-number');
    const speed = 200; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;

                // Lower increment to move slower
                const inc = target / speed;

                if (count < target) {
                    // Add inc to count and output in counter
                    counter.innerText = Math.ceil(count + inc);
                    // Call function every ms
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };

            updateCount();
        });
    };

    // Intersection Observer to start animation when in view
    let observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.5 // trigger when 50% visible
    };

    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    const impactSection = document.querySelector('.impact-meter');
    if (impactSection) {
        observer.observe(impactSection);
    }

    // Form Handling with SalesAutopilot Integration
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            // Build payload from form data
            const formData = new FormData(form);
            const payload = {
                // SAPI Standard Fields (Adjust keys if needed)
                email: formData.get('email'),
                mssys_firstname: formData.get('fullName').split(' ')[1] || '', // Rough split for first/last
                mssys_lastname: formData.get('fullName').split(' ')[0] || '',
                // Custom Fields
                w_city: formData.get('city'),
                participant_type: formData.get('type'),
                has_wingman: formData.get('hasWingman') ? 'yes' : 'no'
            };

            // Use local Vercel API Proxy to avoid CORS
            const SAPI_ENDPOINT = "/api/subscribe";

            // Note: SAPI_KEY is now handled in the backend (api/subscribe.js)
            // But checking payload...

            // Add form_id to payload
            payload.form_id = 327110;

            btn.innerText = 'Küldés...';
            btn.style.opacity = '0.7';

            try {
                // Call our Proxy
                const response = await fetch(SAPI_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API Error Response:', errorText);
                    throw new Error('API Error: ' + response.status);
                }

                const responseData = await response.json();
                console.log('SAPI Response:', responseData);

                /*
                // NOTE: If Basic Auth is required instead of 'ns-api-key', use this headers block:
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('USERNAME:' + SAPI_KEY) 
                },
                */

                // Success UI
                btn.innerText = 'Sikeres Jelentkezés!';
                btn.style.backgroundColor = '#4BB543'; // Success Green
                btn.style.borderColor = '#4BB543';
                form.reset();

            } catch (error) {
                console.error('Submission Failed:', error);
                btn.innerText = 'Hiba történt. Próbáld újra!';
                btn.style.backgroundColor = '#D90429'; // Error Red
            } finally {
                // Reset button after 3 seconds
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                    btn.style.opacity = '1';
                }, 3000);
            }
        });
    }

    // Anchor smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

});
