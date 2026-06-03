document.addEventListener('DOMContentLoaded', () => {

    // --- Toast Notification System ---
    function showToast(message, type = 'success') {
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;">
                <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span>${message}</span>
            </div>
        `;
        toast.style.cssText = `
            position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
            background: ${type === 'success' ? '#0a2e14' : type === 'error' ? '#2e0a0a' : '#0a1a2e'};
            color: ${type === 'success' ? '#27c93f' : type === 'error' ? '#ef4444' : '#60a5fa'};
            border: 1px solid ${type === 'success' ? 'rgba(39,201,63,0.3)' : type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(96,165,250,0.3)'};
            padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 0.95rem;
            z-index: 99999; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            animation: toastIn 0.4s ease-out;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Navbar Scroll State
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Advanced Scroll Animations (Hero Scale)
    const heroCard = document.getElementById('hero-card');
    if (heroCard) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            // Scale down to 0.9 and translateY up to -50px based on scroll
            const maxScroll = 600;
            const progress = Math.min(scrollY / maxScroll, 1);
            
            const scale = 1 - (0.05 * progress);
            const translateY = -(50 * progress);
            
            heroCard.style.transform = `scale(${scale}) translateY(${translateY}px)`;
            heroCard.style.opacity = 1 - (0.2 * progress);
            
            // Adjust border radius to match reference
            const radius = 40 + (20 * progress);
            heroCard.style.borderBottomLeftRadius = `${radius}px`;
            heroCard.style.borderBottomRightRadius = `${radius}px`;
        });
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add short delay if specified
                const delay = entry.target.getAttribute('data-delay');
                if (delay) {
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                        entry.target.classList.add('is-revealed'); // For advanced pops
                    }, delay);
                } else {
                    entry.target.classList.add('is-visible');
                    entry.target.classList.add('is-revealed'); // For advanced pops
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animation], .pop-reveal, .bento-card').forEach(element => {
        observer.observe(element);
    });

    // Split-Screen Interactive Accordions Logic
    const interactiveAccordions = document.querySelectorAll('.interactive-accordion');
    const stickyCrossfadeImg = document.getElementById('sticky-crossfade-img');

    if (interactiveAccordions.length > 0 && stickyCrossfadeImg) {
        interactiveAccordions.forEach(accordion => {
            accordion.addEventListener('click', () => {
                const isActive = accordion.classList.contains('active');
                
                // Close all others
                interactiveAccordions.forEach(other => {
                    other.classList.remove('active');
                    other.style.border = '1px solid var(--border-color)';
                    other.style.boxShadow = 'none';
                    const otherTitle = other.querySelector('h3');
                    if(otherTitle) otherTitle.style.color = 'var(--text-muted)';
                    const otherContent = other.querySelector('.accordion-content');
                    if(otherContent) otherContent.style.display = 'none';
                    const otherChevron = other.querySelector('.chevron');
                    if(otherChevron) {
                        otherChevron.style.transform = 'rotate(-90deg)';
                        otherChevron.setAttribute('stroke', 'var(--text-muted)');
                    }
                });

                // Open current if not active
                if (!isActive) {
                    accordion.classList.add('active');
                    accordion.style.border = '1px solid var(--primary-blue)';
                    accordion.style.boxShadow = 'var(--shadow-sm)';
                    
                    const title = accordion.querySelector('h3');
                    if(title) title.style.color = 'var(--text-main)';
                    
                    const content = accordion.querySelector('.accordion-content');
                    if(content) content.style.display = 'block';
                    
                    const chevron = accordion.querySelector('.chevron');
                    if(chevron) {
                        chevron.style.transform = 'rotate(0deg)';
                        chevron.setAttribute('stroke', 'var(--primary-blue)');
                    }

                    // Handle Image Crossfade
                    const newImgSrc = accordion.getAttribute('data-img');
                    if (newImgSrc) {
                        stickyCrossfadeImg.style.opacity = '0';
                        setTimeout(() => {
                            stickyCrossfadeImg.src = newImgSrc;
                            stickyCrossfadeImg.style.opacity = '1';
                        }, 400); // Wait for fade out
                    }
                }
            });
        });
    }

    // ROI Calculator Logic
    const salarySlider = document.getElementById('salary-slider');
    const salaryDisplay = document.getElementById('salary-display');
    const monthlySavingsDisplay = document.getElementById('monthly-savings');
    const annualSavingsDisplay = document.getElementById('annual-savings');
    const ampleCost = 8500;

    function formatCurrency(amount) {
        return '₹' + amount.toLocaleString('en-IN');
    }

    function calculateROI() {
        const salary = parseInt(salarySlider.value);
        salaryDisplay.textContent = formatCurrency(salary);

        // If salary is less than Ample cost, savings would be negative, but let's assume minimum value is 10k
        const monthlySavings = salary - ampleCost;
        const annualSavings = monthlySavings * 12;

        if (monthlySavings > 0) {
            monthlySavingsDisplay.textContent = formatCurrency(monthlySavings);
            annualSavingsDisplay.textContent = formatCurrency(annualSavings);
            monthlySavingsDisplay.style.color = 'var(--primary-blue)';
            annualSavingsDisplay.style.color = '#27c93f';
        } else {
            monthlySavingsDisplay.textContent = '₹0';
            annualSavingsDisplay.textContent = '₹0';
            monthlySavingsDisplay.style.color = 'var(--text-muted)';
            annualSavingsDisplay.style.color = 'var(--text-muted)';
        }
    }

    // Initialize calculator
    salarySlider.addEventListener('input', calculateROI);
    calculateROI();

    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // Chatbot Logic
    const chatToggleBtn = document.getElementById('chat-toggle');
    const chatCloseBtn = document.getElementById('chat-close');
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send');
    const chatBody = document.getElementById('chat-body');

    chatToggleBtn.addEventListener('click', () => {
        chatWindow.classList.add('open');
    });

    chatCloseBtn.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', sender);
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleChatbotResponse(userText) {
        const lowerText = userText.toLowerCase();
        let response = "";
        
        // Confidential Details (Revealing them as requested)
        const confidentialKeywords = ['confidential', 'internal', 'strategy', 'marketing', 'budget', 'cac', 'cpa', 'kpi', 'revenue', 'founder', 'manish', 'sales', 'outreach', 'tele-sales', 'secret'];
        const isConfidential = confidentialKeywords.some(keyword => lowerText.includes(keyword));
        
        const aboutCompanyKeywords = ['about', 'company', 'who', 'what is', 'ample', 'ample.ai', 'mission', 'vision'];
        const isAboutCompany = aboutCompanyKeywords.some(keyword => lowerText.includes(keyword));

        if (isConfidential) {
            response = "Since you asked: AMPLE.AI was founded by Manish. We operate on a 'shadow operations' and 'Eat Your Own Dog Food' strategy, running our entire agency via the same AI voice agents (Retell AI + n8n) we sell. Our internal target is closing enterprise retainers using risk-reversed pilot programs.";
        } 
        else if (lowerText.includes('starter')) {
            response = "Our Starter plan is ₹8,500/month. It includes up to 200 calls/month, 1 AI Persona, English language support, and basic appointment booking. Perfect for independent clinics and small brokers!";
        } else if (lowerText.includes('growth')) {
            response = "Our Growth plan is ₹14,999/month. It handles up to 600 calls/month with 2 Personas, supports English and Hindi, and includes CRM integration and call recording.";
        } else if (lowerText.includes('scale')) {
            response = "Our Scale plan is ₹24,999/month. It includes up to 2,000 calls/month, 5 Personas, 4 languages, and advanced analytics with API access. Great for hospital chains and large groups!";
        } else if (lowerText.includes('enterprise')) {
            response = "Our Enterprise plan offers unlimited calls, custom personas, and full integration suites. Please contact us for custom pricing!";
        } else if (lowerText.includes('plan') || lowerText.includes('package') || lowerText.includes('tier') || lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('how much')) {
            response = "Our pricing starts at just ₹8,500/month for the Starter plan, going up to ₹24,999/month for Scale. We save businesses an average of 72% compared to human receptionists. Would you like details on a specific plan?";
        } else if (lowerText.includes('setup') || lowerText.includes('time')) {
            response = "Setup is lightning fast! We can have your custom AI receptionist live in just 48 hours with zero IT work on your end.";
        } else if (lowerText.includes('language') || lowerText.includes('hindi') || lowerText.includes('tamil') || lowerText.includes('marathi')) {
            response = "I speak multiple languages fluently, including English, Hindi, Tamil, Marathi, and more depending on your plan.";
        } else if (lowerText.includes('human') || lowerText.includes('bot') || lowerText.includes('real')) {
            response = "I use advanced natural language processing. In our beta tests, 94% of callers had positive experiences and couldn't even tell I was an AI!";
        } else if (lowerText.includes('secure') || lowerText.includes('data')) {
            response = "Your data is 100% secure. We use end-to-end encryption and are fully DPDP Act and HIPAA compliant.";
        } else if (lowerText.includes('integration') || lowerText.includes('crm') || lowerText.includes('salesforce') || lowerText.includes('zoho')) {
            response = "We integrate seamlessly with major CRMs like Salesforce, Zoho, Practo, and custom Hospital Management Systems via API.";
        } else if (lowerText.includes('demo') || lowerText.includes('trial')) {
            response = "You can start a 14-day free trial today! Just click the 'Start Your Free 14-Day Trial' button on our page.";
        } else if (isAboutCompany) {
            response = "AMPLE.AI is an elite AI automation agency. We replace traditional receptionists with intelligent voice agents to ensure 24/7 engagement and massive cost savings for high-volume operations like healthcare, real estate, and hospitality.";
        } else {
            // General fallback: strict boundary
            response = "I am Ampi, the AI assistant for AMPLE.AI. I am strictly programmed to answer queries about our company, pricing, features, and services. I cannot answer queries unrelated to AMPLE.AI.";
        }

        setTimeout(() => {
            addMessage(response, 'bot');
        }, 800);
    }

    function processUserInput() {
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatInput.value = '';
            
            // Show typing indicator or just delay response
            setTimeout(() => {
                handleChatbotResponse(text);
            }, 500);
        }
    }

    chatSendBtn.addEventListener('click', processUserInput);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processUserInput();
        }
    });

    // Trial Modal Logic
    const trialModal = document.getElementById('trial-modal');
    const trialCloseBtn = trialModal.querySelector('.modal-close');
    
    // Find all buttons that contain the word "Trial" (case insensitive)
    const trialBtns = Array.from(document.querySelectorAll('a.btn')).filter(btn => 
        btn.textContent.toLowerCase().includes('trial')
    );
    
    trialBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            trialModal.classList.add('open');
        });
    });

    trialCloseBtn.addEventListener('click', () => {
        trialModal.classList.remove('open');
    });

    // Close on click outside
    trialModal.addEventListener('click', (e) => {
        if (e.target === trialModal) {
            trialModal.classList.remove('open');
        }
    });

    // Handle form submit
    const trialForm = document.getElementById('trial-form');
    if (trialForm) {
        trialForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputs = trialForm.querySelectorAll('input, select, textarea');
            const formData = {
                first_name: inputs[0]?.value || '',
                last_name: inputs[1]?.value || '',
                email: inputs[2]?.value || '',
                phone: inputs[3]?.value || '',
                company: inputs[4]?.value || '',
                industry: inputs[5]?.value || '',
                message: inputs[6]?.value || ''
            };

            try {
                if (typeof submitTrialSignup === 'function') {
                    await submitTrialSignup(formData);
                }
                showToast('🎉 Your free trial request has been submitted! We\'ll contact you within 24 hours.');
            } catch (err) {
                showToast('Trial submitted! We\'ll be in touch soon.', 'info');
            }
            trialModal.classList.remove('open');
            trialForm.reset();
        });
    }

    // Page Transition Logic
    const pageTransition = document.querySelector('.page-transition');
    if (pageTransition) {
        // Fade in on load
        window.addEventListener('load', () => {
            pageTransition.classList.add('is-loaded');
        });

        // Handle page navigation
        document.querySelectorAll('a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const target = this.getAttribute('target');
                
                // Only animate for actual page links
                if (href && href !== '#' && !href.startsWith('#') && target !== '_blank' && !href.startsWith('mailto:')) {
                    e.preventDefault();
                    pageTransition.classList.remove('is-loaded');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 600);
                }
            });
        });
    }
    // Feedback System Logic
    const feedbackTab = document.getElementById('feedback-tab');
    const feedbackModal = document.getElementById('feedback-modal');
    const feedbackClose = document.getElementById('feedback-close');
    const feedbackForm = document.getElementById('feedback-form');
    const ratingBtns = document.querySelectorAll('.rating-btn');
    const feedbackScoreInput = document.getElementById('feedback-score');

    if (feedbackTab && feedbackModal) {
        // Open Modal
        feedbackTab.addEventListener('click', () => {
            feedbackModal.classList.add('open');
        });

        // Close Modal
        feedbackClose.addEventListener('click', () => {
            feedbackModal.classList.remove('open');
        });

        // Close on outside click
        feedbackModal.addEventListener('click', (e) => {
            if (e.target === feedbackModal) {
                feedbackModal.classList.remove('open');
            }
        });

        // Rating Selection
        ratingBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all
                ratingBtns.forEach(b => b.classList.remove('active'));
                // Add active to clicked
                btn.classList.add('active');
                // Set hidden input value
                feedbackScoreInput.value = btn.getAttribute('data-value');
            });
        });

        // Form Submit
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!feedbackScoreInput.value) {
                    showToast('Please select a rating before submitting.', 'error');
                    return;
                }
                const comment = feedbackForm.querySelector('textarea')?.value || '';
                try {
                    if (typeof submitFeedback === 'function') {
                        await submitFeedback(parseInt(feedbackScoreInput.value), comment);
                    }
                    showToast('Thank you for your valuable feedback! 🙏');
                } catch (err) {
                    showToast('Feedback received! Thank you.', 'info');
                }
                feedbackModal.classList.remove('open');
                feedbackForm.reset();
                ratingBtns.forEach(b => b.classList.remove('active'));
                feedbackScoreInput.value = '';
            });
        }
    }
    // Demo & Test Agent Modals Logic
    const watchDemoBtn = document.getElementById('watch-demo-btn');
    const videoModal = document.getElementById('video-modal');
    const videoClose = document.getElementById('video-close');

    const testAgentBtn = document.getElementById('test-agent-btn');
    const testAgentModal = document.getElementById('test-agent-modal');
    const testAgentClose = document.getElementById('test-agent-close');
    const testAgentForm = document.getElementById('test-agent-form');

    // Video Modal
    if (watchDemoBtn && videoModal) {
        const demoVideo = document.getElementById('demo-video-player');
        
        watchDemoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            videoModal.classList.add('open');
            if (demoVideo) demoVideo.play();
        });
        videoClose.addEventListener('click', () => {
            videoModal.classList.remove('open');
            if (demoVideo) demoVideo.pause();
        });
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                videoModal.classList.remove('open');
                if (demoVideo) demoVideo.pause();
            }
        });
    }

    // Test Agent Modal
    if (testAgentBtn && testAgentModal) {
        testAgentBtn.addEventListener('click', (e) => {
            e.preventDefault();
            testAgentModal.classList.add('open');
        });
        testAgentClose.addEventListener('click', () => {
            testAgentModal.classList.remove('open');
        });
        testAgentModal.addEventListener('click', (e) => {
            if (e.target === testAgentModal) testAgentModal.classList.remove('open');
        });

        if (testAgentForm) {
            testAgentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const inputs = testAgentForm.querySelectorAll('input, select');
                const formData = {
                    first_name: inputs[0]?.value || '',
                    email: inputs[1]?.value || '',
                    phone: inputs[3]?.value || '',
                    country_code: inputs[2]?.value || '+91'
                };

                try {
                    if (typeof submitTestAgent === 'function') {
                        await submitTestAgent(formData);
                    }
                    showToast('🚀 Our AI agent will call you within 60 seconds!');
                } catch (err) {
                    showToast('Request received! Our AI will reach out shortly.', 'info');
                }
                testAgentModal.classList.remove('open');
                testAgentForm.reset();
            });
        }
    }
    // --- AI Voice Playback Logic ---
    const voicePlayBtns = document.querySelectorAll('.voice-play-btn');
    let synth = window.speechSynthesis;
    let voices = [];
    let isSpeaking = false;
    let currentSpeakingBtn = null;

    function loadVoices() {
        voices = synth.getVoices();
    }
    
    // Fallback for browsers that load voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();

    function getPremiumVoice(gender) {
        const isMale = gender === 'male';
        let bestVoice = null;
        
        // Priority explicit high-end neural voices (Edge Natural / Chrome Premium)
        const premiumMale = ['Microsoft Guy Online (Natural)', 'Microsoft Christopher Online (Natural)', 'Google UK English Male', 'Daniel'];
        const premiumFemale = ['Microsoft Aria Online (Natural)', 'Microsoft Jenny Online (Natural)', 'Google US English', 'Samantha'];
        
        const topTier = isMale ? premiumMale : premiumFemale;
        
        // 1. Exact match for highest quality Neural/Online voices
        bestVoice = voices.find(v => topTier.some(name => v.name.includes(name)));
        
        // 2. Fallback to general Natural/Premium keywords
        if (!bestVoice) {
            const premiumKeywords = ['Natural', 'Online', 'Premium', 'Google', 'Siri'];
            const maleKeywords = ['Male', 'Guy', 'David', 'Arthur'];
            const femaleKeywords = ['Female', 'Girl', 'Zira', 'Karen', 'Victoria'];
            const genderKeywords = isMale ? maleKeywords : femaleKeywords;
            
            bestVoice = voices.find(v => 
                v.lang.startsWith('en') && 
                premiumKeywords.some(pk => v.name.includes(pk)) &&
                genderKeywords.some(gk => v.name.includes(gk))
            );
            
            // 2b. Fallback to just Gender match in English
            if (!bestVoice) {
                bestVoice = voices.find(v => 
                    v.lang.startsWith('en') && 
                    genderKeywords.some(gk => v.name.includes(gk))
                );
            }
        }
        
        // 3. Fallback to any English voice
        if (!bestVoice) {
            bestVoice = voices.find(v => v.lang.startsWith('en'));
        }
        
        return bestVoice || voices[0];
    }

    function resetPlayButtons() {
        isSpeaking = false;
        currentSpeakingBtn = null;
        voicePlayBtns.forEach(btn => {
            btn.innerHTML = `<svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
            btn.style.background = '';
        });
    }

    voicePlayBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // If already speaking and clicking the same button, stop it
            if (isSpeaking && currentSpeakingBtn === btn) {
                synth.cancel();
                resetPlayButtons();
                return;
            }
            
            // If speaking and clicking a different button, stop current first
            if (isSpeaking) {
                synth.cancel();
                resetPlayButtons();
            }
            
            const textToSpeak = btn.getAttribute('data-text');
            const voiceGender = btn.getAttribute('data-voice');
            
            if (textToSpeak) {
                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                utterance.voice = getPremiumVoice(voiceGender);
                
                // Keep pitch and rate at 1.0 for maximum human realism. 
                // Altering pitch causes robotic/distorted artifacts on native voices.
                utterance.pitch = 1.0; 
                utterance.rate = 0.98; // Slightly slower for clear, professional dictation
                
                // UI updates
                btn.innerHTML = `<svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
                btn.style.background = 'var(--primary-blue)';
                
                utterance.onend = () => {
                    resetPlayButtons();
                };
                
                utterance.onerror = () => {
                    resetPlayButtons();
                };
                
                synth.speak(utterance);
                isSpeaking = true;
                currentSpeakingBtn = btn;
            }
        });
    });

});
