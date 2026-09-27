import { CREATURES } from './creatures.js';
import { WORLDS } from './worlds.js';
import { ACHIEVEMENTS } from './achievements.js';
import { gameState } from './state.js';
import { loadState, saveState } from './storage.js';
import { playSound, stopAudio } from './audio.js';
import { initUI } from './ui.js';

        function safeClick(fn) {
            try { fn(); } catch(e) { console.error(e); }
        }

        function drawCreature(ctx, tier, x, y, size, wingAngle, facing = 1) {
            ctx.save();
            ctx.translate(x, y);
            if (facing < 0) ctx.scale(-1, 1);

            if (tier === 'free') {
                ctx.fillStyle = '#fde047';
                ctx.beginPath(); ctx.ellipse(0, 0, size*0.45, size*0.35, 0, 0, Math.PI*2); ctx.fill();
                ctx.lineWidth = 2; ctx.strokeStyle = '#ca8a04'; ctx.stroke();
                ctx.fillStyle = '#fef08a';
                ctx.beginPath(); ctx.ellipse(size*0.1, size*0.1, size*0.25, size*0.2, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#fde047';
                ctx.beginPath(); ctx.arc(size*0.3, -size*0.15, size*0.25, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#f97316';
                ctx.beginPath(); ctx.moveTo(size*0.5, -size*0.18); ctx.lineTo(size*0.7, -size*0.12); ctx.lineTo(size*0.48, -size*0.06); ctx.closePath(); ctx.fill();
                ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(size*0.38, -size*0.22, size*0.06, 0, Math.PI*2); ctx.fill();
                ctx.save(); ctx.translate(-size*0.05, -size*0.05); ctx.rotate(wingAngle);
                ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.ellipse(0, -size*0.2, size*0.2, size*0.35, Math.PI*0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.restore();
            } else if (tier === 'coins') {
                const grad = ctx.createLinearGradient(-size*0.4, -size*0.4, size*0.4, size*0.4);
                grad.addColorStop(0, '#ec4899'); grad.addColorStop(1, '#8b5cf6');
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.ellipse(0, 0, size*0.48, size*0.36, 0, 0, Math.PI*2); ctx.fill();
                ctx.lineWidth = 2.5; ctx.strokeStyle = '#4c1d95'; ctx.stroke();
                ctx.fillStyle = '#fef08a';
                ctx.beginPath(); ctx.arc(-size*0.1, -size*0.1, size*0.08, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(size*0.1, size*0.1, size*0.08, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#312e81';
                ctx.beginPath(); ctx.arc(size*0.35, 0, size*0.2, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.arc(size*0.4, -size*0.06, size*0.07, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#000000';
                ctx.beginPath(); ctx.arc(size*0.42, -size*0.06, size*0.03, 0, Math.PI*2); ctx.fill();
                ctx.save(); ctx.translate(0, -size*0.1); ctx.rotate(wingAngle * 1.5);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
                ctx.beginPath(); ctx.ellipse(0, -size*0.3, size*0.25, size*0.45, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.restore();
            } else {
                const pGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, size*0.6);
                pGrad.addColorStop(0, '#fef08a'); pGrad.addColorStop(0.5, '#f97316'); pGrad.addColorStop(1, '#dc2626');
                ctx.fillStyle = pGrad;
                ctx.beginPath(); ctx.ellipse(0, 0, size*0.52, size*0.4, 0, 0, Math.PI*2); ctx.fill();
                ctx.lineWidth = 3; ctx.strokeStyle = '#fef08a'; ctx.stroke();
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath(); ctx.moveTo(0, -size*0.4); ctx.lineTo(-size*0.15, -size*0.6); ctx.lineTo(size*0.05, -size*0.45); ctx.closePath(); ctx.fill();
                ctx.fillStyle = '#ea580c';
                ctx.beginPath(); ctx.arc(size*0.35, -size*0.1, size*0.25, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#fef08a';
                ctx.beginPath(); ctx.moveTo(size*0.5, -size*0.15); ctx.lineTo(size*0.75, -0.08); ctx.lineTo(size*0.48, 0); ctx.closePath(); ctx.fill();
                ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(size*0.4, -size*0.15, size*0.08, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#1e1b4b'; ctx.beginPath(); ctx.arc(size*0.42, -size*0.15, size*0.04, 0, Math.PI*2); ctx.fill();
                ctx.save(); ctx.translate(-size*0.05, -size*0.05); ctx.rotate(wingAngle * 1.8);
                ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
                ctx.beginPath(); ctx.ellipse(0, -size*0.35, size*0.3, size*0.55, Math.PI*0.25, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.restore();
            }
            ctx.restore();
        }

                                        let canvas, ctx;
        let flightActive = false;
        let flightPaused = false;
        let player = {};
        let sparkles = [];
        let obstacles = [];
        let npcs = [];
        let flightProgress = 0;
        let targetProgress = 3500;
        let sparklesCollected = 0;
        let sparklesTotal = 30;
        let friendsHelped = 0;
        let friendsTotal = 3;
        let touchActive = false;
        let touchY = 0;
        let animTick = 0;
        let pendingCheckoutItem = null;
        let animationFrameId = 0;
        let resizeHandler = null;
        let flightSession = 0;

        function showScreen(screenId) {
            const screens = ['splash', 'main-menu', 'creature-select', 'world-select', 'achievements', 'flight', 'pause', 'results', 'daily-rewards', 'settings', 'parent-zone', 'checkout'];
            screens.forEach(s => {
                const el = document.getElementById(`screen-${s}`);
                if (el && s !== 'checkout') el.classList.add('hidden');
            });

            const target = document.getElementById(`screen-${screenId}`);
            if (target) target.classList.remove('hidden');

            if (screenId === 'creature-select') renderCreatureShop();
            if (screenId === 'world-select') renderWorldSelect();
            if (screenId === 'achievements') renderAchievements();
            if (screenId === 'main-menu') updateMainMenuUI();
            updateCoinDisplays();
        }

        function updateCoinDisplays() {
            document.querySelectorAll('.coin-display').forEach(el => {
                el.innerText = gameState.coins.toLocaleString();
            });
        }

        function updateMainMenuUI() {
            const current = CREATURES.find(c => c.id === gameState.currentCreatureId) || CREATURES[0];
            document.getElementById('menu-creature-name').innerText = current.name;
            document.getElementById('menu-creature-desc').innerText = `"${current.desc}"`;
            document.getElementById('menu-creature-count').innerText = `${CREATURES.filter(c => c.unlocked).length}/${CREATURES.length}`;
            
            const mCanvas = document.getElementById('menu-creature-canvas');
            if (mCanvas) {
                const mCtx = mCanvas.getContext('2d');
                mCtx.clearRect(0, 0, 80, 80);
                drawCreature(mCtx, current.tier, 40, 45, 45, Math.sin(Date.now() * 0.01) * 0.4);
            }
        }

        function renderCreatureShop() {
            const container = document.getElementById('creature-list-container');
            container.innerHTML = '';

            CREATURES.forEach(c => {
                const isSelected = c.id === gameState.currentCreatureId;
                const card = document.createElement('div');
                card.className = `bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl border-4 ${isSelected ? 'border-amber-400 ring-4 ring-amber-200' : 'border-white'} flex flex-col gap-3`;
                
                let priceBadge = c.unlocked ? 'Unlocked & Ready' : c.tier === 'coins' ? `Cost: ${c.price} 💰` : `Real Money: $${c.price.toFixed(2)}`;
                let btnText = isSelected ? '✓ CURRENTLY FLYING' : c.unlocked ? 'SELECT FRIEND' : c.tier === 'coins' ? `UNLOCK (${c.price} 💰)` : `BUY ($${c.price.toFixed(2)})`;
                let btnColor = isSelected ? 'bg-amber-500 text-white' : c.unlocked ? 'bg-emerald-500 hover:bg-emerald-400 text-white' : c.tier === 'coins' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-rose-500 hover:bg-rose-400 text-white';

                card.innerHTML = `
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl flex items-center justify-center shadow-inner relative">
                            <canvas id="shop-canvas-${c.id}" width="60" height="60" class="w-14 h-14"></canvas>
                        </div>
                        <div class="flex-1">
                            <h3 class="font-fredoka text-lg text-indigo-900">${c.name}</h3>
                            <p class="text-xs text-gray-600">${c.desc}</p>
                            <span class="text-xs font-bold text-amber-700">${priceBadge}</span>
                        </div>
                    </div>
                    <div>
                        <button onclick="safeClick(() => selectOrUnlockCreature('${c.id}'))" class="w-full ${btnColor} font-fredoka py-2.5 rounded-xl shadow text-sm transition cursor-pointer">
                            ${btnText}
                        </button>
                    </div>
                `;
                container.appendChild(card);
                
                setTimeout(() => {
                    const thumbCanvas = document.getElementById(`shop-canvas-${c.id}`);
                    if (thumbCanvas) {
                        const tCtx = thumbCanvas.getContext('2d');
                        tCtx.clearRect(0, 0, 60, 60);
                        drawCreature(tCtx, c.tier, 30, 32, 35, 0.2);
                    }
                }, 50);
            });
        }

        function selectOrUnlockCreature(id) {
            const creature = CREATURES.find(c => c.id === id);
            if (!creature) return;

            if (creature.unlocked) {
                gameState.currentCreatureId = id;
                renderCreatureShop();
                updateMainMenuUI();
            } else if (creature.tier === 'coins') {
                if (gameState.coins >= creature.price) {
                    gameState.coins -= creature.price;
                    creature.unlocked = true;
                    gameState.currentCreatureId = id;
                    updateCoinDisplays();
                    renderCreatureShop();
                    updateMainMenuUI();
                } else {
                    alert("Not enough coins to unlock this friend!");
                }
            } else if (creature.tier === 'money') {
                pendingCheckoutItem = { type: 'creature', id: creature.id, name: creature.name, price: creature.price };
                document.getElementById('checkout-item-desc').innerText = `Unlock ${creature.name}`;
                document.getElementById('checkout-item-price').innerText = `$${creature.price.toFixed(2)}`;
                document.getElementById('screen-checkout').classList.remove('hidden');
            }
        }

        function renderWorldSelect() {
            const container = document.getElementById('world-list-container');
            container.innerHTML = '';

            WORLDS.forEach(w => {
                const isSelected = w.id === gameState.currentWorldId;
                const card = document.createElement('div');
                card.className = `bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-xl border-4 ${isSelected ? 'border-amber-400 ring-4 ring-amber-200' : 'border-white'} flex flex-col justify-between`;
                
                let priceLabel = w.unlocked ? 'Unlocked & Ready' : w.tier === 'coins' ? `Cost: ${w.price} 💰` : `Real Money: $${w.price.toFixed(2)}`;
                let btnText = isSelected ? '✨ READY TO FLY!' : w.unlocked ? 'SELECT WORLD' : w.tier === 'coins' ? `UNLOCK (${w.price} 💰)` : `BUY ($${w.price.toFixed(2)})`;
                let btnColor = isSelected ? 'bg-amber-500 text-white' : w.unlocked ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white' : w.tier === 'coins' ? 'bg-purple-500 text-white' : 'bg-rose-500 text-white';

                card.innerHTML = `
                    <div>
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-4xl">${w.icon}</span>
                            <span class="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-1 rounded-full">${w.diff}</span>
                        </div>
                        <h3 class="font-fredoka text-xl text-indigo-900">${w.name}</h3>
                        <p class="text-xs text-gray-600 mb-1">${w.desc}</p>
                        <p class="text-xs text-indigo-700 font-bold mb-1">Items: ${w.nameCol} (${w.collectible})</p>
                        <span class="text-xs font-bold text-amber-700">${priceLabel}</span>
                    </div>
                    <div class="mt-3">
                        <button onclick="safeClick(() => selectWorld('${w.id}'))" class="w-full ${btnColor} font-fredoka py-3 rounded-xl shadow transition text-sm cursor-pointer">
                            ${btnText}
                        </button>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function selectWorld(id) {
            const world = WORLDS.find(w => w.id === id);
            if (!world) return;

            if (world.unlocked) {
                gameState.currentWorldId = id;
                startFlightJourney();
            } else if (world.tier === 'coins') {
                if (gameState.coins >= world.price) {
                    gameState.coins -= world.price;
                    world.unlocked = true;
                    gameState.currentWorldId = id;
                    updateCoinDisplays();
                    renderWorldSelect();
                } else {
                    alert("Not enough coins to unlock this world!");
                }
            } else if (world.tier === 'money') {
                pendingCheckoutItem = { type: 'world', id: world.id, name: world.name, price: world.price };
                document.getElementById('checkout-item-desc').innerText = `Unlock World: ${world.name}`;
                document.getElementById('checkout-item-price').innerText = `$${world.price.toFixed(2)}`;
                document.getElementById('screen-checkout').classList.remove('hidden');
            }
        }

        function renderAchievements() {
            const container = document.getElementById('achievements-list-container');
            container.innerHTML = '';
            ACHIEVEMENTS.forEach(a => {
                const card = document.createElement('div');
                card.className = `bg-white/90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border-2 ${a.unlocked ? 'border-emerald-400 bg-emerald-50/90' : 'border-gray-200'}`;
                card.innerHTML = `
                    <div class="text-3xl">${a.icon}</div>
                    <div class="flex-1">
                        <h4 class="font-fredoka text-indigo-900">${a.title}</h4>
                        <p class="text-xs text-gray-600">${a.desc}</p>
                    </div>
                    <div>
                        <span class="text-xs font-bold px-2.5 py-1 rounded-full ${a.unlocked ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-700'}">${a.unlocked ? 'Unlocked' : 'Locked'}</span>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function confirmRealMoneyPurchase() {
            if (!pendingCheckoutItem) return;
            if (pendingCheckoutItem.type === 'creature') {
                const c = CREATURES.find(x => x.id === pendingCheckoutItem.id);
                if (c) {
                    c.unlocked = true;
                    gameState.currentCreatureId = c.id;
                    renderCreatureShop();
                    updateMainMenuUI();
                }
            } else if (pendingCheckoutItem.type === 'world') {
                const w = WORLDS.find(x => x.id === pendingCheckoutItem.id);
                if (w) {
                    w.unlocked = true;
                    gameState.currentWorldId = w.id;
                    renderWorldSelect();
                }
            }
            document.getElementById('screen-checkout').classList.add('hidden');
            pendingCheckoutItem = null;
            updateCoinDisplays();
            alert("✨ Purchase Successful! Enjoy your new content!");
        }

        function startFlightJourney() {
            showScreen('flight');
            initFlight();
        }

        function initFlight() {
            flightSession += 1;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (resizeHandler) window.removeEventListener('resize', resizeHandler);
            canvas = document.getElementById('game-canvas');
            ctx = canvas.getContext('2d');
            resizeCanvas();
            resizeHandler = resizeCanvas;
            window.addEventListener('resize', resizeHandler);

            const creature = CREATURES.find(c => c.id === gameState.currentCreatureId) || CREATURES[0];
            const world = WORLDS.find(w => w.id === gameState.currentWorldId) || WORLDS[0];

            document.getElementById('hud-creature-name').innerText = creature.name.split(' ')[0];
            document.getElementById('hud-collectible-icon').innerText = world.collectible;

            player = {
                x: 100,
                y: canvas.height / 2,
                w: 54,
                h: 54,
                vy: 0,
                targetY: canvas.height / 2,
                tier: creature.tier,
                trail: []
            };

            sparkles = [];
            obstacles = [];
            npcs = [];
            flightProgress = 0;
            targetProgress = 3500;
            sparklesCollected = 0;
            sparklesTotal = 30;
            friendsHelped = 0;
            friendsTotal = 3;

            for (let i = 0; i < sparklesTotal; i++) {
                sparkles.push({
                    x: 300 + i * 95 + Math.random() * 40,
                    y: 80 + Math.random() * (canvas.height - 220),
                    collected: false
                });
            }

            for (let i = 0; i < 14; i++) {
                obstacles.push({
                    x: 500 + i * 250 + Math.random() * 50,
                    y: Math.random() > 0.5 ? 20 : canvas.height - 140,
                    w: 50,
                    h: 100
                });
            }

            for (let i = 0; i < friendsTotal; i++) {
                npcs.push({
                    x: 800 + i * 1000,
                    y: canvas.height - 190,
                    icon: ['🪶', '🦋', '🐣'][i],
                    helped: false
                });
            }

            flightActive = true;
            flightPaused = false;

            canvas.onpointerdown = (e) => {
                touchActive = true;
                touchY = e.clientY;
            };
            canvas.onpointermove = (e) => {
                if (touchActive) touchY = e.clientY;
            };
            canvas.onpointerup = () => {
                touchActive = false;
            };

            animationFrameId = requestAnimationFrame(() => flightLoop(flightSession));
        }

        function resizeCanvas() {
            if (!canvas) return;
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        }

        function flightLoop(session = flightSession) {
            if (!flightActive || session !== flightSession) return;

            if (!flightPaused) {
                animTick += 0.15;
                updateFlight();
                renderFlight();
            }

            animationFrameId = requestAnimationFrame(() => flightLoop(session));
        }

        function updateFlight() {
            flightProgress += 3.0;

            const progressRatio = Math.min(1, flightProgress / targetProgress);
            const pct = Math.floor(progressRatio * 100);
            const fillEl = document.getElementById('level-progress-fill');
            const pctEl = document.getElementById('level-progress-pct');
            if (fillEl) fillEl.style.width = `${pct}%`;
            if (pctEl) pctEl.innerText = `${pct}%`;

            if (touchActive) {
                player.targetY = touchY - 80;
            } else {
                player.targetY += Math.sin(animTick * 0.5) * 1.8;
            }
            player.targetY = Math.max(60, Math.min(canvas.height - 120, player.targetY));
            player.y += (player.targetY - player.y) * 0.12;

            if (Math.random() < 0.5) {
                player.trail.push({ x: player.x, y: player.y + 10, alpha: 1 });
            }
            player.trail.forEach(t => t.x -= 3.0);
            player.trail = player.trail.filter(t => t.alpha > 0.1 && t.x > 0);

            sparkles.forEach(s => {
                s.x -= 3.0;
                if (!s.collected && Math.hypot(player.x - s.x, player.y - s.y) < 45) {
                    s.collected = true;
                    sparklesCollected++;
                    document.getElementById('hud-sparkle-count').innerText = `${sparklesCollected}/${sparklesTotal}`;
                }
            });

            obstacles.forEach(o => {
                o.x -= 3.0;
                if (Math.abs(player.x - o.x) < 35 && Math.abs(player.y - o.y) < 55) {
                    player.y += player.y < o.y ? -6 : 6;
                }
            });

            npcs.forEach(n => {
                n.x -= 3.0;
                if (!n.helped && Math.hypot(player.x - n.x, player.y - n.y) < 55) {
                    n.helped = true;
                    friendsHelped++;
                    document.getElementById('hud-friend-count').innerText = `${friendsHelped}/${friendsTotal}`;
                }
            });

            if (flightProgress >= targetProgress) {
                completeFlight();
            }
        }

        function renderFlight() {
            if (!ctx) return;
            const world = WORLDS.find(w => w.id === gameState.currentWorldId) || WORLDS[0];

            ctx.fillStyle = world.color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            for (let i = 0; i < 6; i++) {
                let cx = (i * 280 - (flightProgress * 0.6) % 1500 + 1500) % 1500 - 100;
                ctx.beginPath();
                ctx.arc(cx, 80 + (i % 3) * 50, 45, 0, Math.PI * 2);
                ctx.arc(cx + 30, 70 + (i % 3) * 50, 35, 0, Math.PI * 2);
                ctx.fill();
            }

            sparkles.forEach(s => {
                if (!s.collected) {
                    ctx.save();
                    ctx.translate(s.x, s.y);
                    ctx.font = '26px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(world.collectible, 0, 0);
                    ctx.restore();
                }
            });

            obstacles.forEach(o => {
                ctx.fillStyle = world.groundColor;
                ctx.beginPath();
                ctx.roundRect(o.x, o.y, o.w, o.h, 16);
                ctx.fill();
            });

            npcs.forEach(n => {
                ctx.save();
                ctx.translate(n.x, n.y);
                ctx.font = '34px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(n.icon, 0, 0);
                if (n.helped) {
                    ctx.font = '16px sans-serif';
                    ctx.fillText('❤️', 18, -18);
                }
                ctx.restore();
            });

            player.trail.forEach(t => {
                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.beginPath();
                ctx.arc(t.x, t.y, 5, 0, Math.PI * 2);
                ctx.fill();
            });

            const wingAnim = Math.sin(animTick * 3) * 0.6;
            drawCreature(ctx, player.tier, player.x, player.y, 52, wingAnim, 1);

            ctx.fillStyle = world.groundColor;
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - 40);
            ctx.lineTo(canvas.width, canvas.height - 40);
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fill();
        }

        function pauseGame() {
            if (!flightActive) return;
            flightPaused = true;
            document.getElementById('screen-pause').classList.remove('hidden');
        }

        function resumeGame() {
            if (!flightActive) return;
            flightPaused = false;
            document.getElementById('screen-pause').classList.add('hidden');
        }

        function restartFlight() {
            document.getElementById('screen-pause').classList.add('hidden');
            document.getElementById('screen-results').classList.add('hidden');
            initFlight();
        }

        function completeFlight() {
            flightActive = false;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            const world = WORLDS.find(w => w.id === gameState.currentWorldId) || WORLDS[0];
            const earnedCoins = sparklesCollected * 5 + friendsHelped * 60;
            gameState.coins += earnedCoins;
            gameState.stats.flights++;
            gameState.stats.sparkles += sparklesCollected;
            gameState.stats.friends += friendsHelped;

            if (gameState.stats.sparkles >= 100) ACHIEVEMENTS[3].unlocked = true;

            const sparkleRatio = sparklesCollected / sparklesTotal;
            const completionRate = Math.min(100, Math.floor((sparklesCollected / sparklesTotal) * 100));
            
            let starCount = 1;
            if (sparkleRatio >= 0.9) starCount = 5;
            else if (sparkleRatio >= 0.75) starCount = 4;
            else if (sparkleRatio >= 0.5) starCount = 3;
            else if (sparkleRatio >= 0.25) starCount = 2;

            const starsHtml = '<span>⭐</span>'.repeat(starCount) + '<span style="opacity:0.3">' + '⭐'.repeat(5 - starCount) + '</span>';
            document.getElementById('results-stars-container').innerHTML = starsHtml;

            document.getElementById('results-world-name').innerText = world.name;
            document.getElementById('res-collectible-label').innerText = `${world.collectible} ${world.nameCol} Collected:`;
            document.getElementById('res-sparkles').innerText = `${sparklesCollected}/${sparklesTotal}`;
            document.getElementById('res-sparkle-bar').style.width = `${sparkleRatio * 100}%`;
            document.getElementById('res-friends').innerText = `${friendsHelped}/${friendsTotal}`;
            document.getElementById('res-completion-rate').innerText = `${completionRate}%`;
            document.getElementById('res-coins').innerText = earnedCoins;

            updateCoinDisplays();
            document.getElementById('screen-results').classList.remove('hidden');
        }

        function claimDailyReward() {
            gameState.coins += 100;
            updateCoinDisplays();
            showScreen('main-menu');
        }

        function toggleSetting(key) {
            gameState.settings[key] = !gameState.settings[key];
            const btn = document.getElementById(`toggle-${key}`);
            if (btn) {
                btn.innerText = gameState.settings[key] ? 'ON' : 'OFF';
                btn.className = gameState.settings[key] ? 'bg-emerald-500 text-white font-fredoka px-4 py-1.5 rounded-xl text-sm shadow cursor-pointer' : 'bg-gray-400 text-white font-fredoka px-4 py-1.5 rounded-xl text-sm shadow cursor-pointer';
            }
        }

        let parentTapCount = 0;
        function checkParentZone() {
            parentTapCount++;
            if (parentTapCount >= 3) {
                parentTapCount = 0;
                document.getElementById('stat-flights').innerText = gameState.stats.flights;
                document.getElementById('stat-sparkles').innerText = gameState.stats.sparkles.toLocaleString();
                document.getElementById('stat-friends').innerText = gameState.stats.friends;
                showScreen('parent-zone');
            }
        }

        window.onload = () => {
            const saved = loadState();
            if (saved) Object.assign(gameState, saved, { settings: { ...gameState.settings, ...(saved.settings || {}) }, stats: { ...gameState.stats, ...(saved.stats || {}) } });
            updateMainMenuUI();
            updateCoinDisplays();
            initUI();

            const sCanvas = document.getElementById('splash-creature-canvas');
            if (sCanvas) {
                const sCtx = sCanvas.getContext('2d');
                setInterval(() => {
                    sCtx.clearRect(0, 0, 120, 120);
                    drawCreature(sCtx, 'free', 60, 65, 55, Math.sin(Date.now() * 0.008) * 0.5);
                }, 30);
            }
        };

        window.safeClick = safeClick;
        window.showScreen = showScreen;
        window.pauseGame = pauseGame;
        window.resumeGame = resumeGame;
        window.restartFlight = restartFlight;
        window.claimDailyReward = claimDailyReward;
        window.toggleSetting = toggleSetting;
        window.checkParentZone = checkParentZone;
        window.selectOrUnlockCreature = selectOrUnlockCreature;
        window.selectWorld = selectWorld;
        window.confirmRealMoneyPurchase = confirmRealMoneyPurchase;

