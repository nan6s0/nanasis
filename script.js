// GSAPを初期化
gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------
// A. SVG分解＆再構築ローディングアニメーション
// ----------------------------------------------------
function initLoadingAnimation() {
    const svgElements = document.querySelectorAll('#svg-container .svg-element');
    const tl = gsap.timeline({
        defaults: { duration: 1.2, ease: "power2.inOut" },
        onComplete: () => {
            // アニメーション完了後、ローディング画面をフェードアウト
            gsap.to('#loading-screen', { duration: 0.7, opacity: 0, display: 'none', ease: "power1.in" });
            gsap.to('#main-content', { duration: 1.5, opacity: 1, ease: "power1.out" });
            initScrollAnimations(); // ローディング完了後にスクロールアニメーションを有効化
        }
    });

    if (svgElements.length > 0) {
        // ステップ1: SVGを爆発的に分散させる
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
        .set(svgElements, { clearProps: "x,y,rotation,scale" }) // リセット
        // ステップ2: 元の位置に戻して再構築 (ランダムな順番で)
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
        // ステップ3: 再構築されたSVGを縮小してフェードアウト
        .to('#svg-container', { 
            scale: 0.1, 
            opacity: 0, 
            duration: 0.8
        }, "+=0.8"); 
    } else {
        // SVG要素がない場合のフォールバック
        console.error("SVG要素が見つかりませんでした。");
        gsap.to('#loading-screen', { duration: 0.5, opacity: 0, display: 'none' });
        gsap.to('#main-content', { duration: 1, opacity: 1 });
        initScrollAnimations();
    }
}

// ----------------------------------------------------
// B. スクロールに応じた要素の登場アニメーション
// ----------------------------------------------------
function initScrollAnimations() {
    // スクロール時にアニメーションするすべての要素を選択
    const animTargets = document.querySelectorAll('.anim-target');

    animTargets.forEach(target => {
        // 各要素の登場アニメーションを定義
        gsap.from(target, {
            y: 50, // 50px下から
            opacity: 0, // 透明な状態から
            rotationX: -90, // X軸に-90度回転した状態から
            ease: "power3.out",
            duration: 1.2,
            delay: target.dataset.delay || 0, // HTMLで設定した遅延時間を使用
            scrollTrigger: {
                trigger: target, // この要素がトリガー
                start: "top 85%", // 要素がビューポートの85%の位置に来たら開始
                toggleActions: "play none none none", // 一度再生されたら繰り返さない
            }
        });
    });
}


// ----------------------------------------------------
// C. Discordボタンのパーティクル爆発アニメーション
// ----------------------------------------------------
function initParticleExplosion() {
    // particles.jsの設定
    particlesJS('particles-js', {
        // 設定は「爆発」に特化したものに
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#0f0' },
            shape: { type: 'star' },
            opacity: { value: 0.8, random: true },
            size: { value: 4, random: true },
            line_linked: { enable: false },
            move: {
                enable: true,
                speed: 10, // 非常に速い
                direction: 'top', // 上方向（爆発のシミュレーション）
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
    const pJS = window.pJSDom[0].pJS; // particles.jsのインスタンスを取得

    // 初期状態ではパーティクルを停止 (非表示)
    pJS.particles.move.enable = false;
    particlesCanvas.style.opacity = 0;


    // ボタンクリック/ホバー時のエフェクト制御
    discordLink.addEventListener('mouseenter', () => {
        gsap.to(particlesCanvas, { opacity: 1, duration: 0.3 });
        pJS.particles.move.enable = true;
        // 飛び出した後、すぐに停止してフェードアウト
        gsap.delayedCall(0.5, () => {
             pJS.particles.move.enable = false;
             gsap.to(particlesCanvas, { opacity: 0, duration: 1 });
        });
    });
    
    // クリック時に一瞬、より大きな爆発をシミュレーションしたい場合 (任意)
    discordLink.addEventListener('click', (e) => {
         // クリック時にすぐにサーバー移動させない場合は preventDefault()
         // e.preventDefault(); 
         pJS.fn.particlesRefresh(); // パーティクルをリフレッシュして再配置
         pJS.particles.move.enable = true;
         gsap.to(particlesCanvas, { opacity: 1, duration: 0.3 });

         // 1秒後に停止とフェードアウト
         gsap.delayedCall(1, () => {
             pJS.particles.move.enable = false;
             gsap.to(particlesCanvas, { opacity: 0, duration: 1 });
         });
    });
}

// ----------------------------------------------------
// D. サイト開始点
// ----------------------------------------------------
window.addEventListener('load', () => {
    initParticleExplosion(); // パーティクルの初期化は最初に
    initLoadingAnimation(); // ローディングアニメーション開始
});
