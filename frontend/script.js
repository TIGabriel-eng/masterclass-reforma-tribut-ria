function smoothScroll(target, duration = 1200) {
    const targetEl = typeof target === 'string' ? document.querySelector(target) : target;
    if (!targetEl) return;
    const start = window.pageYOffset;
    const end = targetEl.getBoundingClientRect().top + start;
    const startTime = performance.now();

    function ease(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    function scroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, start + (end - start) * ease(progress));
        if (progress < 1) requestAnimationFrame(scroll);
    }

    requestAnimationFrame(scroll);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                smoothScroll(href);
            }
        });
    });
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('li');
                items.forEach((item, i) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, i * 150);
                });
                animObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const sections = document.querySelectorAll('.benefits-section, .cta-benefits');
    sections.forEach(s => animObserver.observe(s));

    const modObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('modulos-visible');
                modObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const ctaSection = document.querySelector('.cta-dual-section');
    if (ctaSection) modObserver.observe(ctaSection);

    const ytContainer = document.getElementById('ytPlayer');
    const playBtn = document.getElementById('videoPlayBtn');
    if (ytContainer && playBtn) {
        let player;
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
        window.onYouTubeIframeAPIReady = () => {
            player = new YT.Player('ytPlayer', {
                height: '400',
                width: '100%',
                videoId: 'ib0wuDAWElc',
                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    modestbranding: 1,
                    rel: 0,
                    iv_load_policy: 3,
                    showinfo: 0,
                    fs: 0,
                    controls: 0
                },
                events: {
                    onReady: () => {
                        player.mute();
                        player.playVideo();
                    }
                }
            });
        };
        playBtn.addEventListener('click', () => {
            if (player && player.unMute) {
                player.unMute();
                player.setVolume(100);
                playBtn.classList.add('hidden');
            }
        });
    }

    const moduloItems = document.querySelectorAll('.modulo-item');
    moduloItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('glow');
        });
        item.addEventListener('mouseleave', () => {
            item.classList.remove('glow');
        });
    });

    const bonusPill = document.querySelector('.bonus-pill');
    if (bonusPill) {
        function toggleGlow() {
            bonusPill.classList.add('glow');
            setTimeout(() => {
                bonusPill.classList.remove('glow');
            }, 2000);
        }
        setInterval(toggleGlow, 5000);
        toggleGlow();
    }

    const nivelCards = document.querySelectorAll('.nivel-card');
    if (nivelCards.length) {
        let idx = 0;
        function highlightNext() {
            nivelCards.forEach(c => c.classList.remove('destaque'));
            nivelCards[idx].classList.add('destaque');
            idx = (idx + 1) % nivelCards.length;
        }
        highlightNext();
        setInterval(highlightNext, 2500);
    }



    const btnGarantir = document.querySelector('.btn-garantir');
    if (btnGarantir) {
        function pulseGarantir() {
            btnGarantir.classList.add('pulse');
            setTimeout(() => btnGarantir.classList.remove('pulse'), 800);
        }
        setInterval(pulseGarantir, 2500);
        pulseGarantir();
    }

    const destaque = document.querySelector('.testemunho-destaque');
    if (destaque) {
        function dispararDestruicao() {
            destaque.classList.remove('destruir');
            void destaque.offsetWidth;
            destaque.classList.add('destruir');
        }
        destaque.addEventListener('animationend', () => {
            destaque.classList.remove('destruir');
            setTimeout(dispararDestruicao, 2000);
        });
        dispararDestruicao();
    }

    const track = document.getElementById('reviewsTrack');
    if (track) {
        const cards = Array.from(track.querySelectorAll('.review-card'));
        const total = cards.length;
        const cardWidth = cards[0].offsetWidth + 20;
        let current = 0;
        let autoPlay;

        cards.forEach(c => {
            track.appendChild(c.cloneNode(true));
        });

        function goTo(index, smooth = true) {
            current = index;
            track.style.transition = smooth ? 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none';
            track.style.transform = `translateX(-${current * cardWidth}px)`;
        }

        function next() {
            if (current >= total) {
                goTo(0, false);
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        goTo(1);
                    });
                });
            } else {
                goTo(current + 1);
            }
        }

        goTo(0, false);
        autoPlay = setInterval(next, 2500);
    }

    document.querySelectorAll('.ingresso-logo').forEach(img => {
        let growing = true;
        let scale = 1;
        setInterval(() => {
            if (growing) {
                scale += 0.01;
                if (scale >= 1.08) growing = false;
            } else {
                scale -= 0.01;
                if (scale <= 1) growing = true;
            }
            img.style.transform = `scale(${scale})`;
        }, 40);
    });

    document.querySelectorAll('.preco-card, .nivel-card, .modulo-item').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--shine-x', `${x}px`);
            card.style.setProperty('--shine-y', `${y}px`);
        });
    });

    const bonusLabel = document.querySelector('.bonus-section-label');
    if (bonusLabel) {
        const bonusObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bonusLabel.classList.add('destaque-total');
                    setTimeout(() => {
                        bonusLabel.classList.remove('destaque-total');
                    }, 2000);
                }
            });
        }, { threshold: 0.5 });
        bonusObs.observe(bonusLabel);
        setInterval(() => {
            if (bonusLabel.classList.contains('destaque-total')) return;
            bonusLabel.classList.add('destaque-total');
            setTimeout(() => {
                bonusLabel.classList.remove('destaque-total');
            }, 2000);
        }, 5000);
    }

    document.querySelectorAll('.tema-pill').forEach(pill => {
        pill.addEventListener('click', function () {
            document.querySelectorAll('.tema-pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            this.style.animation = 'none';
            void this.offsetWidth;
            this.style.animation = 'pillSelect 0.4s ease';
        });
    });

    document.addEventListener('selectstart', e => e.preventDefault());

});
