/**
 * SEL Safety Corner - 溫馨星光木質調 3D 互動式社會情緒學習安全角
 * 重點優化與細節升級：
 * 1. 空間全面擴大為寬敞 8.6 x 8.6 木屋：
 *    - 「沙漏、七音木琴、幾何捏捏小圓桌」各自獨立擺放、間距寬敞，絕不重疊或卡在一起
 *    - 「抱抱熊、窗邊木臥榻、鼠尾草綠方抱枕、焦糖泡芙圓坐墊、愛心擁抱枕」錯落有致分布在雙層大地毯上，互不干擾
 * 2. 新增「溫馨星光」版本 & 360度溫馨繽紛星光點點天空：
 *    - 告別原本外面一片黑的背景！木屋周圍與窗外環繞 650 顆柔和圓形粉彩閃爍星點（暖金、櫻粉、薄荷綠、晴空藍、薰衣草紫）與 45 顆漂浮星光球
 * 3. 情緒天氣瓶與流沙漏星砂同步高彩度變色、原木七音木琴 (Do~Si)、無遮擋視訊安全鏡、樹洞文字先顯示再化為星塵
 */

(() => {
    'use strict';

    // =========================================================================
    // 1. Web Audio API 木質溫潤音效與自然白噪音合成器
    // =========================================================================
    class SoundEngine {
        constructor() {
            this.ctx = null;
            this.bgmPlaying = false;
            this.bgmNodes = [];
        }

        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playSquishSound(pitchOffset = 0) {
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            const baseFreq = 220 + pitchOffset * 38 + Math.random() * 25;
            osc.frequency.setValueAtTime(baseFreq, now);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.65, now + 0.08);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.22);

            gain.gain.setValueAtTime(0.005, now);
            gain.gain.linearRampToValueAtTime(0.18, now + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.24);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.25);
        }

        playPillowFluffSound() {
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const bufferSize = this.ctx.sampleRate * 0.22;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(420, now);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.002, now + 0.21);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start(now);

            const osc = this.ctx.createOscillator();
            const oGain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(165, now);
            osc.frequency.exponentialRampToValueAtTime(220, now + 0.16);
            oGain.gain.setValueAtTime(0.09, now);
            oGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            osc.connect(oGain);
            oGain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.19);
        }

        playWoodXylophone(noteIndex = 0) {
            this.init();
            if (!this.ctx) return;

            const diatonicFreqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88];
            const freq = diatonicFreqs[noteIndex % diatonicFreqs.length];
            const now = this.ctx.currentTime;

            const oscFundamental = this.ctx.createOscillator();
            const oscOvertone = this.ctx.createOscillator();
            const gainFund = this.ctx.createGain();
            const gainOver = this.ctx.createGain();

            oscFundamental.type = 'sine';
            oscFundamental.frequency.setValueAtTime(freq, now);

            oscOvertone.type = 'triangle';
            oscOvertone.frequency.setValueAtTime(freq * 3.98, now);

            gainFund.gain.setValueAtTime(0.001, now);
            gainFund.gain.linearRampToValueAtTime(0.24, now + 0.012);
            gainFund.gain.exponentialRampToValueAtTime(0.0008, now + 1.15);

            gainOver.gain.setValueAtTime(0.001, now);
            gainOver.gain.linearRampToValueAtTime(0.065, now + 0.005);
            gainOver.gain.exponentialRampToValueAtTime(0.0005, now + 0.13);

            oscFundamental.connect(gainFund);
            oscOvertone.connect(gainOver);
            gainFund.connect(this.ctx.destination);
            gainOver.connect(this.ctx.destination);

            oscFundamental.start(now);
            oscOvertone.start(now);
            oscFundamental.stop(now + 1.2);
            oscOvertone.stop(now + 0.14);
        }

        playSandFlipSound() {
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const bufferSize = this.ctx.sampleRate * 0.55;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(2100, now);
            filter.Q.setValueAtTime(2.8, now);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.09, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(now);
            this.playWoodXylophone(4);
        }

        playHugChord() {
            this.init();
            if (!this.ctx) return;

            const notes = [261.63, 329.63, 392.00, 523.25];
            notes.forEach((freq, idx) => {
                const now = this.ctx.currentTime + idx * 0.06;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.11, now + 0.08);
                gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.15);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 1.2);
            });
        }

        playSparkleChime() {
            this.init();
            if (!this.ctx) return;

            const notes = [392.00, 440.00, 523.25, 659.25, 783.99];
            notes.forEach((freq, i) => {
                const now = this.ctx.currentTime + i * 0.075;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.85);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.9);
            });
        }

        playBreathTone(freq = 432) {
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.075, now + 0.35);
            gain.gain.exponentialRampToValueAtTime(0.0005, now + 2.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 2.4);
        }

        toggleBGM() {
            this.init();
            if (!this.ctx) return false;

            if (this.bgmPlaying) {
                this.bgmNodes.forEach(node => {
                    try { node.stop && node.stop(); } catch (e) {}
                    try { node.disconnect && node.disconnect(); } catch (e) {}
                });
                this.bgmNodes = [];
                this.bgmPlaying = false;
                return false;
            }

            const bufferSize = this.ctx.sampleRate * 3;
            const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.014;
                b6 = white * 0.115926;
            }

            const whiteNoise = this.ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 520;

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.value = 0.32;

            whiteNoise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);
            whiteNoise.start();

            const padOsc1 = this.ctx.createOscillator();
            const padOsc2 = this.ctx.createOscillator();
            const padGain = this.ctx.createGain();

            padOsc1.type = 'sine';
            padOsc2.type = 'triangle';
            padOsc1.frequency.value = 174.61;
            padOsc2.frequency.value = 261.63;
            padGain.gain.value = 0.022;

            padOsc1.connect(padGain);
            padOsc2.connect(padGain);
            padGain.connect(this.ctx.destination);

            padOsc1.start();
            padOsc2.start();

            this.bgmNodes.push(whiteNoise, filter, noiseGain, padOsc1, padOsc2, padGain);
            this.bgmPlaying = true;
            return true;
        }
    }

    const sound = new SoundEngine();

    // =========================================================================
    // 2. 狀態與幼兒正向 SEL 引導語錄
    // =========================================================================
    const BEAR_QUOTES = [
        '「嗨！今天辛苦了，來靠著柔軟的大抱枕，熊熊永遠在這裡陪著你喔！」',
        '「深呼吸一下，抱緊軟綿綿的抱枕，滿天溫柔星光正守護著你。」',
        '「不管現在心裡是什麼天氣，熊熊都給你一個最安心的大擁抱！」',
        '「慢慢來沒關係，累了就躺在窗邊木臥榻的軟墊上看星星休息吧。」',
        '「每一個情緒都是我們的小信差，謝謝你願意聽聽心裡的聲音。」',
        '「拍拍蓬鬆的抱枕，把緊繃的力氣慢慢交給大地吧！」'
    ];

    const MIRROR_PROMPTS = [
        '「安全鏡練習 1：看看鏡子裡的自己，輕輕眨眨眼睛，跟自己說聲：我在這裡。」',
        '「安全鏡練習 2：試著把緊皺的眉頭慢慢鬆開，讓額頭像平靜的湖面一樣平滑。」',
        '「安全鏡練習 3：雙肩輕輕往下沉，嘴角微微揚起一點點，給自己一個溫柔的表情。」',
        '「安全鏡練習 4：手放在胸口感受心跳，對鏡子裡的自己點點頭：我已經很棒了！」'
    ];

    const STAR_SAND_PALETTE = [
        { mood: 'happy',   color: '#fbbf24', name: '暖陽金黃' },
        { mood: 'sad',     color: '#38bdf8', name: '晴空湛藍' },
        { mood: 'angry',   color: '#f43f5e', name: '珊瑚熾紅' },
        { mood: 'anxious', color: '#a855f7', name: '薰衣草紫' },
        { mood: 'tired',   color: '#10b981', name: '森林翠綠' },
        { mood: 'loved',   color: '#ec4899', name: '櫻花粉紅' }
    ];
    let currentSandPaletteIndex = 0;

    const MOOD_ADVICE = {
        happy: '【暖陽金黃星砂】感受到你的溫暖與平靜！天氣瓶與沙漏內的星砂已轉為暖陽金黃色！',
        sad: '【晴空湛藍星砂】難過想流淚也沒關係，眼淚會幫心靈洗洗澡。星砂已轉為溫柔湛藍色陪伴你。',
        angry: '【珊瑚熾紅星砂】生氣時身體充滿熱熱的能量。看著瓶中珊瑚紅星砂慢慢旋轉，或抱抱軟墊釋放張力吧！',
        anxious: '【薰衣草紫星砂】緊張不安時，看著薰衣草紫色的星砂與沙漏細沙緩緩落下，讓呼吸慢下來。',
        tired: '【森林翠綠星砂】累了的時候最需要溫柔的休息。翡翠綠星砂正散發著森林般的安定光芒。',
        loved: '【櫻花粉紅星砂】充滿安心與感謝的心就像溫暖的花朵！瓶內正閃耀著櫻花粉紅色的幸福星砂！'
    };

    const TREEHOLE_REPLIES = [
        '謝謝你願意把這句話告訴樹洞，樹洞已經用溫暖的木頭香氣把你的心情輕輕抱住囉！',
        '樹洞聽見你的聲音了！這份心事已經化作亮晶晶的森林螢火，你現在安全又輕鬆了。',
        '說出來真的需要很大的勇氣喔！樹洞會幫你好好守護這個秘密，並送你滿滿的溫暖力量。',
        '拍拍你，樹洞完全明白你的感受。現在深吸一口氣，看著它變成美麗的星塵飛走吧！'
    ];

    let squishCount = 0;
    let bearHugCount = 0;
    let mirrorStepIndex = 0;

    let toastTimer = null;
    function showToast(msg, iconClass = 'fa-solid fa-star') {
        const toast = document.getElementById('floating-toast');
        const toastMsg = document.getElementById('toast-message');
        const icon = toast.querySelector('i');
        if (!toast || !toastMsg) return;

        icon.className = iconClass;
        toastMsg.textContent = msg;
        toast.classList.add('show');

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3400);
    }

    // 動態繪製柔和圓形發光星點貼圖 (避免方形像素點，讓星光與雨滴溫潤柔和)
    function createSoftGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.85)');
        grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.25)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        const tex = new THREE.CanvasTexture(canvas);
        return tex;
    }
    const softStarTexture = createSoftGlowTexture();

    // =========================================================================
    // 3. Three.js 溫馨星光木質調 3D 場景建置 (告別外面一片黑，改為溫馨星夜紫木色)
    // =========================================================================
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x35293d);
    scene.fog = new THREE.FogExp2(0x35293d, 0.015);

    const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 120);
    camera.position.set(8.2, 5.8, 8.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.88;
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minPolarAngle = 0.18;
    controls.minDistance = 1.4;
    controls.maxDistance = 17;
    controls.target.set(0, 1.4, 0);

    // 配合擴大後的 8.6 x 8.6 寬敞房間，重新設定各區獨立對焦視角
    const cameraTargetPos = new THREE.Vector3(8.2, 5.8, 8.6);
    const controlsTargetLook = new THREE.Vector3(0, 1.4, 0);
    let isCameraTransitioning = false;

    const STATION_CAMERAS = {
        overview: { pos: new THREE.Vector3(8.2, 5.8, 8.6),    look: new THREE.Vector3(0, 1.4, 0) },
        bear:     { pos: new THREE.Vector3(1.2, 2.5, 2.2),    look: new THREE.Vector3(-1.65, 0.95, -1.55) },
        squishy:  { pos: new THREE.Vector3(4.1, 2.45, 2.25),  look: new THREE.Vector3(2.15, 0.82, -0.25) },
        sensory:  { pos: new THREE.Vector3(0.45, 2.05, 4.45), look: new THREE.Vector3(-0.05, 0.52, 1.95) },
        breath:   { pos: new THREE.Vector3(-1.65, 2.32, 1.72), look: new THREE.Vector3(-4.04, 2.28, 1.65) },
        mood:     { pos: new THREE.Vector3(1.15, 2.45, -1.05), look: new THREE.Vector3(1.35, 2.2, -3.62) }
    };

    function focusStation(stationKey) {
        const camCfg = STATION_CAMERAS[stationKey] || STATION_CAMERAS.overview;
        cameraTargetPos.copy(camCfg.pos);
        controlsTargetLook.copy(camCfg.look);
        isCameraTransitioning = true;

        document.querySelectorAll('.dock-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.station === stationKey);
        });

        document.querySelectorAll('.tab-section').forEach(sec => {
            sec.classList.remove('active');
        });
        const targetTab = document.getElementById(`tab-${stationKey}`);
        if (targetTab) targetTab.classList.add('active');

        const titles = {
            overview: { text: '木質安全角導覽與互動', icon: 'fa-solid fa-house-chimney-window' },
            bear:     { text: '溫暖抱抱熊 & 療癒抱枕軟墊', icon: 'fa-solid fa-couch' },
            squishy:  { text: '純幾何形狀感官捏捏', icon: 'fa-solid fa-shapes' },
            sensory:  { text: '木質星砂流沙漏 & 七音木琴', icon: 'fa-solid fa-hourglass-half' },
            breath:   { text: '呼吸木燈 & 視訊安全鏡', icon: 'fa-solid fa-video' },
            mood:     { text: '3D 情緒天氣瓶 & 原木樹洞', icon: 'fa-solid fa-jar' }
        };
        const t = titles[stationKey] || titles.overview;
        document.getElementById('panel-title-text').textContent = t.text;
        document.getElementById('panel-icon').className = t.icon;
    }

    controls.addEventListener('start', () => {
        isCameraTransitioning = false;
    });

    // =========================================================================
    // 4. 溫潤柔和木質調燈光配置
    // =========================================================================
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.56);
    scene.add(ambientLight);

    const mainDirLight = new THREE.DirectionalLight(0xffe4c4, 0.68);
    mainDirLight.position.set(7, 10, 6);
    mainDirLight.castShadow = true;
    mainDirLight.shadow.mapSize.width = 2048;
    mainDirLight.shadow.mapSize.height = 2048;
    mainDirLight.shadow.camera.near = 0.5;
    mainDirLight.shadow.camera.far = 28;
    const d = 6.8;
    mainDirLight.shadow.camera.left = -d;
    mainDirLight.shadow.camera.right = d;
    mainDirLight.shadow.camera.top = d;
    mainDirLight.shadow.camera.bottom = -d;
    mainDirLight.shadow.bias = -0.0005;
    scene.add(mainDirLight);

    const warmPointLight = new THREE.PointLight(0xffad42, 0.9, 13);
    warmPointLight.position.set(-2.0, 3.2, -2.0);
    warmPointLight.castShadow = true;
    scene.add(warmPointLight);

    const breathLight = new THREE.PointLight(0x84a98c, 0.75, 5.5);
    breathLight.position.set(-2.95, 1.55, 2.85);
    scene.add(breathLight);

    const jarPointLight = new THREE.PointLight(0xfbbf24, 1.15, 4.5);
    jarPointLight.position.set(1.1, 2.38, -3.2);
    scene.add(jarPointLight);

    // =========================================================================
    // 4.5 新增：360度溫馨繽紛星光點點天空 (解決外面一片黑的問題！)
    // =========================================================================
    const starSkyGroup = new THREE.Group();
    scene.add(starSkyGroup);

    // (A) 700 顆粉彩繽紛圓形柔光星星 (環繞整個木屋外部與上方天空)
    const skyStarCount = 700;
    const skyStarGeo = new THREE.BufferGeometry();
    const skyStarPositions = new Float32Array(skyStarCount * 3);
    const skyStarColors = new Float32Array(skyStarCount * 3);

    const pastelPalette = [
        new THREE.Color(0xfef08a), // 溫暖奶油金
        new THREE.Color(0xfbcfe8), // 櫻花粉紅
        new THREE.Color(0xa7f3d0), // 薄荷嫩綠
        new THREE.Color(0xbae6fd), // 晴空粉藍
        new THREE.Color(0xe9d5ff), // 薰衣草粉紫
        new THREE.Color(0xfed7aa)  // 蜜桃暖橘
    ];

    for (let i = 0; i < skyStarCount; i++) {
        // 分布在半徑 6.8 ~ 22 的球殼空間，避開房間內部中央
        const theta = Math.random() * Math.PI * 2;
        const y = -1.5 + Math.random() * 14.5;
        const radius = 6.8 + Math.random() * 14.0;
        skyStarPositions[i * 3] = Math.cos(theta) * radius;
        skyStarPositions[i * 3 + 1] = y;
        skyStarPositions[i * 3 + 2] = Math.sin(theta) * radius;

        const c = pastelPalette[i % pastelPalette.length];
        skyStarColors[i * 3] = c.r;
        skyStarColors[i * 3 + 1] = c.g;
        skyStarColors[i * 3 + 2] = c.b;
    }
    skyStarGeo.setAttribute('position', new THREE.BufferAttribute(skyStarPositions, 3));
    skyStarGeo.setAttribute('color', new THREE.BufferAttribute(skyStarColors, 3));

    const skyStarMat = new THREE.PointsMaterial({
        size: 0.42,
        map: softStarTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false
    });
    const skyStarsPoints = new THREE.Points(skyStarGeo, skyStarMat);
    starSkyGroup.add(skyStarsPoints);

    // (B) 48 顆環繞在木屋四周的立體溫馨發光小星球與八面體星芒
    const floatingStarOrbs = [];
    const orbGeo = new THREE.OctahedronGeometry(0.12, 0);
    for (let i = 0; i < 48; i++) {
        const col = pastelPalette[i % pastelPalette.length];
        const orbMat = new THREE.MeshBasicMaterial({
            color: col,
            transparent: true,
            opacity: 0.88,
            toneMapped: false
        });
        const orbMesh = new THREE.Mesh(orbGeo, orbMat);
        const angle = (i / 48) * Math.PI * 2;
        const dist = 5.4 + (i % 3) * 1.8;
        const baseY = 0.5 + Math.random() * 5.2;
        orbMesh.position.set(Math.cos(angle) * dist, baseY, Math.sin(angle) * dist);
        starSkyGroup.add(orbMesh);
        floatingStarOrbs.push({
            mesh: orbMesh,
            baseY,
            phase: i * 0.65,
            speed: 1.2 + (i % 4) * 0.4
        });
    }

    // =========================================================================
    // 5. 建立寬敞 8.6 x 8.6 溫暖木質房間結構 (各區寬敞獨立、絕不擁擠卡住)
    // =========================================================================
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    const interactableObjects = [];

    const oakWoodMat = new THREE.MeshStandardMaterial({ color: 0xc49a70, roughness: 0.68 });
    const birchWoodMat = new THREE.MeshStandardMaterial({ color: 0xdfc3a4, roughness: 0.62 });
    const walnutWoodMat = new THREE.MeshStandardMaterial({ color: 0x7d563c, roughness: 0.72 });
    const sageMat = new THREE.MeshStandardMaterial({ color: 0x7c9d84, roughness: 0.8 });
    const warmWallMat = new THREE.MeshStandardMaterial({ color: 0xcab69e, roughness: 0.92 });

    // 5.1 寬敞 8.6 x 8.6 溫潤橡木實木地板
    const floorGeo = new THREE.BoxGeometry(8.6, 0.26, 8.6);
    const floorMesh = new THREE.Mesh(floorGeo, oakWoodMat);
    floorMesh.position.set(0, -0.13, 0);
    floorMesh.receiveShadow = true;
    roomGroup.add(floorMesh);

    for (let i = -3.85; i <= 3.85; i += 0.55) {
        const seam = new THREE.Mesh(
            new THREE.BoxGeometry(8.58, 0.01, 0.022),
            walnutWoodMat
        );
        seam.position.set(0, 0.004, i);
        roomGroup.add(seam);
    }

    // 5.2 溫潤奶茶木色牆面 + 下半部北歐木格柵護牆板
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(8.6, 4.6, 0.25), warmWallMat);
    backWall.position.set(0, 2.17, -4.175);
    backWall.receiveShadow = true;
    roomGroup.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.25, 4.6, 8.6), warmWallMat);
    leftWall.position.set(-4.175, 2.17, 0);
    leftWall.receiveShadow = true;
    roomGroup.add(leftWall);

    const wainscotBack = new THREE.Mesh(new THREE.BoxGeometry(8.35, 1.45, 0.05), birchWoodMat);
    wainscotBack.position.set(0.08, 0.725, -4.03);
    wainscotBack.receiveShadow = true;
    roomGroup.add(wainscotBack);

    const wainscotLeft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.45, 8.35), birchWoodMat);
    wainscotLeft.position.set(-4.03, 0.725, 0.08);
    wainscotLeft.receiveShadow = true;
    roomGroup.add(wainscotLeft);

    for (let i = -3.9; i <= 4.0; i += 0.28) {
        const slatBack = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.42, 0.04), oakWoodMat);
        slatBack.position.set(i, 0.73, -3.99);
        roomGroup.add(slatBack);

        const slatLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.42, 0.08), oakWoodMat);
        slatLeft.position.set(-3.99, 0.73, i);
        roomGroup.add(slatLeft);
    }

    const railBack = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.07, 0.09), walnutWoodMat);
    railBack.position.set(0.06, 1.48, -4.01);
    roomGroup.add(railBack);

    const railLeft = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.07, 8.4), walnutWoodMat);
    railLeft.position.set(-4.01, 1.48, 0.06);
    roomGroup.add(railLeft);

    // 5.3 原木框星光景觀窗戶 (窗外帶有繽紛閃爍小星星與溫暖月亮！)
    const windowGroup = new THREE.Group();
    windowGroup.position.set(-4.02, 2.72, -0.85);
    roomGroup.add(windowGroup);

    const windowSkyMat = new THREE.MeshBasicMaterial({ color: 0x2b2448, toneMapped: false });
    const windowSky = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.85), windowSkyMat);
    windowSky.rotation.y = Math.PI / 2;
    windowGroup.add(windowSky);

    const celestialMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, toneMapped: false });
    const celestialBody = new THREE.Mesh(new THREE.CircleGeometry(0.24, 28), celestialMat);
    celestialBody.rotation.y = Math.PI / 2;
    celestialBody.position.set(0.01, 0.42, -0.42);
    windowGroup.add(celestialBody);

    // 窗景內的 32 顆繽紛小星星點綴
    const winStarGroup = new THREE.Group();
    winStarGroup.position.x = 0.012;
    windowGroup.add(winStarGroup);
    for (let i = 0; i < 32; i++) {
        const wsCol = pastelPalette[i % pastelPalette.length];
        const wsMat = new THREE.MeshBasicMaterial({ color: wsCol, toneMapped: false });
        const wsDot = new THREE.Mesh(new THREE.CircleGeometry(0.018 + (i % 3) * 0.008, 12), wsMat);
        wsDot.rotation.y = Math.PI / 2;
        wsDot.position.set(0, -0.75 + Math.random() * 1.5, -0.82 + Math.random() * 1.64);
        winStarGroup.add(wsDot);
    }

    const fTop = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 2.04), walnutWoodMat);
    fTop.position.set(0.03, 0.94, 0);
    const fBot = fTop.clone();
    fBot.position.set(0.03, -0.94, 0);
    const fLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.95, 0.12), walnutWoodMat);
    fLeft.position.set(0.03, 0, -0.96);
    const fRight = fLeft.clone();
    fRight.position.set(0.03, 0, 0.96);
    const fCrossH = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 1.92), oakWoodMat);
    fCrossH.position.set(0.04, 0, 0);
    const fCrossV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.85, 0.06), oakWoodMat);
    fCrossV.position.set(0.04, 0, 0);
    windowGroup.add(fTop, fBot, fLeft, fRight, fCrossH, fCrossV);

    // 5.4 寬敞亞麻編織與鼠尾草綠雙層圓地毯
    const outerRug = new THREE.Mesh(
        new THREE.CylinderGeometry(3.15, 3.2, 0.05, 56),
        new THREE.MeshStandardMaterial({ color: 0xcbb29c, roughness: 0.95 })
    );
    outerRug.position.set(-0.25, 0.025, 0.1);
    outerRug.receiveShadow = true;
    roomGroup.add(outerRug);

    const innerRug = new THREE.Mesh(
        new THREE.CylinderGeometry(2.35, 2.35, 0.065, 56),
        new THREE.MeshStandardMaterial({ color: 0x94a889, roughness: 0.92 })
    );
    innerRug.position.set(-0.25, 0.032, 0.1);
    innerRug.receiveShadow = true;
    roomGroup.add(innerRug);

    // 5.5 亞麻燕麥色懶骨頭沙發墊 (熊熊的專屬座位：移至左後方 -1.75, -1.95，與周圍抱枕保持寬敞距離)
    const beanbagGeo = new THREE.SphereGeometry(1.08, 32, 24);
    beanbagGeo.scale(1.12, 0.48, 1.08);
    const beanbagMat = new THREE.MeshStandardMaterial({ color: 0xd8c8b8, roughness: 0.88 });
    const beanbag = new THREE.Mesh(beanbagGeo, beanbagMat);
    beanbag.position.set(-1.75, 0.4, -1.95);
    beanbag.castShadow = true;
    beanbag.receiveShadow = true;
    roomGroup.add(beanbag);

    // =========================================================================
    // 5.6 獨立寬敞擺放的「3D 療癒抱枕與軟墊專區」 (與熊熊及彼此皆保持清晰間距，絕不卡在一起！)
    // =========================================================================
    const interactivePillows = [];

    // (A) 窗邊原木臥榻矮櫃 + 厚實絎縫長軟墊 + 兩側圓筒滾邊靠枕 (貼合左牆 x = -3.55, z = -0.85)
    const daybedGroup = new THREE.Group();
    daybedGroup.position.set(-3.55, 0, -0.85);
    roomGroup.add(daybedGroup);

    const benchBase = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.36, 1.92), oakWoodMat);
    benchBase.position.y = 0.18;
    benchBase.castShadow = true;
    benchBase.receiveShadow = true;
    daybedGroup.add(benchBase);

    const mattressGroup = new THREE.Group();
    mattressGroup.position.set(0, 0.42, 0);
    daybedGroup.add(mattressGroup);

    const mattressMat = new THREE.MeshStandardMaterial({ color: 0xf2e8dc, roughness: 0.86 });
    const mattressMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.14, 1.86), mattressMat);
    mattressMesh.castShadow = true;
    mattressMesh.receiveShadow = true;
    mattressGroup.add(mattressMesh);

    const bolsterMat = new THREE.MeshStandardMaterial({ color: 0xc89f81, roughness: 0.82 });
    const bolsterGeo = new THREE.CylinderGeometry(0.125, 0.125, 0.62, 20);
    const bolsterLeft = new THREE.Mesh(bolsterGeo, bolsterMat);
    bolsterLeft.rotation.z = Math.PI / 2;
    bolsterLeft.position.set(0, 0.15, -0.76);
    bolsterLeft.castShadow = true;

    const bolsterRight = bolsterLeft.clone();
    bolsterRight.position.set(0, 0.15, 0.76);
    mattressGroup.add(bolsterLeft, bolsterRight);

    mattressGroup.traverse(c => {
        if (c.isMesh) {
            c.userData = { type: 'pillow', label: '窗邊木臥榻長軟墊與靠枕 (點擊拍鬆軟墊)' };
            interactableObjects.push(c);
        }
    });
    interactivePillows.push({ group: mattressGroup, deform: 0, velocity: 0 });

    // (B) 雲朵造型亞麻大靠枕 (擺放在懶骨頭後方斜靠牆角 x = -2.35, y = 0.76, z = -2.55，不與熊熊重疊)
    const cloudPillowGroup = new THREE.Group();
    cloudPillowGroup.position.set(-2.35, 0.76, -2.55);
    cloudPillowGroup.rotation.y = Math.PI * 0.22;
    scene.add(cloudPillowGroup);

    const cloudPillowMat = new THREE.MeshStandardMaterial({ color: 0xf7f1e5, roughness: 0.85 });
    const cpCenter = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 20), cloudPillowMat);
    cpCenter.scale.set(1.3, 0.85, 0.45);
    const cpLeft = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 16), cloudPillowMat);
    cpLeft.scale.set(1.05, 0.8, 0.42);
    cpLeft.position.set(-0.34, -0.04, 0);
    const cpRight = cpLeft.clone();
    cpRight.position.set(0.34, -0.04, 0);
    cloudPillowGroup.add(cpCenter, cpLeft, cpRight);

    cloudPillowGroup.traverse(c => {
        if (c.isMesh) {
            c.castShadow = true;
            c.userData = { type: 'pillow', label: '雲朵造型蓬鬆大靠枕 (點擊拍拍抱枕)' };
            interactableObjects.push(c);
        }
    });
    interactivePillows.push({ group: cloudPillowGroup, deform: 0, velocity: 0 });

    // (C) 鼠尾草綠四角絨球方形抱枕 (獨立擺放在地毯左前側 x = -2.25, y = 0.24, z = 0.15)
    const sagePillowGroup = new THREE.Group();
    sagePillowGroup.position.set(-2.25, 0.24, 0.15);
    sagePillowGroup.rotation.set(-1.15, 0.3, 0.25);
    scene.add(sagePillowGroup);

    const sagePillowMat = new THREE.MeshStandardMaterial({ color: 0x84a98c, roughness: 0.82 });
    const pomPomMat = new THREE.MeshStandardMaterial({ color: 0xfefae0, roughness: 0.9 });
    const spBodyGeo = new THREE.SphereGeometry(0.34, 24, 20);
    spBodyGeo.scale(1.05, 1.05, 0.46);
    const spBody = new THREE.Mesh(spBodyGeo, sagePillowMat);
    spBody.castShadow = true;
    sagePillowGroup.add(spBody);

    const pomCoords = [[-0.26, 0.26], [0.26, 0.26], [-0.26, -0.26], [0.26, -0.26]];
    pomCoords.forEach(([px, py]) => {
        const pom = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), pomPomMat);
        pom.position.set(px, py, 0);
        sagePillowGroup.add(pom);
    });

    sagePillowGroup.traverse(c => {
        if (c.isMesh) {
            c.userData = { type: 'pillow', label: '鼠尾草綠絨球方抱枕 (點擊抱抱軟墊)' };
            interactableObjects.push(c);
        }
    });
    interactivePillows.push({ group: sagePillowGroup, deform: 0, velocity: 0 });

    // (D) 焦糖格紋鈕扣圓形泡芙坐墊 (獨立擺放在熊熊右側地毯 x = -0.15, y = 0.22, z = -1.75)
    const poufGroup = new THREE.Group();
    poufGroup.position.set(-0.15, 0.22, -1.75);
    scene.add(poufGroup);

    const poufMat = new THREE.MeshStandardMaterial({ color: 0xd99b66, roughness: 0.84 });
    const poufBodyGeo = new THREE.SphereGeometry(0.45, 28, 20);
    poufBodyGeo.scale(1.1, 0.45, 1.1);
    const poufBody = new THREE.Mesh(poufBodyGeo, poufMat);
    poufBody.castShadow = true;
    poufBody.receiveShadow = true;
    poufGroup.add(poufBody);

    const tuftBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.03, 16), walnutWoodMat);
    tuftBtn.position.y = 0.2;
    poufGroup.add(tuftBtn);

    poufGroup.traverse(c => {
        if (c.isMesh) {
            c.userData = { type: 'pillow', label: '焦糖泡芙圓形軟坐墊 (點擊按壓坐墊)' };
            interactableObjects.push(c);
        }
    });
    interactivePillows.push({ group: poufGroup, deform: 0, velocity: 0 });

    // (E) 溫暖赤陶粉愛心擁抱軟墊 (獨立擺放在地毯中央偏左 x = -1.05, y = 0.22, z = -0.45)
    const rosePillowGroup = new THREE.Group();
    rosePillowGroup.position.set(-1.05, 0.22, -0.45);
    rosePillowGroup.rotation.set(-1.25, -0.25, -0.15);
    scene.add(rosePillowGroup);

    const rosePillowMat = new THREE.MeshStandardMaterial({ color: 0xe5989b, roughness: 0.82 });
    const rpLeft = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 16), rosePillowMat);
    rpLeft.scale.set(1, 1.15, 0.55);
    rpLeft.position.set(-0.11, 0.04, 0);
    const rpRight = rpLeft.clone();
    rpRight.position.set(0.11, 0.04, 0);
    const rpBot = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.32, 20), rosePillowMat);
    rpBot.scale.set(1.1, 1, 0.45);
    rpBot.rotation.x = Math.PI;
    rpBot.position.set(0, -0.12, 0);
    rosePillowGroup.add(rpLeft, rpRight, rpBot);

    rosePillowGroup.traverse(c => {
        if (c.isMesh) {
            c.castShadow = true;
            c.userData = { type: 'pillow', label: '溫暖愛心擁抱軟墊 (點擊擁抱抱枕)' };
            interactableObjects.push(c);
        }
    });
    interactivePillows.push({ group: rosePillowGroup, deform: 0, velocity: 0 });

    function triggerPillowFluff() {
        sound.playPillowFluffSound();
        interactivePillows.forEach(p => {
            p.deform = -0.38;
            p.velocity = 0.14;
            const pos = new THREE.Vector3();
            p.group.getWorldPosition(pos);
            pos.y -= 0.6;
            spawnWarmParticles(pos, 3, 0xfbbf24);
        });
        showToast('拍了拍蓬鬆柔軟的抱枕與軟墊，好舒服、好有安全感！', 'fa-solid fa-couch');
    }

    // 5.7 牆上木質串珠與暖光小夜燈串
    const fairyBulbs = [];
    const bulbGeo = new THREE.SphereGeometry(0.065, 12, 12);
    for (let i = 0; i < 15; i++) {
        const t = i / 14;
        const x = -3.75 + t * 7.5;
        const y = 3.95 - Math.sin(t * Math.PI) * 0.35;
        const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffdead, toneMapped: false });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(x, y, -4.01);
        roomGroup.add(bulb);
        fairyBulbs.push({ mesh: bulb, phase: i * 0.6 });
    }

    // =========================================================================
    // 6. 溫暖抱抱熊 (3D Teddy Bear - 獨立坐於懶骨頭上 x = -1.72, z = -1.85)
    // =========================================================================
    const bearGroup = new THREE.Group();
    bearGroup.position.set(-1.72, 0.7, -1.85);
    bearGroup.rotation.y = Math.PI * 0.22;
    scene.add(bearGroup);

    const bearFurMat = new THREE.MeshStandardMaterial({ color: 0xc68b59, roughness: 0.82 });
    const bearLightMat = new THREE.MeshStandardMaterial({ color: 0xf5ebe0, roughness: 0.85 });
    const bearDarkMat = new THREE.MeshStandardMaterial({ color: 0x2b2118, roughness: 0.35 });
    const bearBlushMat = new THREE.MeshBasicMaterial({ color: 0xe07a5f, transparent: true, opacity: 0.55 });
    const sageRibbonMat = new THREE.MeshStandardMaterial({ color: 0x7c9d84, roughness: 0.5 });

    const torsoGeo = new THREE.SphereGeometry(0.58, 28, 24);
    torsoGeo.scale(1, 1.12, 0.92);
    const bearTorso = new THREE.Mesh(torsoGeo, bearFurMat);
    bearTorso.position.set(0, 0.55, 0);
    bearTorso.castShadow = true;
    bearGroup.add(bearTorso);

    const bellyGeo = new THREE.SphereGeometry(0.41, 24, 20);
    bellyGeo.scale(0.95, 1.05, 0.5);
    const bearBelly = new THREE.Mesh(bellyGeo, bearLightMat);
    bearBelly.position.set(0, 0.53, 0.38);
    bearGroup.add(bearBelly);

    const bearHeadGroup = new THREE.Group();
    bearHeadGroup.position.set(0, 1.32, 0.04);
    bearGroup.add(bearHeadGroup);

    const headGeo = new THREE.SphereGeometry(0.48, 28, 24);
    headGeo.scale(1.05, 0.98, 0.98);
    const bearHead = new THREE.Mesh(headGeo, bearFurMat);
    bearHead.castShadow = true;
    bearHeadGroup.add(bearHead);

    const earGeo = new THREE.SphereGeometry(0.18, 20, 16);
    earGeo.scale(1, 1, 0.55);
    const leftEar = new THREE.Mesh(earGeo, bearFurMat);
    leftEar.position.set(-0.38, 0.38, -0.05);
    const rightEar = leftEar.clone();
    rightEar.position.set(0.38, 0.38, -0.05);
    bearHeadGroup.add(leftEar, rightEar);

    const innerEarGeo = new THREE.SphereGeometry(0.1, 16, 12);
    innerEarGeo.scale(1, 1, 0.4);
    const leftInnerEar = new THREE.Mesh(innerEarGeo, bearLightMat);
    leftInnerEar.position.set(-0.38, 0.37, 0.03);
    const rightInnerEar = leftInnerEar.clone();
    rightInnerEar.position.set(0.38, 0.37, 0.03);
    bearHeadGroup.add(leftInnerEar, rightInnerEar);

    const snoutGeo = new THREE.SphereGeometry(0.2, 20, 16);
    snoutGeo.scale(1.2, 0.9, 0.85);
    const bearSnout = new THREE.Mesh(snoutGeo, bearLightMat);
    bearSnout.position.set(0, -0.08, 0.42);
    bearHeadGroup.add(bearSnout);

    const noseGeo = new THREE.SphereGeometry(0.065, 16, 12);
    noseGeo.scale(1.3, 0.9, 0.8);
    const bearNose = new THREE.Mesh(noseGeo, bearDarkMat);
    bearNose.position.set(0, -0.02, 0.57);
    bearHeadGroup.add(bearNose);

    const eyeGeo = new THREE.SphereGeometry(0.055, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, bearDarkMat);
    leftEye.position.set(-0.18, 0.09, 0.43);
    const rightEye = leftEye.clone();
    rightEye.position.set(0.18, 0.09, 0.43);
    bearHeadGroup.add(leftEye, rightEye);

    const blushGeo = new THREE.CircleGeometry(0.085, 16);
    const leftBlush = new THREE.Mesh(blushGeo, bearBlushMat);
    leftBlush.position.set(-0.29, -0.04, 0.43);
    leftBlush.rotation.y = -0.35;
    const rightBlush = leftBlush.clone();
    rightBlush.position.set(0.29, -0.04, 0.43);
    rightBlush.rotation.y = 0.35;
    bearHeadGroup.add(leftBlush, rightBlush);

    const bowCenter = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), sageRibbonMat);
    bowCenter.position.set(0, 0.98, 0.46);
    const bowWingGeo = new THREE.ConeGeometry(0.11, 0.18, 12);
    const bowLeft = new THREE.Mesh(bowWingGeo, sageRibbonMat);
    bowLeft.rotation.z = -Math.PI / 2;
    bowLeft.position.set(-0.1, 0.98, 0.46);
    const bowRight = new THREE.Mesh(bowWingGeo, sageRibbonMat);
    bowRight.rotation.z = Math.PI / 2;
    bowRight.position.set(0.1, 0.98, 0.46);
    bearGroup.add(bowCenter, bowLeft, bowRight);

    const armGeo = new THREE.SphereGeometry(0.2, 20, 16);
    armGeo.scale(0.85, 1.85, 0.85);
    const leftArm = new THREE.Mesh(armGeo, bearFurMat);
    leftArm.position.set(-0.56, 0.65, 0.15);
    leftArm.rotation.z = 0.45;
    leftArm.rotation.x = -0.35;
    leftArm.castShadow = true;

    const rightArm = new THREE.Mesh(armGeo, bearFurMat);
    rightArm.position.set(0.56, 0.65, 0.15);
    rightArm.rotation.z = -0.45;
    rightArm.rotation.x = -0.35;
    rightArm.castShadow = true;
    bearGroup.add(leftArm, rightArm);

    const legGeo = new THREE.SphereGeometry(0.23, 20, 16);
    legGeo.scale(0.95, 0.9, 1.55);
    const leftLeg = new THREE.Mesh(legGeo, bearFurMat);
    leftLeg.position.set(-0.34, 0.18, 0.42);
    leftLeg.rotation.y = 0.25;
    const rightLeg = leftLeg.clone();
    rightLeg.position.set(0.34, 0.18, 0.42);
    rightLeg.rotation.y = -0.25;
    bearGroup.add(leftLeg, rightLeg);

    bearGroup.traverse(child => {
        if (child.isMesh) {
            child.userData = { type: 'bear', label: '溫暖抱抱熊 (點擊擁抱)' };
            interactableObjects.push(child);
        }
    });

    let bearAnimTimer = 0;
    let bearAnimMode = 'idle';

    const floatingParticles = [];
    function spawnWarmParticles(originPos, count = 6, colorHex = 0xfbbf24) {
        for (let i = 0; i < count; i++) {
            const pMat = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? colorHex : 0x84a98c,
                transparent: true,
                opacity: 0.95,
                toneMapped: false
            });
            const pMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.085, 1), pMat);
            pMesh.position.copy(originPos);
            pMesh.position.x += (Math.random() - 0.5) * 0.85;
            pMesh.position.y += 0.95 + Math.random() * 0.45;
            pMesh.position.z += (Math.random() - 0.5) * 0.85;
            scene.add(pMesh);
            floatingParticles.push({
                mesh: pMesh,
                vy: 0.022 + Math.random() * 0.016,
                vx: (Math.random() - 0.5) * 0.01,
                life: 1.0
            });
        }
    }

    function triggerBearHug(mode = 'hug') {
        bearAnimMode = mode;
        bearAnimTimer = 1.6;
        bearHugCount++;
        sound.playHugChord();
        spawnWarmParticles(bearGroup.position, mode === 'hug' ? 8 : 5, 0xe07a5f);

        interactivePillows.forEach(p => {
            p.deform = -0.22;
            p.velocity = 0.09;
        });

        const quote = BEAR_QUOTES[Math.floor(Math.random() * BEAR_QUOTES.length)];
        const speechEl = document.getElementById('bear-speech');
        if (speechEl) {
            speechEl.innerHTML = `<i class="fa-solid fa-comment-dots"></i> ${quote}`;
        }
        const loveEl = document.getElementById('bear-love-count');
        if (loveEl) {
            loveEl.textContent = `${100 + bearHugCount * 10}%`;
        }
        showToast(mode === 'hug' ? '熊熊與柔軟抱枕給了你一個超溫暖的大擁抱！' : '輕輕摸摸熊熊，心情也跟著平靜下來', 'fa-solid fa-heart');
    }

    // =========================================================================
    // 7. 純幾何形狀感官舒壓捏捏小圓桌 (獨立擺放於右側 x = 2.15, z = -0.25，與沙漏、木琴完全分開！)
    // =========================================================================
    const tableGroup = new THREE.Group();
    tableGroup.position.set(2.15, 0, -0.25);
    scene.add(tableGroup);

    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.1, 36), birchWoodMat);
    tableTop.position.set(0, 0.58, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    const trayRim = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.83, 0.05, 32), oakWoodMat);
    trayRim.position.set(0, 0.64, 0);
    trayRim.receiveShadow = true;
    tableGroup.add(trayRim);

    const legCylGeo = new THREE.CylinderGeometry(0.065, 0.045, 0.56, 16);
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        const tLeg = new THREE.Mesh(legCylGeo, walnutWoodMat);
        tLeg.position.set(Math.cos(angle) * 0.7, 0.28, Math.sin(angle) * 0.7);
        tLeg.castShadow = true;
        tableGroup.add(tLeg);
    }

    const squishyToys = [];

    // 7.1 柔光圓球
    const sphereGroup = new THREE.Group();
    sphereGroup.position.set(-0.32, 0.66, 0.28);
    tableGroup.add(sphereGroup);

    const sphereMat = new THREE.MeshStandardMaterial({
        color: 0xf4a261,
        roughness: 0.28,
        emissive: 0xe07a5f,
        emissiveIntensity: 0.12
    });
    const sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 28), sphereMat);
    sphereMesh.position.y = 0.21;
    sphereMesh.castShadow = true;
    sphereGroup.add(sphereMesh);

    sphereGroup.traverse(c => {
        if (c.isMesh) {
            c.userData = { type: 'squishy', id: 'sphere', label: '幾何感官捏捏：柔光圓球 (點擊按壓)' };
            interactableObjects.push(c);
        }
    });
    squishyToys.push({ id: 'sphere', name: '柔光圓球', group: sphereGroup, velocity: 0, deform: 0, pitch: 0 });

    // 7.2 溫潤方塊
    const cubeGroup = new THREE.Group();
    cubeGroup.position.set(0.32, 0.66, 0.28);
    tableGroup.add(cubeGroup);

    const cubeMat = new THREE.MeshStandardMaterial({
        color: 0x84a98c,
        roughness: 0.32,
        emissive: 0x52796f,
        emissiveIntensity: 0.12
    });
    const cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), cubeMat);
    cubeMesh.position.y = 0.18;
    cubeMesh.rotation.y = Math.PI / 6;
    cubeMesh.castShadow = true;
    cubeGroup.add(cubeMesh);

    cubeGroup.traverse(c => {
        if (c.isMesh) {
            c.userData = { type: 'squishy', id: 'cube', label: '幾何感官捏捏：溫潤方塊 (點擊按壓)' };
            interactableObjects.push(c);
        }
    });
    squishyToys.push({ id: 'cube', name: '溫潤方塊', group: cubeGroup, velocity: 0, deform: 0, pitch: 1 });

    // 7.3 感官圓環
    const torusGroup = new THREE.Group();
    torusGroup.position.set(-0.32, 0.66, -0.28);
    tableGroup.add(torusGroup);

    const torusMat = new THREE.MeshStandardMaterial({
        color: 0x7ea8be,
        roughness: 0.26,
        emissive: 0x457b9d,
        emissiveIntensity: 0.12
    });
    const torusMesh = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.085, 20, 36), torusMat);
    torusMesh.rotation.x = Math.PI / 2;
    torusMesh.position.y = 0.09;
    torusMesh.castShadow = true;
    torusGroup.add(torusMesh);

    torusGroup.traverse(c => {
        if (c.isMesh) {
            c.userData = { type: 'squishy', id: 'torus', label: '幾何感官捏捏：感官圓環 (點擊按壓)' };
            interactableObjects.push(c);
        }
    });
    squishyToys.push({ id: 'torus', name: '感官圓環', group: torusGroup, velocity: 0, deform: 0, pitch: 2 });

    // 7.4 圓潤多面體
    const polyGroup = new THREE.Group();
    polyGroup.position.set(0.32, 0.66, -0.28);
    tableGroup.add(polyGroup);

    const polyMat = new THREE.MeshStandardMaterial({
        color: 0xe5989b,
        roughness: 0.3,
        emissive: 0xb5838d,
        emissiveIntensity: 0.12
    });
    const polyMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 0), polyMat);
    polyMesh.position.y = 0.21;
    polyMesh.castShadow = true;
    polyGroup.add(polyMesh);

    polyGroup.traverse(c => {
        if (c.isMesh) {
            c.userData = { type: 'squishy', id: 'poly', label: '幾何感官捏捏：圓潤多面體 (點擊按壓)' };
            interactableObjects.push(c);
        }
    });
    squishyToys.push({ id: 'poly', name: '圓潤多面體', group: polyGroup, velocity: 0, deform: 0, pitch: 3 });

    function squishToy(targetId = 'all') {
        squishyToys.forEach(toy => {
            if (targetId === 'all' || toy.id === targetId) {
                toy.deform = -0.58;
                toy.velocity = 0.17;
                sound.playSquishSound(toy.pitch);

                const worldPos = new THREE.Vector3();
                toy.group.getWorldPosition(worldPos);
                worldPos.y -= 0.85;
                spawnWarmParticles(worldPos, 3, 0xfbbf24);
            }
        });

        squishCount++;
        const countEl = document.getElementById('squish-count');
        if (countEl) countEl.textContent = `${squishCount} 次`;

        const reliefPct = Math.min(100, squishCount * 5);
        const pctEl = document.getElementById('stress-relief-pct');
        const fillEl = document.getElementById('stress-meter-fill');
        if (pctEl) pctEl.textContent = `${reliefPct}%`;
        if (fillEl) fillEl.style.width = `${reliefPct}%`;

        if (squishCount % 10 === 0) {
            showToast(`已進行 ${squishCount} 次幾何感官按壓，身體慢慢放鬆下來囉！`, 'fa-solid fa-shapes');
        }
    }

    // =========================================================================
    // 8. 細緻 3D 木質星砂流沙漏 (x = 0.78, z = 1.92) & 原木七音木琴 (x = -0.82, z = 1.98)
    //    兩者相距 1.6 單位，且與右側小圓桌 (x = 2.15, z = -0.25) 相距超過 2.5 單位，完全不卡在一起！
    // =========================================================================
    const allStarSandMaterials = [];

    const hourglassAnchor = new THREE.Group();
    hourglassAnchor.position.set(0.78, 0.38, 1.92);
    scene.add(hourglassAnchor);

    const hgPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.44, 0.36, 32), oakWoodMat);
    hgPedestal.position.y = -0.18;
    hgPedestal.castShadow = true;
    hgPedestal.receiveShadow = true;
    hourglassAnchor.add(hgPedestal);

    const hgPedestalTrim = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.04, 32), walnutWoodMat);
    hgPedestalTrim.position.y = -0.01;
    hourglassAnchor.add(hgPedestalTrim);

    const hourglassRotatingGroup = new THREE.Group();
    hourglassRotatingGroup.position.y = 0.46;
    hourglassAnchor.add(hourglassRotatingGroup);

    const outerCapGeo = new THREE.CylinderGeometry(0.29, 0.29, 0.045, 32);
    const innerCapGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.03, 32);

    const topCapOuter = new THREE.Mesh(outerCapGeo, walnutWoodMat);
    topCapOuter.position.y = 0.41;
    const topCapInner = new THREE.Mesh(innerCapGeo, birchWoodMat);
    topCapInner.position.y = 0.375;

    const botCapOuter = new THREE.Mesh(outerCapGeo, walnutWoodMat);
    botCapOuter.position.y = -0.41;
    const botCapInner = new THREE.Mesh(innerCapGeo, birchWoodMat);
    botCapInner.position.y = -0.375;

    hourglassRotatingGroup.add(topCapOuter, topCapInner, botCapOuter, botCapInner);

    for (let i = 0; i < 4; i++) {
        const ang = (i * Math.PI) / 2 + Math.PI / 4;
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.8, 16), walnutWoodMat);
        pillar.position.set(Math.cos(ang) * 0.23, 0, Math.sin(ang) * 0.23);
        const bead = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 12), birchWoodMat);
        bead.position.set(Math.cos(ang) * 0.23, 0, Math.sin(ang) * 0.23);
        hourglassRotatingGroup.add(pillar, bead);
    }

    const neckRing = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.018, 12, 24), birchWoodMat);
    neckRing.rotation.x = Math.PI / 2;
    hourglassRotatingGroup.add(neckRing);

    const clearGlassMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.14,
        depthWrite: false
    });
    const topGlassBulb = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.045, 0.35, 32), clearGlassMat);
    topGlassBulb.position.y = 0.19;
    const botGlassBulb = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.21, 0.35, 32), clearGlassMat);
    botGlassBulb.position.y = -0.19;
    hourglassRotatingGroup.add(topGlassBulb, botGlassBulb);

    const sandSimulationGroup = new THREE.Group();
    sandSimulationGroup.position.y = 0.46;
    hourglassAnchor.add(sandSimulationGroup);

    const hgSandMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, toneMapped: false });
    const hgGrainMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, toneMapped: false });
    allStarSandMaterials.push(hgSandMat, hgGrainMat);

    const topSandMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.03, 0.26, 28), hgSandMat);
    topSandMesh.position.y = 0.15;
    sandSimulationGroup.add(topSandMesh);

    const botSandMesh = new THREE.Mesh(new THREE.ConeGeometry(0.195, 0.27, 28), hgSandMat);
    botSandMesh.position.y = -0.23;
    sandSimulationGroup.add(botSandMesh);

    const sandStreamMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.35, 12), hgSandMat);
    sandStreamMesh.position.y = -0.16;
    sandSimulationGroup.add(sandStreamMesh);

    const sandGrains = [];
    const grainGeo = new THREE.SphereGeometry(0.015, 8, 8);
    for (let i = 0; i < 42; i++) {
        const grain = new THREE.Mesh(grainGeo, hgGrainMat);
        const startY = -(Math.random() * 0.34);
        grain.position.set(
            (Math.random() - 0.5) * 0.025,
            startY,
            (Math.random() - 0.5) * 0.025
        );
        sandSimulationGroup.add(grain);
        sandGrains.push({
            mesh: grain,
            speed: 0.4 + Math.random() * 0.28,
            spreadX: (Math.random() - 0.5) * 0.14,
            spreadZ: (Math.random() - 0.5) * 0.14
        });
    }

    hourglassAnchor.traverse(c => {
        if (c.isMesh) {
            c.userData = { type: 'sensory_hg', label: '3D 木質星砂流沙漏 (點擊翻轉倒數)' };
            interactableObjects.push(c);
        }
    });

    let hourglassTargetRot = 0;
    let hourglassRemaining = 30;

    function flipHourglass() {
        hourglassTargetRot += Math.PI;
        hourglassRemaining = 30;
        sound.playSandFlipSound();
        showToast('已翻轉木質星砂流沙漏：看著細緻彩色星砂一顆顆流下，陪伴自己平靜 30 秒', 'fa-solid fa-hourglass-half');
    }

    // 8.2 完整原木七音療癒木琴 (獨立擺放於 x = -0.82, z = 1.98)
    const xyloGroup = new THREE.Group();
    xyloGroup.position.set(-0.82, 0.07, 1.98);
    xyloGroup.rotation.y = 0.15;
    scene.add(xyloGroup);

    const xyloFrame = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.06, 0.54), walnutWoodMat);
    xyloFrame.castShadow = true;
    xyloFrame.receiveShadow = true;
    xyloGroup.add(xyloFrame);

    const xyloNoteNames = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];
    const xyloKeyColors = [
        0xc86d51,
        0xd98a54,
        0xdfb15b,
        0x9ab07a,
        0x739e82,
        0x668f99,
        0x8a7996
    ];
    const xyloKeyMeshes = [];

    xyloKeyColors.forEach((col, idx) => {
        const keyLen = 0.46 - idx * 0.028;
        const keyMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.45 });
        const keyGroup = new THREE.Group();
        keyGroup.position.set(-0.48 + idx * 0.16, 0.055, 0);

        const keyBar = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.04, keyLen), keyMat);
        keyBar.castShadow = true;
        keyGroup.add(keyBar);

        const pinGeo = new THREE.SphereGeometry(0.018, 10, 10);
        const pinF = new THREE.Mesh(pinGeo, birchWoodMat);
        pinF.position.set(0, 0.022, keyLen * 0.34);
        const pinB = pinF.clone();
        pinB.position.set(0, 0.022, -keyLen * 0.34);
        keyGroup.add(pinF, pinB);

        keyGroup.traverse(c => {
            if (c.isMesh) {
                c.userData = {
                    type: 'xylo_key',
                    noteIndex: idx,
                    label: `原木七音木琴：${xyloNoteNames[idx]} (點擊敲擊)`
                };
                interactableObjects.push(c);
            }
        });

        xyloGroup.add(keyGroup);
        xyloKeyMeshes.push({ group: keyGroup, pressOffset: 0 });
    });

    function triggerXyloNote(noteIdx) {
        sound.playWoodXylophone(noteIdx);
        const k = xyloKeyMeshes[noteIdx];
        if (k) {
            k.pressOffset = -0.028;
            const pos = new THREE.Vector3();
            k.group.getWorldPosition(pos);
            pos.y -= 0.7;
            spawnWarmParticles(pos, 3, xyloKeyColors[noteIdx]);
        }
        const uiKey = document.querySelector(`.xylo-key[data-note="${noteIdx}"]`);
        if (uiKey) {
            uiKey.classList.add('playing');
            setTimeout(() => uiKey.classList.remove('playing'), 180);
        }
    }

    window.addEventListener('keydown', e => {
        if (document.activeElement && document.activeElement.tagName === 'TEXTAREA') return;
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 7) {
            triggerXyloNote(num - 1);
        }
    });

    // =========================================================================
    // 9. 正念呼吸泡泡木燈 & 無遮擋 3D 蒙特梭利木框安全鏡
    // =========================================================================
    const breathStandGroup = new THREE.Group();
    breathStandGroup.position.set(-2.95, 0, 2.85);
    scene.add(breathStandGroup);

    const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.4, 0.82, 24), oakWoodMat);
    standBase.position.y = 0.41;
    standBase.castShadow = true;
    breathStandGroup.add(standBase);

    const breathOrbMat = new THREE.MeshStandardMaterial({
        color: 0x84a98c,
        emissive: 0x52796f,
        emissiveIntensity: 0.55,
        roughness: 0.18,
        transparent: true,
        opacity: 0.88
    });
    const breathOrb = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 32), breathOrbMat);
    breathOrb.position.y = 1.35;
    breathStandGroup.add(breathOrb);

    const ringGeo = new THREE.TorusGeometry(0.48, 0.018, 16, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xe6ccb2, transparent: true, opacity: 0.65 });
    const breathRing1 = new THREE.Mesh(ringGeo, ringMat);
    breathRing1.position.y = 1.35;
    const breathRing2 = breathRing1.clone();
    breathRing2.rotation.x = Math.PI / 2;
    breathStandGroup.add(breathRing1, breathRing2);

    breathOrb.userData = { type: 'breath', label: '正念呼吸能量木燈 (點擊開始深呼吸)' };
    interactableObjects.push(breathOrb);

    // 9.2 牆上無遮擋蒙特梭利圓框情緒安全鏡
    const mirrorGroup = new THREE.Group();
    mirrorGroup.position.set(-3.94, 2.28, 1.65);
    mirrorGroup.rotation.y = Math.PI / 2;
    scene.add(mirrorGroup);

    const mirrorFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.06, 40), oakWoodMat);
    mirrorFrame.rotation.x = Math.PI / 2;
    mirrorGroup.add(mirrorFrame);

    const mirrorInnerTrim = new THREE.Mesh(new THREE.TorusGeometry(0.53, 0.025, 16, 40), walnutWoodMat);
    mirrorInnerTrim.position.z = 0.032;
    mirrorGroup.add(mirrorInnerTrim);

    const mirrorSurfaceMat = new THREE.MeshBasicMaterial({
        color: 0xd8e2dc,
        toneMapped: false
    });
    const mirrorSurface = new THREE.Mesh(new THREE.CircleGeometry(0.52, 40), mirrorSurfaceMat);
    mirrorSurface.position.z = 0.036;
    mirrorGroup.add(mirrorSurface);

    mirrorGroup.traverse(c => {
        if (c.isMesh) {
            c.userData = { type: 'mirror', label: '蒙特梭利視訊安全鏡 (點擊開啟鏡頭看自己的臉)' };
            interactableObjects.push(c);
        }
    });

    let cameraStream = null;
    let videoTexture = null;
    const mirrorVideoEl = document.getElementById('mirror-video');
    const mirrorCameraBox = document.getElementById('mirror-camera-box');
    const cameraBtnIcon = document.getElementById('camera-btn-icon');
    const cameraBtnText = document.getElementById('camera-btn-text');

    async function toggleMirrorCamera() {
        focusStation('breath');

        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
            mirrorVideoEl.srcObject = null;
            mirrorCameraBox.classList.remove('active');
            mirrorSurfaceMat.map = null;
            mirrorSurfaceMat.color.setHex(0xd8e2dc);
            mirrorSurfaceMat.needsUpdate = true;

            cameraBtnIcon.className = 'fa-solid fa-video';
            cameraBtnText.textContent = '開啟安全鏡視訊 (正面看自己的臉)';
            showToast('已關閉安全鏡視訊鏡頭', 'fa-solid fa-video-slash');
            return;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showToast('您的瀏覽器環境目前不支援視訊鏡頭功能', 'fa-solid fa-circle-exclamation');
            return;
        }

        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 512 }, height: { ideal: 512 }, facingMode: 'user' },
                audio: false
            });
            mirrorVideoEl.srcObject = cameraStream;
            await mirrorVideoEl.play();
            mirrorCameraBox.classList.add('active');

            videoTexture = new THREE.VideoTexture(mirrorVideoEl);
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            videoTexture.wrapS = THREE.RepeatWrapping;
            videoTexture.repeat.x = -1;
            videoTexture.offset.x = 1;

            mirrorSurfaceMat.color.setHex(0xffffff);
            mirrorSurfaceMat.map = videoTexture;
            mirrorSurfaceMat.needsUpdate = true;

            cameraBtnIcon.className = 'fa-solid fa-video-slash';
            cameraBtnText.textContent = '關閉安全鏡視訊鏡頭';
            sound.playSparkleChime();
            showToast('安全鏡已開啟！視角已正面對準牆上圓鏡，給自己一個微笑吧！', 'fa-solid fa-face-smile');
        } catch (err) {
            showToast('無法開啟視訊鏡頭，請確認已允許瀏覽器使用相機權限喔！', 'fa-solid fa-camera');
        }
    }

    let breathActive = false;
    let breathElapsed = 0;
    let lastBreathPhase = '';

    function toggleBreathingExercise() {
        breathActive = !breathActive;
        breathElapsed = 0;
        lastBreathPhase = '';

        const btnIcon = document.getElementById('breath-btn-icon');
        const btnText = document.getElementById('breath-btn-text');
        const phaseEl = document.getElementById('breath-phase');
        const timerEl = document.getElementById('breath-timer');
        const uiCircle = document.getElementById('breath-ui-circle');

        if (breathActive) {
            btnIcon.className = 'fa-solid fa-pause';
            btnText.textContent = '暫停呼吸引導';
            sound.playBreathTone(432);
            showToast('開始正念呼吸：跟隨溫暖木燈一起慢吸慢吐', 'fa-solid fa-wind');
        } else {
            btnIcon.className = 'fa-solid fa-play';
            btnText.textContent = '開始呼吸引導';
            phaseEl.textContent = '準備開始';
            timerEl.textContent = '--';
            uiCircle.style.transform = 'scale(1)';
        }
    }

    // =========================================================================
    // 10. 開放式三層原木展示架、超鮮明變色「3D 情緒星砂天氣瓶」與「原木樹洞信箱」
    // =========================================================================
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(1.35, 0, -3.52);
    scene.add(shelfGroup);

    const leftPostF = new THREE.Mesh(new THREE.BoxGeometry(0.09, 2.05, 0.09), walnutWoodMat);
    leftPostF.position.set(-1.02, 1.025, 0.24);
    const leftPostB = leftPostF.clone();
    leftPostB.position.set(-1.02, 1.025, -0.24);

    const rightPostF = leftPostF.clone();
    rightPostF.position.set(1.02, 1.025, 0.24);
    const rightPostB = leftPostF.clone();
    rightPostB.position.set(1.02, 1.025, -0.24);
    shelfGroup.add(leftPostF, leftPostB, rightPostF, rightPostB);

    const shelfHeights = [0.35, 1.12, 1.85];
    shelfHeights.forEach(hy => {
        const plank = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.07, 0.62), oakWoodMat);
        plank.position.set(0, hy, 0);
        plank.castShadow = true;
        plank.receiveShadow = true;
        shelfGroup.add(plank);
    });

    const bookColors = [0xe07a5f, 0x84a98c, 0xe09f3e, 0x7ea8be, 0xd4a373, 0xb5838d];
    bookColors.forEach((col, idx) => {
        const book = new THREE.Mesh(
            new THREE.BoxGeometry(0.11, 0.44, 0.36),
            new THREE.MeshStandardMaterial({ color: col, roughness: 0.6 })
        );
        book.position.set(-0.68 + idx * 0.13, 1.38, 0);
        book.rotation.z = idx === 5 ? 0.22 : 0;
        book.castShadow = true;
        shelfGroup.add(book);
    });

    // 10.1 頂層開放展示：放大版超清透 3D 情緒星砂天氣瓶
    const weatherJarGroup = new THREE.Group();
    weatherJarGroup.position.set(-0.36, 1.89, 0.08);
    weatherJarGroup.scale.setScalar(1.18);
    shelfGroup.add(weatherJarGroup);

    const jarWoodBase = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.06, 28), walnutWoodMat);
    jarWoodBase.position.y = 0.03;
    weatherJarGroup.add(jarWoodBase);

    const jarSandBedMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, toneMapped: false });
    const jarCrystalMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, toneMapped: false });
    const jarPointsMat = new THREE.PointsMaterial({
        color: 0xfbbf24,
        size: 0.07,
        map: softStarTexture,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        toneMapped: false
    });
    const jarAuraMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
        toneMapped: false
    });
    allStarSandMaterials.push(jarSandBedMat, jarCrystalMat, jarPointsMat, jarAuraMat);

    const jarSandBed = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.25, 0.18, 28), jarSandBedMat);
    jarSandBed.position.y = 0.15;
    const jarSandMound = new THREE.Mesh(new THREE.ConeGeometry(0.23, 0.18, 28), jarSandBedMat);
    jarSandMound.position.y = 0.28;
    weatherJarGroup.add(jarSandBed, jarSandMound);

    const starCloudCount = 260;
    const starCloudGeo = new THREE.BufferGeometry();
    const starCloudPos = new Float32Array(starCloudCount * 3);
    for (let i = 0; i < starCloudCount; i++) {
        const ang = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.22;
        starCloudPos[i * 3] = Math.cos(ang) * r;
        starCloudPos[i * 3 + 1] = 0.14 + Math.random() * 0.56;
        starCloudPos[i * 3 + 2] = Math.sin(ang) * r;
    }
    starCloudGeo.setAttribute('position', new THREE.BufferAttribute(starCloudPos, 3));
    const starCloudPoints = new THREE.Points(starCloudGeo, jarPointsMat);
    weatherJarGroup.add(starCloudPoints);

    const jarCrystals = [];
    const crystalGeo = new THREE.OctahedronGeometry(0.038, 0);
    for (let i = 0; i < 80; i++) {
        const cr = new THREE.Mesh(crystalGeo, jarCrystalMat);
        const angle = (i / 80) * Math.PI * 2;
        const radius = 0.03 + Math.random() * 0.19;
        const yOff = 0.16 + Math.random() * 0.54;
        cr.position.set(Math.cos(angle) * radius, yOff, Math.sin(angle) * radius);
        weatherJarGroup.add(cr);
        jarCrystals.push({
            mesh: cr,
            angle,
            radius,
            baseY: yOff,
            speed: 0.9 + Math.random() * 1.2
        });
    }

    const jarAuraMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.56, 28), jarAuraMat);
    jarAuraMesh.position.y = 0.4;
    weatherJarGroup.add(jarAuraMesh);

    const jarOuterMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.72, 32), clearGlassMat);
    jarOuterMesh.position.y = 0.42;
    const jarGlassRimTop = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.012, 12, 32), clearGlassMat);
    jarGlassRimTop.rotation.x = Math.PI / 2;
    jarGlassRimTop.position.y = 0.77;
    weatherJarGroup.add(jarOuterMesh, jarGlassRimTop);

    const jarCork = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 0.12, 24), oakWoodMat);
    jarCork.position.y = 0.84;
    weatherJarGroup.add(jarCork);

    let jarSwirlBoost = 1.0;

    weatherJarGroup.traverse(c => {
        if (c.isMesh) {
            c.userData = { type: 'mood_jar', label: '3D 情緒星砂天氣瓶 (點擊立即變換星砂顏色！)' };
            interactableObjects.push(c);
        }
    });

    function applyStarSandColor(hexColor, colorName, moodKey = null) {
        allStarSandMaterials.forEach(mat => {
            mat.color.set(hexColor);
            mat.needsUpdate = true;
        });
        jarPointLight.color.set(hexColor);

        jarSwirlBoost = 4.5;
        sound.playSparkleChime();

        document.querySelectorAll('.sand-dot').forEach(dot => {
            dot.classList.toggle('active', dot.dataset.sandColor.toLowerCase() === hexColor.toLowerCase());
        });

        document.querySelectorAll('.mood-btn').forEach(btn => {
            const match = moodKey
                ? btn.dataset.mood === moodKey
                : btn.dataset.color.toLowerCase() === hexColor.toLowerCase();
            btn.classList.toggle('selected', match);
            if (match && !moodKey) {
                moodKey = btn.dataset.mood;
            }
        });

        const fb = document.getElementById('mood-feedback');
        if (fb) {
            const adviceText = (moodKey && MOOD_ADVICE[moodKey])
                ? MOOD_ADVICE[moodKey]
                : `星砂已切換為「${colorName}」！瓶內與流沙漏的星砂都換上新色彩囉！`;
            fb.innerHTML = `<i class="fa-solid fa-jar" style="color:${hexColor};"></i> ${adviceText}`;
        }

        const numColor = parseInt(hexColor.replace('#', '0x'), 16);
        const jarPos = new THREE.Vector3();
        weatherJarGroup.getWorldPosition(jarPos);
        jarPos.y -= 0.4;
        spawnWarmParticles(jarPos, 12, numColor);

        const hgPos = new THREE.Vector3();
        hourglassAnchor.getWorldPosition(hgPos);
        hgPos.y -= 0.3;
        spawnWarmParticles(hgPos, 8, numColor);

        showToast(`星砂顏色已變換為：【${colorName}】！`, 'fa-solid fa-palette');
    }

    // 10.2 頂層開放展示：3D 原木樹洞信箱
    const treeholeBox = new THREE.Group();
    treeholeBox.position.set(0.46, 1.89, 0.06);
    shelfGroup.add(treeholeBox);

    const boxBody = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.52, 0.38), oakWoodMat);
    boxBody.position.y = 0.26;
    boxBody.castShadow = true;
    treeholeBox.add(boxBody);

    const roofLeft = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.44), walnutWoodMat);
    roofLeft.position.set(-0.12, 0.58, 0);
    roofLeft.rotation.z = Math.PI / 5;
    const roofRight = roofLeft.clone();
    roofRight.position.set(0.12, 0.58, 0);
    roofRight.rotation.z = -Math.PI / 5;
    treeholeBox.add(roofLeft, roofRight);

    const boxHole = new THREE.Mesh(new THREE.CircleGeometry(0.11, 20), bearDarkMat);
    boxHole.position.set(0, 0.28, 0.192);
    const holeRing = new THREE.Mesh(new THREE.RingGeometry(0.11, 0.135, 20), birchWoodMat);
    holeRing.position.set(0, 0.28, 0.193);
    treeholeBox.add(boxHole, holeRing);

    treeholeBox.traverse(c => {
        if (c.isMesh) {
            c.userData = { type: 'mood_treehole', label: '原木樹洞信箱 (點擊傾訴心情化為微光)' };
            interactableObjects.push(c);
        }
    });

    const flyingNote3D = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.12, 0.02),
        new THREE.MeshBasicMaterial({ color: 0xffe8a3, toneMapped: false })
    );
    flyingNote3D.visible = false;
    scene.add(flyingNote3D);
    let noteFlightProgress = -1;

    // 10.3 角落大型木盆綠植 (移至寬敞右後角 x = 3.15, z = -3.25)
    const plantGroup = new THREE.Group();
    plantGroup.position.set(3.15, 0, -3.25);
    scene.add(plantGroup);

    const potMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.28, 0.6, 20), walnutWoodMat);
    potMesh.position.y = 0.3;
    potMesh.castShadow = true;
    plantGroup.add(potMesh);

    for (let i = 0; i < 7; i++) {
        const leafGeo = new THREE.SphereGeometry(0.25, 16, 12);
        leafGeo.scale(0.62, 1.85, 0.2);
        const leaf = new THREE.Mesh(leafGeo, sageMat);
        const ang = (i * Math.PI * 2) / 7;
        leaf.position.set(Math.cos(ang) * 0.19, 0.74 + (i % 2) * 0.14, Math.sin(ang) * 0.19);
        leaf.rotation.y = -ang;
        leaf.rotation.z = 0.42;
        leaf.castShadow = true;
        plantGroup.add(leaf);
    }

    // 10.4 窗外柔和圓形雨滴粒子系統
    const rainCount = 90;
    const rainGeo = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
        rainPositions[i * 3] = -3.95;
        rainPositions[i * 3 + 1] = 1.8 + Math.random() * 1.8;
        rainPositions[i * 3 + 2] = -1.75 + Math.random() * 1.8;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
    const rainMat = new THREE.PointsMaterial({
        color: 0xbae6fd,
        size: 0.11,
        map: softStarTexture,
        transparent: true,
        opacity: 0,
        depthWrite: false
    });
    const rainSystem = new THREE.Points(rainGeo, rainMat);
    scene.add(rainSystem);

    // =========================================================================
    // 11. 3D 射線檢測 (Raycaster) 滑鼠/觸控點擊與懸停互動
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const tooltip = document.getElementById('object-tooltip');
    const tooltipText = document.getElementById('tooltip-text');

    let pointerDownPos = { x: 0, y: 0 };

    function updatePointer(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        pointer.x = (clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(clientY / window.innerHeight) * 2 + 1;
        return { clientX, clientY };
    }

    window.addEventListener('pointermove', e => {
        if (e.target !== renderer.domElement) {
            tooltip.classList.remove('visible');
            return;
        }
        const { clientX, clientY } = updatePointer(e);
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(interactableObjects, false);

        if (intersects.length > 0) {
            const data = intersects[0].object.userData;
            if (data && data.label) {
                tooltipText.textContent = data.label;
                tooltip.style.left = `${clientX}px`;
                tooltip.style.top = `${clientY}px`;
                tooltip.classList.add('visible');
                renderer.domElement.style.cursor = 'pointer';
                return;
            }
        }
        tooltip.classList.remove('visible');
        renderer.domElement.style.cursor = 'grab';
    });

    renderer.domElement.addEventListener('pointerdown', e => {
        pointerDownPos = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener('pointerup', e => {
        const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
        if (dist > 8) return;

        updatePointer(e);
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(interactableObjects, false);

        if (intersects.length > 0) {
            const data = intersects[0].object.userData;
            if (!data) return;

            if (data.type === 'bear') {
                focusStation('bear');
                triggerBearHug('hug');
            } else if (data.type === 'pillow') {
                focusStation('bear');
                triggerPillowFluff();
            } else if (data.type === 'squishy') {
                focusStation('squishy');
                squishToy(data.id);
            } else if (data.type === 'sensory_hg') {
                focusStation('sensory');
                flipHourglass();
            } else if (data.type === 'xylo_key') {
                focusStation('sensory');
                triggerXyloNote(data.noteIndex);
            } else if (data.type === 'breath') {
                focusStation('breath');
                if (!breathActive) toggleBreathingExercise();
            } else if (data.type === 'mirror') {
                focusStation('breath');
                if (!cameraStream) {
                    toggleMirrorCamera();
                } else {
                    cycleMirrorPrompt();
                }
            } else if (data.type === 'mood_jar') {
                focusStation('mood');
                currentSandPaletteIndex = (currentSandPaletteIndex + 1) % STAR_SAND_PALETTE.length;
                const nextP = STAR_SAND_PALETTE[currentSandPaletteIndex];
                applyStarSandColor(nextP.color, nextP.name, nextP.mood);
            } else if (data.type === 'mood_treehole') {
                focusStation('mood');
                sound.playSparkleChime();
            }
        }
    });

    // =========================================================================
    // 12. UI 按鈕事件綁定 (含新增的「溫馨星光」版本切換)
    // =========================================================================
    document.querySelectorAll('.dock-btn').forEach(btn => {
        btn.addEventListener('click', () => focusStation(btn.dataset.station));
    });

    document.querySelectorAll('[data-goto]').forEach(btn => {
        btn.addEventListener('click', () => focusStation(btn.dataset.goto));
    });

    const sidePanel = document.getElementById('side-panel');
    const minimizeBtn = document.getElementById('btn-minimize-panel');
    const minimizeIcon = document.getElementById('minimize-icon');
    minimizeBtn.addEventListener('click', () => {
        const isMin = sidePanel.classList.toggle('minimized');
        minimizeIcon.className = isMin ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
    });

    document.getElementById('btn-reset-camera').addEventListener('click', () => {
        focusStation('overview');
        showToast('已回到溫馨星光木屋全景視角', 'fa-solid fa-camera-rotate');
    });

    const bgmBtn = document.getElementById('btn-toggle-bgm');
    const bgmIcon = document.getElementById('bgm-icon');
    const bgmLabel = document.getElementById('bgm-label');
    bgmBtn.addEventListener('click', () => {
        const playing = sound.toggleBGM();
        bgmBtn.classList.toggle('active', playing);
        bgmIcon.className = playing ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-off';
        bgmLabel.textContent = playing ? '自然音：開啟' : '自然音：關閉';
        showToast(playing ? '已開啟森林微風與木質調和諧背景音' : '已關閉環境自然音', 'fa-solid fa-leaf');
    });

    // 5 種溫馨環境光線與星光版本切換
    document.querySelectorAll('[data-ambiance]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-ambiance]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const mode = btn.dataset.ambiance;

            if (mode === 'woodwarm') {
                scene.background.setHex(0x35293d);
                scene.fog.color.setHex(0x35293d);
                ambientLight.intensity = 0.56;
                mainDirLight.intensity = 0.68;
                warmPointLight.color.setHex(0xffad42);
                warmPointLight.intensity = 0.92;
                windowSkyMat.color.setHex(0x2b2448);
                celestialMat.color.setHex(0xfef08a);
                skyStarMat.opacity = 0.9;
                winStarGroup.visible = true;
                rainMat.opacity = 0;
                showToast('已切換為：木屋暖光（伴隨溫馨星光點點）', 'fa-solid fa-lightbulb');
            } else if (mode === 'starlight') {
                // 新增「溫馨星光」版本：夢幻粉彩星空紫藍 + 滿天星光點點最璀璨！
                scene.background.setHex(0x282147);
                scene.fog.color.setHex(0x282147);
                ambientLight.intensity = 0.54;
                mainDirLight.intensity = 0.62;
                warmPointLight.color.setHex(0xf4a261);
                warmPointLight.intensity = 1.1;
                windowSkyMat.color.setHex(0x1e1838);
                celestialMat.color.setHex(0xfde047);
                skyStarMat.opacity = 1.0;
                winStarGroup.visible = true;
                rainMat.opacity = 0;
                sound.playSparkleChime();
                showToast('已切換為：溫馨星光版本！滿天繽紛星星正溫柔閃爍著！', 'fa-solid fa-star');
            } else if (mode === 'sunny') {
                scene.background.setHex(0x3b4f47);
                scene.fog.color.setHex(0x3b4f47);
                ambientLight.intensity = 0.62;
                mainDirLight.intensity = 0.74;
                warmPointLight.color.setHex(0xffd166);
                warmPointLight.intensity = 0.48;
                windowSkyMat.color.setHex(0x6b9ac4);
                celestialMat.color.setHex(0xffe599);
                skyStarMat.opacity = 0.45;
                winStarGroup.visible = false;
                rainMat.opacity = 0;
                showToast('已切換為：柔和森林晨光氛圍', 'fa-solid fa-sun');
            } else if (mode === 'sunset') {
                scene.background.setHex(0x472b33);
                scene.fog.color.setHex(0x472b33);
                ambientLight.intensity = 0.56;
                mainDirLight.intensity = 0.74;
                warmPointLight.color.setHex(0xf48c72);
                warmPointLight.intensity = 0.98;
                windowSkyMat.color.setHex(0xc97b63);
                celestialMat.color.setHex(0xffb703);
                skyStarMat.opacity = 0.82;
                winStarGroup.visible = true;
                rainMat.opacity = 0;
                showToast('已切換為：粉彩夕陽與晚霞星光氛圍', 'fa-solid fa-cloud-sun');
            } else if (mode === 'rainy') {
                scene.background.setHex(0x29384a);
                scene.fog.color.setHex(0x29384a);
                ambientLight.intensity = 0.5;
                mainDirLight.intensity = 0.56;
                warmPointLight.color.setHex(0xffad42);
                warmPointLight.intensity = 0.9;
                windowSkyMat.color.setHex(0x33475b);
                celestialMat.color.setHex(0xbae6fd);
                skyStarMat.opacity = 0.65;
                winStarGroup.visible = true;
                rainMat.opacity = 0.85;
                showToast('已切換為：星夜聽雨時光氛圍', 'fa-solid fa-cloud-rain');
            }
        });
    });

    // 熊熊與抱枕軟墊互動按鈕
    document.getElementById('btn-bear-hug').addEventListener('click', () => triggerBearHug('hug'));
    document.getElementById('btn-fluff-pillows').addEventListener('click', triggerPillowFluff);
    document.getElementById('btn-bear-pat').addEventListener('click', () => triggerBearHug('pat'));
    document.getElementById('btn-bear-talk').addEventListener('click', () => {
        sound.playSparkleChime();
        const quote = BEAR_QUOTES[Math.floor(Math.random() * BEAR_QUOTES.length)];
        document.getElementById('bear-speech').innerHTML = `<i class="fa-solid fa-seedling"></i> ${quote}`;
        spawnWarmParticles(bearGroup.position, 6, 0x84a98c);
    });

    // 純幾何形狀捏捏按鈕
    document.getElementById('btn-squish-all').addEventListener('click', () => squishToy('all'));
    document.getElementById('btn-squish-sphere').addEventListener('click', () => squishToy('sphere'));
    document.getElementById('btn-squish-cube').addEventListener('click', () => squishToy('cube'));
    document.getElementById('btn-squish-torus').addEventListener('click', () => squishToy('torus'));
    document.getElementById('btn-squish-poly').addEventListener('click', () => squishToy('poly'));

    // 木質沙漏與七音木琴按鈕
    document.getElementById('btn-flip-hourglass').addEventListener('click', flipHourglass);
    document.querySelectorAll('.xylo-key').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.note, 10) || 0;
            triggerXyloNote(idx);
        });
    });

    // 沙漏頁面的星砂色點點擊事件
    document.querySelectorAll('.sand-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const hexColor = dot.dataset.sandColor;
            const colorName = dot.dataset.sandName;
            applyStarSandColor(hexColor, colorName);
        });
    });

    // 情緒天氣瓶頁面的情緒標籤點擊事件
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mood = btn.dataset.mood;
            const hexColor = btn.dataset.color;
            const colorName = btn.dataset.name || '彩色';
            applyStarSandColor(hexColor, colorName, mood);
        });
    });

    // 呼吸練習與視訊安全鏡按鈕
    document.getElementById('btn-toggle-camera').addEventListener('click', toggleMirrorCamera);
    document.getElementById('mirror-camera-box').addEventListener('click', toggleMirrorCamera);
    document.getElementById('btn-toggle-breath').addEventListener('click', toggleBreathingExercise);

    function cycleMirrorPrompt() {
        focusStation('breath');
        sound.playWoodXylophone(mirrorStepIndex % 7);
        const promptText = MIRROR_PROMPTS[mirrorStepIndex % MIRROR_PROMPTS.length];
        mirrorStepIndex++;
        const promptEl = document.getElementById('mirror-prompt');
        if (promptEl) {
            promptEl.innerHTML = `<i class="fa-solid fa-face-smile"></i> ${promptText}`;
        }
        const mPos = new THREE.Vector3();
        mirrorGroup.getWorldPosition(mPos);
        mPos.y -= 0.8;
        spawnWarmParticles(mPos, 5, 0x84a98c);
        showToast(promptText, 'fa-solid fa-face-smile');
    }
    document.getElementById('btn-mirror-check').addEventListener('click', cycleMirrorPrompt);

    // 原木樹洞傾訴功能：先清晰顯示使用者的話並飛入樹洞，再倒數化為微光消散
    let echoTimers = [];
    document.getElementById('btn-release-worry').addEventListener('click', () => {
        const textarea = document.getElementById('worry-textarea');
        const rawText = textarea.value.trim();
        const displayWords = rawText || '（無聲的深呼吸與心願，希望心裡平靜溫暖）';

        sound.playSparkleChime();
        textarea.value = '';

        echoTimers.forEach(t => clearTimeout(t));
        echoTimers = [];

        const flyingCard = document.getElementById('flying-worry-card');
        const flyingCardText = document.getElementById('flying-card-text');
        if (flyingCard && flyingCardText) {
            flyingCardText.textContent = `「${displayWords}」`;
            flyingCard.classList.remove('animate-fly');
            void flyingCard.offsetWidth;
            flyingCard.classList.add('animate-fly');
        }

        noteFlightProgress = 0;
        flyingNote3D.visible = true;

        const echoBox = document.getElementById('treehole-echo-box');
        const echoWordsEl = document.getElementById('echo-user-words');
        const echoCountdownEl = document.getElementById('echo-countdown-tag');
        const echoReplyEl = document.getElementById('echo-comfort-reply');

        if (echoBox && echoWordsEl && echoCountdownEl && echoReplyEl) {
            echoBox.classList.remove('fading-out');
            echoWordsEl.classList.remove('dissolving');
            echoBox.classList.add('visible');

            echoWordsEl.textContent = `「${displayWords}」`;
            const randomReply = TREEHOLE_REPLIES[Math.floor(Math.random() * TREEHOLE_REPLIES.length)];
            echoReplyEl.innerHTML = `<i class="fa-solid fa-heart" style="color:#f4a261;"></i> ${randomReply}`;

            for (let s = 6; s >= 1; s--) {
                const t = setTimeout(() => {
                    echoCountdownEl.textContent = `${s} 秒後化為星塵...`;
                }, (6 - s) * 1000);
                echoTimers.push(t);
            }

            echoTimers.push(setTimeout(() => {
                echoWordsEl.classList.add('dissolving');
                echoCountdownEl.textContent = '已化作森林微光消散 ✨';
            }, 5200));

            echoTimers.push(setTimeout(() => {
                echoBox.classList.add('fading-out');
            }, 8000));

            echoTimers.push(setTimeout(() => {
                echoBox.classList.remove('visible', 'fading-out');
            }, 8800));
        }

        const boxPos = new THREE.Vector3();
        treeholeBox.getWorldPosition(boxPos);
        boxPos.y -= 0.4;
        spawnWarmParticles(boxPos, 16, 0xfbbf24);

        showToast(`原木樹洞聽見了：「${displayWords.slice(0, 18)}${displayWords.length > 18 ? '...' : ''}」`, 'fa-solid fa-ear-listen');
    });

    // =========================================================================
    // 13. 左下角吉祥物 (image/LiyuChillGuy.svg) 自由拖曳與互動
    // =========================================================================
    const mascotWidget = document.getElementById('mascot-widget');
    const mascotBubbleText = document.getElementById('mascot-bubble-text');
    let isDraggingMascot = false;
    let mascotDragMoved = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const MASCOT_CHEERS = [
        '隨時把我拖曳到你喜歡的位置喔！',
        '看看木屋外面，滿天都是溫馨繽紛的閃亮星星喔！',
        '可切換頂部的「溫馨星光」模式，感受夢幻星空！',
        '抱枕軟墊、沙漏、木琴與小圓桌現在都寬敞舒適囉！'
    ];

    mascotWidget.addEventListener('pointerdown', e => {
        e.stopPropagation();
        isDraggingMascot = true;
        mascotDragMoved = false;
        mascotWidget.classList.add('dragging');

        const rect = mascotWidget.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;

        mascotWidget.style.left = `${rect.left}px`;
        mascotWidget.style.top = `${rect.top}px`;
        mascotWidget.style.bottom = 'auto';
        mascotWidget.style.right = 'auto';

        mascotWidget.setPointerCapture(e.pointerId);
    });

    mascotWidget.addEventListener('pointermove', e => {
        if (!isDraggingMascot) return;
        e.stopPropagation();
        mascotDragMoved = true;

        const maxX = window.innerWidth - mascotWidget.offsetWidth;
        const maxY = window.innerHeight - mascotWidget.offsetHeight;
        const nextX = Math.max(0, Math.min(maxX, e.clientX - dragOffsetX));
        const nextY = Math.max(0, Math.min(maxY, e.clientY - dragOffsetY));

        mascotWidget.style.left = `${nextX}px`;
        mascotWidget.style.top = `${nextY}px`;
    });

    function endMascotDrag(e) {
        if (!isDraggingMascot) return;
        isDraggingMascot = false;
        mascotWidget.classList.remove('dragging');
        try {
            mascotWidget.releasePointerCapture(e.pointerId);
        } catch (err) {}

        if (!mascotDragMoved) {
            sound.playSparkleChime();
            const msg = MASCOT_CHEERS[Math.floor(Math.random() * MASCOT_CHEERS.length)];
            mascotBubbleText.textContent = msg;
            showToast(`吉祥物：${msg}`, 'fa-solid fa-seedling');
        }
    }

    mascotWidget.addEventListener('pointerup', endMascotDrag);
    mascotWidget.addEventListener('pointercancel', endMascotDrag);

    // =========================================================================
    // 14. 視窗尺寸響應式調整
    // =========================================================================
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        const rect = mascotWidget.getBoundingClientRect();
        if (mascotWidget.style.top && mascotWidget.style.top !== 'auto') {
            const clampedX = Math.max(0, Math.min(window.innerWidth - rect.width, rect.left));
            const clampedY = Math.max(0, Math.min(window.innerHeight - rect.height, rect.top));
            mascotWidget.style.left = `${clampedX}px`;
            mascotWidget.style.top = `${clampedY}px`;
        }
    });

    // =========================================================================
    // 15. 主動畫迴圈 (60fps 3D 物理與星光更新)
    // =========================================================================
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const dt = Math.min(clock.getDelta(), 0.1);
        const elapsed = clock.getElapsedTime();

        // 15.1 平滑相機過渡
        if (isCameraTransitioning) {
            camera.position.lerp(cameraTargetPos, 0.065);
            controls.target.lerp(controlsTargetLook, 0.065);
            if (camera.position.distanceTo(cameraTargetPos) < 0.04) {
                isCameraTransitioning = false;
            }
        }
        controls.update();

        // 15.2 360度溫馨繽紛星光天空緩慢旋轉與閃爍
        skyStarsPoints.rotation.y = elapsed * 0.018;
        floatingStarOrbs.forEach(orb => {
            orb.mesh.position.y = orb.baseY + Math.sin(elapsed * orb.speed + orb.phase) * 0.22;
            orb.mesh.rotation.y += 0.02;
            orb.mesh.rotation.x += 0.015;
            const s = 0.8 + Math.sin(elapsed * 2.5 + orb.phase) * 0.3;
            orb.mesh.scale.setScalar(s);
        });

        // 15.3 溫暖小夜燈串柔和呼吸閃爍
        fairyBulbs.forEach(b => {
            const glow = 0.78 + Math.sin(elapsed * 2.6 + b.phase) * 0.22;
            b.mesh.scale.setScalar(glow);
        });

        // 15.4 抱抱熊熊呼吸與擁抱動畫
        if (bearAnimTimer > 0) {
            bearAnimTimer -= dt;
            if (bearAnimMode === 'hug') {
                const wave = Math.sin(elapsed * 14);
                leftArm.rotation.z = 1.15 + wave * 0.22;
                rightArm.rotation.z = -1.15 - wave * 0.22;
                bearGroup.position.y = 0.7 + Math.abs(Math.sin(elapsed * 9)) * 0.15;
                bearHeadGroup.rotation.z = wave * 0.1;
            } else {
                bearHeadGroup.rotation.x = Math.sin(elapsed * 12) * 0.16;
                bearHeadGroup.rotation.z = Math.cos(elapsed * 9) * 0.1;
            }
        } else {
            bearGroup.position.y = 0.7 + Math.sin(elapsed * 2.0) * 0.022;
            bearHeadGroup.rotation.z = Math.sin(elapsed * 1.2) * 0.045;
            bearHeadGroup.rotation.x = Math.sin(elapsed * 1.6) * 0.025;
            leftArm.rotation.z = THREE.MathUtils.lerp(leftArm.rotation.z, 0.45, 0.1);
            rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, -0.45, 0.1);
        }

        // 15.5 療癒抱枕與軟墊群蓬鬆彈性物理動畫
        interactivePillows.forEach(p => {
            const springK = 0.22;
            const damping = 0.8;
            const force = -springK * p.deform;
            p.velocity = (p.velocity + force) * damping;
            p.deform += p.velocity;

            const sy = Math.max(0.5, 1 + p.deform);
            const sxz = Math.max(0.8, 1 - p.deform * 0.38);
            p.group.scale.set(sxz, sy, sxz);
        });

        // 15.6 純幾何感官捏捏阻尼彈簧物理計算
        squishyToys.forEach(toy => {
            const springK = 0.26;
            const damping = 0.82;
            const force = -springK * toy.deform;
            toy.velocity = (toy.velocity + force) * damping;
            toy.deform += toy.velocity;

            const sy = Math.max(0.32, 1 + toy.deform);
            const sxz = Math.max(0.72, 1 - toy.deform * 0.52);
            toy.group.scale.set(sxz, sy, sxz);
        });

        // 15.7 細緻木質流沙漏動畫
        hourglassRotatingGroup.rotation.z = THREE.MathUtils.lerp(
            hourglassRotatingGroup.rotation.z,
            hourglassTargetRot,
            0.12
        );
        const isFlipping = Math.abs(hourglassRotatingGroup.rotation.z - hourglassTargetRot) > 0.25;

        if (hourglassRemaining > 0 && !isFlipping) {
            hourglassRemaining = Math.max(0, hourglassRemaining - dt);
            const ratioLeft = hourglassRemaining / 30;
            const ratioDone = 1 - ratioLeft;

            topSandMesh.visible = ratioLeft > 0.02;
            topSandMesh.scale.set(
                0.25 + ratioLeft * 0.75,
                Math.max(0.05, ratioLeft),
                0.25 + ratioLeft * 0.75
            );
            topSandMesh.position.y = 0.04 + ratioLeft * 0.12;

            botSandMesh.visible = true;
            const botScale = 0.2 + ratioDone * 0.85;
            botSandMesh.scale.set(botScale, Math.max(0.1, ratioDone), botScale);
            botSandMesh.position.y = -0.34 + ratioDone * 0.11;

            sandStreamMesh.visible = true;
            sandGrains.forEach(g => {
                g.mesh.visible = true;
                g.mesh.position.y -= dt * g.speed;
                const fallProgress = Math.max(0, -g.mesh.position.y / 0.34);
                g.mesh.position.x = g.spreadX * fallProgress * fallProgress;
                g.mesh.position.z = g.spreadZ * fallProgress * fallProgress;

                if (g.mesh.position.y < -0.33) {
                    g.mesh.position.y = 0.01;
                    g.mesh.position.x = (Math.random() - 0.5) * 0.015;
                    g.mesh.position.z = (Math.random() - 0.5) * 0.015;
                }
            });

            const hgText = document.getElementById('hourglass-timer-text');
            if (hgText) {
                hgText.textContent = hourglassRemaining > 0
                    ? `星砂流動中：${Math.ceil(hourglassRemaining)} 秒`
                    : '流沙完成，點擊可再次翻轉！';
            }
        } else {
            sandStreamMesh.visible = false;
            sandGrains.forEach(g => { g.mesh.visible = false; });
        }

        // 15.8 原木七音木琴按鍵回彈
        xyloKeyMeshes.forEach(k => {
            k.pressOffset = THREE.MathUtils.lerp(k.pressOffset, 0, 0.18);
            k.group.position.y = 0.055 + k.pressOffset;
        });

        // 15.9 正念呼吸木燈動畫
        breathRing1.rotation.z = elapsed * 0.5;
        breathRing1.rotation.x = elapsed * 0.35;
        breathRing2.rotation.y = -elapsed * 0.45;

        if (breathActive) {
            breathElapsed += dt;
            const cycleTime = breathElapsed % 14;
            const phaseEl = document.getElementById('breath-phase');
            const timerEl = document.getElementById('breath-timer');
            const uiCircle = document.getElementById('breath-ui-circle');

            let scaleVal = 1.0;
            let currentPhase = '';

            if (cycleTime < 4) {
                currentPhase = '吸氣';
                const p = cycleTime / 4;
                scaleVal = 0.85 + p * 0.6;
                phaseEl.textContent = '緩緩吸氣...';
                timerEl.textContent = `${Math.ceil(4 - cycleTime)}s`;
                uiCircle.style.transform = `scale(${1 + p * 0.26})`;
            } else if (cycleTime < 8) {
                currentPhase = '停留';
                scaleVal = 1.45;
                phaseEl.textContent = '溫柔停留...';
                timerEl.textContent = `${Math.ceil(8 - cycleTime)}s`;
                uiCircle.style.transform = 'scale(1.26)';
            } else {
                currentPhase = '吐氣';
                const p = (cycleTime - 8) / 6;
                scaleVal = 1.45 - p * 0.6;
                phaseEl.textContent = '放鬆吐氣...';
                timerEl.textContent = `${Math.ceil(14 - cycleTime)}s`;
                uiCircle.style.transform = `scale(${1.26 - p * 0.26})`;
            }

            if (currentPhase !== lastBreathPhase) {
                lastBreathPhase = currentPhase;
                sound.playBreathTone(currentPhase === '吸氣' ? 432 : currentPhase === '停留' ? 528 : 396);
            }

            breathOrb.scale.setScalar(scaleVal);
            breathLight.intensity = 0.5 + (scaleVal - 0.85) * 0.85;
        } else {
            const idlePulse = 1 + Math.sin(elapsed * 1.8) * 0.07;
            breathOrb.scale.setScalar(idlePulse);
        }

        // 15.10 3D 情緒天氣瓶內部 80 顆星砂結晶與 260 顆星砂雲旋轉漂浮
        jarSwirlBoost = THREE.MathUtils.lerp(jarSwirlBoost, 1.0, 0.03);
        starCloudPoints.rotation.y += dt * 0.65 * jarSwirlBoost;
        jarCrystals.forEach(c => {
            c.angle += dt * c.speed * jarSwirlBoost;
            c.mesh.position.x = Math.cos(c.angle) * c.radius;
            c.mesh.position.z = Math.sin(c.angle) * c.radius;
            c.mesh.position.y = c.baseY + Math.sin(elapsed * 2.4 + c.angle) * 0.04;
            c.mesh.rotation.y += 0.04 * jarSwirlBoost;
            c.mesh.rotation.x += 0.03 * jarSwirlBoost;
        });

        // 15.11 3D 心聲信紙飛入原木樹洞圓孔動畫
        if (noteFlightProgress >= 0) {
            noteFlightProgress += dt * 0.85;
            if (noteFlightProgress <= 1) {
                const t = noteFlightProgress;
                flyingNote3D.position.set(
                    1.81,
                    1.85 + Math.sin(t * Math.PI) * 0.55 + t * 0.32,
                    -1.6 - t * 1.65
                );
                flyingNote3D.rotation.x = t * Math.PI * 2;
                flyingNote3D.rotation.y = Math.sin(t * Math.PI * 3) * 0.4;
                const s = 1 - t * 0.65;
                flyingNote3D.scale.setScalar(s);
            } else {
                flyingNote3D.visible = false;
                noteFlightProgress = -1;
                const holeWorldPos = new THREE.Vector3(1.81, 1.4, -3.25);
                spawnWarmParticles(holeWorldPos, 18, 0xfde047);
                sound.playWoodXylophone(6);
            }
        }

        // 15.12 窗外雨滴下落動畫
        if (rainMat.opacity > 0.01) {
            const posAttr = rainGeo.getAttribute('position');
            for (let i = 0; i < rainCount; i++) {
                let y = posAttr.getY(i) - 0.055;
                if (y < 1.8) y = 3.6;
                posAttr.setY(i, y);
            }
            posAttr.needsUpdate = true;
        }

        // 15.13 森林溫暖微光粒子更新
        for (let i = floatingParticles.length - 1; i >= 0; i--) {
            const p = floatingParticles[i];
            p.mesh.position.y += p.vy;
            p.mesh.position.x += p.vx;
            p.mesh.rotation.y += 0.05;
            p.life -= 0.016;
            p.mesh.material.opacity = Math.max(0, p.life);
            if (p.life <= 0) {
                scene.remove(p.mesh);
                p.mesh.geometry.dispose();
                p.mesh.material.dispose();
                floatingParticles.splice(i, 1);
            }
        }

        renderer.render(scene, camera);
    }

    animate();
})();
