// GSAPを初期化
gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------
// A. SVG分解＆再構築ローディングアニメーション
// ----------------------------------------------------
function initLoadingAnimation() {
    // SVG内の要素セレクタ: index.htmlに合わせて .svg-element を使用
    const svgElements = document.querySelectorAll('#svg-container .svg-element');
    const tl = gsap.timeline({
        defaults: { duration: 1.2, ease: "power2.inOut" },
        onComplete: () => {
            gsap.to('#loading-screen', { duration: 0.7, opacity: 0, display: 'none', ease: "power1.in" });
            gsap.to('#main-content', { duration: 1.5, opacity: 1, ease: "power1.out" });
            initScrollAnimations();
        }
    });

    if (svgElements.length > 0) {
        tl.to(svgElements, {
            x: () => gsap.utils.random(-400, 400),
            y: () => gsap.utils.random(-400, 400),
            rotation: () => gsap.utils.random(-720, 720),
            opacity: 0,
            scale: 0.1,
            stagger: 0.015,
            duration: 1.5,
            ease: "power3.in"
        })
        .set(svgElements, { clearProps: "x,y,rotation,scale" }) 
        .to(svgElements, {
            opacity: 1,
            scale: 1,
            stagger: {
                each: 0.008,
                from: "random"
            },
            duration: 1.5,
            ease: "power3.out"
        }, "+=0.5")
        .to('#svg-container', { 
            scale: 0.1, 
            opacity: 0, 
            duration: 0.8
        }, "+=0.8"); 
    } else {
        gsap.to('#loading-screen', { duration: 0.5, opacity: 0, display: 'none' });
        gsap.to('#main-content', { duration: 1, opacity: 1 });
        initScrollAnimations();
    }
}

// ----------------------------------------------------
// B. スクロールに応じた要素の登場アニメーション
// ----------------------------------------------------
function initScrollAnimations() {
    const animTargets = document.querySelectorAll('.anim-target');

    animTargets.forEach(target => {
        gsap.from(target, {
            y: 50, 
            opacity: 0, 
            rotationX: -90, 
            ease: "power3.out",
            duration: 1.2,
            delay: target.dataset.delay || 0,
            scrollTrigger: {
                trigger: target, 
                start: "top 85%", 
                toggleActions: "play none none none", 
            }
        });
    });
}

// ----------------------------------------------------
// C. Discordボタンのパーティクル爆発アニメーション
// ----------------------------------------------------
function initParticleExplosion() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#0f0' },
            shape: { type: 'star' },
            opacity: { value: 0.8, random: true },
            size: { value: 4, random: true },
            line_linked: { enable: false },
            move: {
                enable: true,
                speed: 10,
                direction: 'top',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
            }
        },
        interactivity: { events: { onhover: { enable: false }, onclick: { enable: false } } },
        retina_detect: true
    });

    const particlesCanvas = document.getElementById('particles-js');
    const discordLink = document.getElementById('discord-link');
    const pJS = window.pJSDom[0].pJS;

    pJS.particles.move.enable = false;
    particlesCanvas.style.opacity = 0;

    discordLink.addEventListener('mouseenter', () => {
        gsap.to(particlesCanvas, { opacity: 1, duration: 0.3 });
        pJS.particles.move.enable = true;
        gsap.delayedCall(0.5, () => {
             pJS.particles.move.enable = false;
             gsap.to(particlesCanvas, { opacity: 0, duration: 1 });
        });
    });
}

// ----------------------------------------------------
// D. タップ/クリックで効果音と小さな桜が舞うアニメーション (統合)
// ----------------------------------------------------
function initTapSoundAndSakura() {
    const PETAL_COUNT = 8;
    const audio = document.getElementById('tap-se');

    document.addEventListener('click', (e) => {
        const clickX = e.clientX;
        const clickY = e.clientY;
        
        // 1. クリック音を再生
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(error => {
                // 自動再生ポリシー対策のためのエラー処理
            });
        }
        
        // 2. 桜の花びらを生成し、小さく舞わせる
        for (let i = 0; i < PETAL_COUNT; i++) {
            const petal = document.createElement('div');
            petal.classList.add('sakura-petal');
            document.body.appendChild(petal);

            gsap.set(petal, {
                x: clickX,
                y: clickY,
                opacity: 1,
                scale: gsap.utils.random(0.3, 0.8),
            });

            // 舞い上がりと回転 (短く、小さく舞うように調整)
            gsap.to(petal, {
                duration: gsap.utils.random(1.0, 2.0),
                x: clickX + gsap.utils.random(-50, 50),
                y: clickY + gsap.utils.random(-80, -30),
                rotation: gsap.utils.random(180, 360),
                opacity: 0, 
                ease: "power1.out",
                onComplete: () => {
                    petal.remove();
                }
            });
        }
    });
}

// ----------------------------------------------------
// E. サイト開始点 (loadイベント)
// ----------------------------------------------------
window.addEventListener('load', () => {
    initParticleExplosion(); 
    initTapSoundAndSakura();
    initLoadingAnimation();
});
