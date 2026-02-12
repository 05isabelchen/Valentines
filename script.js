// State management
const state = {
    unlockedMemories: new Set(),
    totalMemories: 15,
    currentMemory: null,
    currentAudio: null,
    isMusicEnabled: true
};

// Initialize starfield background
function initStarfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const stars = [];
    const numStars = 200;
    
    // Create stars
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random(),
            twinkleSpeed: Math.random() * 0.02 + 0.01
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
            
            // Twinkle effect
            star.opacity += star.twinkleSpeed;
            if (star.opacity > 1 || star.opacity < 0.3) {
                star.twinkleSpeed *= -1;
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Update memory counter
function updateCounter() {
    document.getElementById('unlocked-count').textContent = state.unlockedMemories.size;
    document.getElementById('total-count').textContent = state.totalMemories;
    
    // Check if final memory should be unlocked
    const finalMemory = document.querySelector('.memory-point[data-memory="15"]');
    if (state.unlockedMemories.size >= 14 && !state.unlockedMemories.has(15)) {
        finalMemory.classList.remove('locked');
        finalMemory.querySelector('.star-icon').style.opacity = '1';
        finalMemory.querySelector('.star-icon').style.filter = 'none';
    }
}

// Memory point click handlers
function setupMemoryPoints() {
    const memoryPoints = document.querySelectorAll('.memory-point');
    
    memoryPoints.forEach(point => {
        point.addEventListener('click', () => {
            const memoryId = parseInt(point.dataset.memory);
            
            // Check if final memory and not enough memories unlocked
            if (memoryId === 15 && state.unlockedMemories.size < 14) {
                return;
            }
            
            // For Memory 1, show game first if not unlocked
            if (memoryId === 1 && !state.unlockedMemories.has(1)) {
                showHeartGame();
                return;
            }
            openMemory(memoryId);
        });
    });
}

function showHeartGame() {
    console.log('showHeartGame called!'); // ADD THIS LINE
    const gameModal = document.getElementById('heart-game-modal');
    console.log('Game modal element:', gameModal); // ADD THIS LINE
    gameModal.classList.remove('hidden');
    
    // Start the game
    setupHeartCatchingGame();
}

// Music control
function setupMusicControl() {
    const musicToggle = document.getElementById('music-toggle');
    
    musicToggle.addEventListener('click', () => {
        state.isMusicEnabled = !state.isMusicEnabled;
        
        if (state.currentAudio) {
            if (state.isMusicEnabled) {
                state.currentAudio.play();
                musicToggle.querySelector('.music-icon').textContent = '🔊';
            } else {
                state.currentAudio.pause();
                musicToggle.querySelector('.music-icon').textContent = '🔇';
            }
        }
    });
}

// Play background music for memory
function playMemoryMusic(musicFile) {
    // Stop current audio if playing
    if (state.currentAudio) {
        state.currentAudio.pause();
        state.currentAudio = null;
    }
    
    if (!state.isMusicEnabled || !musicFile) return;
    
    // Note: You'll need to add actual audio files
    // For now, this is a placeholder structure
    // Replace with: state.currentAudio = new Audio(`/music/${musicFile}`);
    
    // Placeholder: Log which music would play
    console.log(`Would play music: ${musicFile}`);
    
    // When you add real audio files:
    /*
    state.currentAudio = new Audio(`/music/${musicFile}`);
    state.currentAudio.loop = true;
    state.currentAudio.volume = 0.3;
    state.currentAudio.play().catch(e => console.log('Audio play failed:', e));
    */
}

function openMemory(memoryId) {
    console.log('Opening memory:', memoryId);
    state.currentMemory = memoryId;
    const modal = document.getElementById('memory-modal');
    const modalBody = document.getElementById('modal-body');
    const template = document.getElementById(`memory-${memoryId}-template`);
    
    console.log('Modal element:', modal); // ADD THIS
    console.log('Modal classes before:', modal.className); // ADD THIS
    
    // Clone template content
    const content = template.content.cloneNode(true);
    modalBody.innerHTML = '';
    modalBody.appendChild(content);
    
    // Get music file from data attribute
    const memoryDetail = modalBody.querySelector('.memory-detail');
    const musicFile = memoryDetail?.dataset.music;
    
    // Play music
    playMemoryMusic(musicFile);
    
    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('active');
    console.log('Modal classes after:', modal.className); // ADD THIS
    
    document.getElementById('home-btn').classList.remove('hidden');
    
    // Setup challenge based on memory
    setupChallenge(memoryId);
    
    // Setup carousel
    // Setup carousel
    setupCarousel();

// Setup fullscreen viewer
    setupFullscreenViewer();
    
    // If already unlocked, show content immediately
    if (state.unlockedMemories.has(memoryId)) {
        const challenge = modalBody.querySelector('.unlock-challenge');
        const story = modalBody.querySelector('.memory-story');
        if (challenge) challenge.style.display = 'none';
        if (story) story.classList.remove('hidden');
    }
}

// Close memory modal
function closeMemory() {
    const modal = document.getElementById('memory-modal');
    modal.classList.remove('active');
    modal.classList.add('hidden');
    
    // Stop music
    if (state.currentAudio) {
        state.currentAudio.pause();
        state.currentAudio = null;
    }
    
    setTimeout(() => {
        document.getElementById('modal-body').innerHTML = '';
    }, 400);
}

// Setup image carousel
// Setup image carousel
// Setup image carousel
function setupCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (!track || slides.length === 0) return;
    
    let currentSlide = 0;
    
    function goToSlide(index) {
        currentSlide = index;
        
        // Move the track
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update active states
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    // Previous button
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent fullscreen viewer from opening
        currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
        goToSlide(currentSlide);
    });
    
    // Next button
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent fullscreen viewer from opening
        currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
        goToSlide(currentSlide);
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
}

// Setup fullscreen image viewer
function setupFullscreenViewer() {
    // Create fullscreen viewer if it doesn't exist
    let viewer = document.getElementById('fullscreen-viewer');
    if (!viewer) {
        viewer = document.createElement('div');
        viewer.id = 'fullscreen-viewer';
        viewer.className = 'fullscreen-viewer';
        viewer.innerHTML = `
            <button class="fullscreen-close">×</button>
            <div id="fullscreen-content"></div>
        `;
        document.body.appendChild(viewer);
        
        // Close on click outside or close button
        viewer.addEventListener('click', (e) => {
            if (e.target === viewer || e.target.classList.contains('fullscreen-close')) {
                viewer.classList.remove('active');
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && viewer.classList.contains('active')) {
                viewer.classList.remove('active');
            }
        });
    }
    
    // Add click handlers to all carousel slides
    const slides = document.querySelectorAll('.carousel-slide');
    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            const content = slide.querySelector('.placeholder-img, img');
            const fullscreenContent = document.getElementById('fullscreen-content');
            
            if (content) {
                // Clone the content for fullscreen
                fullscreenContent.innerHTML = '';
                const clone = content.cloneNode(true);
                clone.classList.add('fullscreen-placeholder');
                fullscreenContent.appendChild(clone);
                
                viewer.classList.add('active');
            }
        });
    });
}

// Setup challenges
// Setup challenges
function setupChallenge(memoryId) {
    switch(memoryId) {
        case 1:
            setupHeartCatchingGame();  // Changed from setupInputChallenge()
            break;
        case 2:
            setupMatchingGame();
            break;
        case 3:
            setupDragSortChallenge();
            break;
        case 4:
            setupChoiceChallenge();
            break;
        case 5:
            setupInputChallenge();
            break;
        case 6:
            setupChoiceChallenge();
            break;
        case 7:
            setupMemoryCardGame();
            break;
        case 8:
            setupChoiceChallenge();
            break;
        case 9:
            setupInputChallenge();
            break;
        case 10:
            setupSliderChallenge();
            break;
        case 11:
            setupChoiceChallenge();
            break;
        case 12:
            setupChoiceChallenge();
            break;
        case 13:
            setupCounterChallenge();
            break;
        case 14:
            setupDragSortChallenge();
            break;
        case 15:
            setupFinalMemory();
            break;
    }
}

// Choice-based challenge
function setupChoiceChallenge() {
    const buttons = document.querySelectorAll('.choice-btn');
    const feedback = document.querySelector('.feedback-message');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const isCorrect = btn.dataset.correct === 'true';
            
            if (isCorrect) {
                btn.classList.add('correct');
                feedback.textContent = '✨ Correct! Unlocking memory...';
                feedback.classList.add('success');
                
                setTimeout(() => {
                    unlockMemory();
                }, 1500);
            } else {
                btn.classList.add('incorrect');
                feedback.textContent = '❌ Not quite... try again!';
                feedback.classList.add('error');
                
                setTimeout(() => {
                    btn.classList.remove('incorrect');
                    feedback.textContent = '';
                    feedback.classList.remove('error');
                }, 1000);
            }
            
            buttons.forEach(b => b.disabled = isCorrect);
        });
    });
}

// Input-based challenge
function setupInputChallenge() {
    const input = document.querySelector('.unlock-input');
    const button = document.querySelector('.unlock-submit-btn');
    const feedback = document.querySelector('.feedback-message');
    
    const checkAnswer = () => {
        const answer = input.value.toLowerCase().trim();
        const correctAnswer = input.dataset.answer.toLowerCase();
        
        if (answer === correctAnswer) {
            feedback.textContent = '✨ Correct! Unlocking memory...';
            feedback.classList.add('success');
            input.disabled = true;
            button.disabled = true;
            
            setTimeout(() => {
                unlockMemory();
            }, 1500);
        } else {
            feedback.textContent = '❌ Not quite... try again!';
            feedback.classList.add('error');
            input.style.borderColor = '#f44336';
            
            setTimeout(() => {
                feedback.textContent = '';
                feedback.classList.remove('error');
                input.style.borderColor = '';
                input.value = '';
            }, 1500);
        }
    };
    
    button.addEventListener('click', checkAnswer);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });
}

// Drag and sort challenge
function setupDragSortChallenge() {
    const container = document.querySelector('.drag-sort-container');
    const items = container.querySelectorAll('.sortable-item');
    const button = document.querySelector('.unlock-submit-btn');
    const feedback = document.querySelector('.feedback-message');
    
    let draggedItem = null;
    
    items.forEach(item => {
        item.addEventListener('dragstart', () => {
            draggedItem = item;
            item.classList.add('dragging');
        });
        
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
        
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedItem !== item) {
                const allItems = [...container.querySelectorAll('.sortable-item')];
                const draggedIndex = allItems.indexOf(draggedItem);
                const targetIndex = allItems.indexOf(item);
                
                if (draggedIndex < targetIndex) {
                    container.insertBefore(draggedItem, item.nextSibling);
                } else {
                    container.insertBefore(draggedItem, item);
                }
            }
        });
    });
    
    button.addEventListener('click', () => {
        const currentOrder = [...container.querySelectorAll('.sortable-item')].map(item => 
            parseInt(item.dataset.order)
        );
        const correctOrder = Array.from({length: items.length}, (_, i) => i + 1);
        const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
        
        if (isCorrect) {
            feedback.textContent = '✨ Perfect order! Unlocking memory...';
            feedback.classList.add('success');
            button.disabled = true;
            
            setTimeout(() => {
                unlockMemory();
            }, 1500);
        } else {
            feedback.textContent = '❌ Not quite the right order... try again!';
            feedback.classList.add('error');
            
            setTimeout(() => {
                feedback.textContent = '';
                feedback.classList.remove('error');
            }, 2000);
        }
    });
}

// Matching game
function setupMatchingGame() {
    const songs = document.querySelectorAll('.match-item.song');
    const lyrics = document.querySelectorAll('.match-item.lyric');
    const feedback = document.querySelector('.feedback-message');
    let selectedSong = null;
    let matches = 0;
    
    songs.forEach(song => {
        song.addEventListener('click', () => {
            if (song.classList.contains('matched')) return;
            
            songs.forEach(s => s.classList.remove('selected'));
            song.classList.add('selected');
            selectedSong = song;
        });
    });
    
    lyrics.forEach(lyric => {
        lyric.addEventListener('click', () => {
            if (lyric.classList.contains('matched') || !selectedSong) return;
            
            if (selectedSong.dataset.id === lyric.dataset.id) {
                selectedSong.classList.add('matched');
                lyric.classList.add('matched');
                selectedSong.classList.remove('selected');
                matches++;
                
                if (matches === 3) {
                    feedback.textContent = '✨ Perfect! You know our Laufey songs!';
                    feedback.classList.add('success');
                    
                    setTimeout(() => {
                        unlockMemory();
                    }, 1500);
                }
                
                selectedSong = null;
            } else {
                feedback.textContent = '❌ Not a match... try again!';
                feedback.classList.add('error');
                
                setTimeout(() => {
                    feedback.textContent = '';
                    feedback.classList.remove('error');
                }, 1000);
            }
        });
    });
}

// Pumpkin finding game
function setupPumpkinGame() {
    const field = document.getElementById('pumpkin-game');
    const scoreDisplay = document.getElementById('pumpkins-found');
    const feedback = document.querySelector('.feedback-message');
    const totalItems = 40;
    const pumpkinPositions = new Set();
    
    // Randomly select 5 positions for pumpkins
    while (pumpkinPositions.size < 5) {
        pumpkinPositions.add(Math.floor(Math.random() * totalItems));
    }
    
    let found = 0;
    
    for (let i = 0; i < totalItems; i++) {
        const item = document.createElement('div');
        item.className = 'pumpkin-item';
        item.textContent = '🌾';
        const isPumpkin = pumpkinPositions.has(i);
        
        item.addEventListener('click', () => {
            if (item.classList.contains('clicked')) return;
            
            item.classList.add('clicked');
            
            if (isPumpkin) {
                item.textContent = '🎃';
                item.classList.add('found-pumpkin');
                found++;
                scoreDisplay.textContent = found;
                
                if (found >= 5) {
                    feedback.textContent = '✨ You found all the pumpkins!';
                    feedback.classList.add('success');
                    
                    setTimeout(() => {
                        unlockMemory();
                    }, 1500);
                }
            }
        });
        
        field.appendChild(item);
    }
}

// Slider challenge
function setupSliderChallenge() {
    const slider = document.getElementById('nervousness');
    const valueDisplay = document.getElementById('nervousness-value');
    const button = document.getElementById('check-nervousness');
    const feedback = document.querySelector('.feedback-message');
    
    slider.addEventListener('input', () => {
        valueDisplay.textContent = slider.value;
    });
    
    button.addEventListener('click', () => {
        const value = parseInt(slider.value);
        
        // Accept any value 7 or higher (meeting family is always nerve-wracking!)
        if (value >= 7) {
            feedback.textContent = '✨ Exactly! Meeting the family is always nerve-wracking!';
            feedback.classList.add('success');
            button.disabled = true;
            slider.disabled = true;
            
            setTimeout(() => {
                unlockMemory();
            }, 1500);
        } else {
            feedback.textContent = '❌ Come on, you were definitely more nervous than that!';
            feedback.classList.add('error');
            
            setTimeout(() => {
                feedback.textContent = '';
                feedback.classList.remove('error');
            }, 2000);
        }
    });
}

// Counter challenge
function setupCounterChallenge() {
    const downBtn = document.getElementById('counter-down');
    const upBtn = document.getElementById('counter-up');
    const display = document.getElementById('fall-counter');
    const checkBtn = document.getElementById('check-falls');
    const feedback = document.querySelector('.feedback-message');
    
    let count = 0;
    const correctAnswer = 5; // Change this to the actual number
    
    downBtn.addEventListener('click', () => {
        if (count > 0) {
            count--;
            display.textContent = count;
        }
    });
    
    upBtn.addEventListener('click', () => {
        count++;
        display.textContent = count;
    });
    
    checkBtn.addEventListener('click', () => {
        // Accept answers within reasonable range (3-7)
        if (count >= 3 && count <= 7) {
            feedback.textContent = '✨ Close enough! We definitely fell a lot!';
            feedback.classList.add('success');
            checkBtn.disabled = true;
            downBtn.disabled = true;
            upBtn.disabled = true;
            
            setTimeout(() => {
                unlockMemory();
            }, 1500);
        } else {
            feedback.textContent = '❌ Hmm, think again about our ice skating skills!';
            feedback.classList.add('error');
            
            setTimeout(() => {
                feedback.textContent = '';
                feedback.classList.remove('error');
            }, 2000);
        }
    });
}

// Final memory setup
function setupFinalMemory() {
    const progressFill = document.getElementById('final-progress');
    const memoriesUnlocked = document.getElementById('memories-unlocked');
    const feedback = document.querySelector('.feedback-message');
    
    const unlockedCount = state.unlockedMemories.size;
    memoriesUnlocked.textContent = unlockedCount;
    progressFill.style.width = (unlockedCount / 14 * 100) + '%';
    
    if (unlockedCount >= 14) {
        feedback.textContent = '✨ All memories explored! Opening final message...';
        feedback.classList.add('success');
        
        setTimeout(() => {
            unlockMemory();
        }, 1500);
    }
}

// Unlock memory
function unlockMemory() {
    const memoryId = state.currentMemory;
    state.unlockedMemories.add(memoryId);
    
    // Update UI
    const point = document.querySelector(`.memory-point[data-memory="${memoryId}"]`);
    point.classList.remove('locked');
    point.classList.add('unlocked');
    
    // Show memory content
    const challenge = document.querySelector('.unlock-challenge');
    const story = document.querySelector('.memory-story');
    
    if (challenge) {
        challenge.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        challenge.style.opacity = '0';
        challenge.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            challenge.style.display = 'none';
            if (story) {
                story.classList.remove('hidden');
            }
        }, 500);
    }
    
    updateCounter();
    
    // Save progress to localStorage
    localStorage.setItem('unlockedMemories', JSON.stringify([...state.unlockedMemories]));
}

// Load saved progress
function loadProgress() {
    const saved = localStorage.getItem('unlockedMemories');
    if (saved) {
        const unlocked = JSON.parse(saved);
        unlocked.forEach(id => {
            state.unlockedMemories.add(id);
            const point = document.querySelector(`.memory-point[data-memory="${id}"]`);
            if (point) {
                point.classList.remove('locked');
                point.classList.add('unlocked');
            }
        });
        updateCounter();
    }
}

// Setup modal controls
function setupModalControls() {
    const closeBtn = document.getElementById('close-modal');
    const modal = document.getElementById('memory-modal');
    const homeBtn = document.getElementById('home-btn');
    
    closeBtn.addEventListener('click', closeMemory);
    homeBtn.addEventListener('click', closeMemory);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeMemory();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeMemory();
        }
    });
}

// Heart catching game
function setupHeartCatchingGame() {
    const gameArea = document.getElementById('game-heart-area');
    const basket = document.getElementById('game-basket');
    const scoreDisplay = document.getElementById('game-hearts-caught');
    const feedback = document.getElementById('game-feedback');
    
    let heartsCaught = 0;
    let gameActive = true;
    let basketX = gameArea.offsetWidth / 2;
    
    // Mouse movement for basket
    gameArea.addEventListener('mousemove', (e) => {
        const rect = gameArea.getBoundingClientRect();
        basketX = e.clientX - rect.left;
        const maxX = gameArea.offsetWidth - 60; // basket width consideration
        basketX = Math.max(30, Math.min(basketX, maxX));
        basket.style.left = basketX + 'px';
        basket.style.transform = 'translateX(0)';
    });
    
    // Touch support for mobile
    gameArea.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = gameArea.getBoundingClientRect();
        const touch = e.touches[0];
        basketX = touch.clientX - rect.left;
        const maxX = gameArea.offsetWidth - 60;
        basketX = Math.max(30, Math.min(basketX, maxX));
        basket.style.left = basketX + 'px';
        basket.style.transform = 'translateX(0)';
    });
    
    function createFallingHeart() {
        if (!gameActive || heartsCaught >= 10) return;
        
        const heart = document.createElement('div');
        heart.className = 'falling-heart';
        heart.textContent = '💕';
        
        const startX = Math.random() * (gameArea.offsetWidth - 40) + 20;
        heart.style.left = startX + 'px';
        heart.style.top = '-40px';
        
        const fallDuration = Math.random() * 2 + 3; // 3-5 seconds
        heart.style.animationDuration = fallDuration + 's';
        
        gameArea.appendChild(heart);
        
        // Check for collision every 50ms
        const checkInterval = setInterval(() => {
            if (!gameActive || !heart.parentElement) {
                clearInterval(checkInterval);
                return;
            }
            
            const heartRect = heart.getBoundingClientRect();
            const basketRect = basket.getBoundingClientRect();
            
            // Check if heart is in basket range
            if (
                heartRect.bottom >= basketRect.top &&
                heartRect.top <= basketRect.bottom &&
                heartRect.left + heartRect.width / 2 >= basketRect.left &&
                heartRect.left + heartRect.width / 2 <= basketRect.right
            ) {
                // Heart caught!
                heartsCaught++;
                scoreDisplay.textContent = heartsCaught;
                
                // Create caught effect
                const effect = document.createElement('div');
                effect.className = 'heart-caught-effect';
                effect.textContent = '💖';
                effect.style.left = heartRect.left - gameArea.getBoundingClientRect().left + 'px';
                effect.style.top = heartRect.top - gameArea.getBoundingClientRect().top + 'px';
                gameArea.appendChild(effect);
                
                setTimeout(() => effect.remove(), 600);
                
                heart.remove();
                clearInterval(checkInterval);
                
                // Check if won
                // Check if won
                // Check if won
                if (heartsCaught >= 10) {
                    gameActive = false;
                    feedback.textContent = '✨ Perfect! You caught all the hearts!';
                    feedback.classList.add('success');
                    
                    setTimeout(() => {
                        // Close game modal
                        const gameModal = document.getElementById('heart-game-modal');
                        gameModal.classList.add('hidden');
                        
                        // Just unlock Memory 1, don't open it yet
                        state.unlockedMemories.add(1);
                        const point = document.querySelector('.memory-point[data-memory="1"]');
                        point.classList.remove('locked');
                        point.classList.add('unlocked');
                        updateCounter();
                        
                        // Save progress
                        localStorage.setItem('unlockedMemories', JSON.stringify([...state.unlockedMemories]));
                        
                    }, 1500);
                }
            }
        }, 50);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentElement) {
                heart.remove();
            }
            clearInterval(checkInterval);
        }, fallDuration * 1000);
    }
    
    // Create hearts periodically
    const heartInterval = setInterval(() => {
        if (gameActive && heartsCaught < 10) {
            createFallingHeart();
        } else if (heartsCaught >= 10) {
            clearInterval(heartInterval);
        }
    }, 800); // New heart every 0.8 seconds
    
    // Create initial hearts
    setTimeout(() => createFallingHeart(), 500);
    setTimeout(() => createFallingHeart(), 1000);
}

// Initialize everything
// Initialize everything
window.addEventListener('load', () => {
    initStarfield();
    setupMemoryPoints();
    setupModalControls();
    setupMusicControl();
    loadProgress();
    updateCounter();
    
    // Play background music on page load
    playBackgroundMusic();
});

// Background music for main page
function playBackgroundMusic() {
    const bgMusic = new Audio('valentines.mp3'); // Change this to your music file path
    bgMusic.loop = true;
    bgMusic.volume = 0.3; // 30% volume
    
    // Try to play (some browsers block autoplay)
    bgMusic.play().catch(error => {
        console.log('Autoplay blocked. Music will play after user interaction.');
        
        // Play on first user interaction
        const playOnInteraction = () => {
            bgMusic.play();
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('keydown', playOnInteraction);
        };
        
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('keydown', playOnInteraction);
    });
    
    // Connect to music toggle button
    const musicToggle = document.getElementById('music-toggle');
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.querySelector('.music-icon').textContent = '🔊';
        } else {
            bgMusic.pause();
            musicToggle.querySelector('.music-icon').textContent = '🔇';
        }
    });
}

// Optional: Reset progress for testing
// Uncomment this to add a reset button during development
/*
document.addEventListener('keydown', (e) => {
    // Press 'R' to reset (for testing)
    if (e.key === 'r' && e.ctrlKey) {
        localStorage.removeItem('unlockedMemories');
        location.reload();
    }
});
*/

function setupMemoryCardGame() {
    const gameContainer = document.getElementById('memory-card-game');
    const matchesDisplay = document.getElementById('matches-found');
    const feedback = document.querySelector('.feedback-message');
    
    // Card pairs - Patrick's iconic items
    const cardItems = [
        '🎴', // Business card
        '🪓', // Axe
        '💿', // CD (Huey Lewis)
        '🍸', // Martini
        '💼', // Briefcase
        '🎭'  // Mask (his fake persona)
    ];
    
    // Create pairs and shuffle
    let cards = [...cardItems, ...cardItems];
    cards = cards.sort(() => Math.random() - 0.5);
    
    let flippedCards = [];
    let matchedPairs = 0;
    let canFlip = true;
    
    // Create card elements
    cards.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.item = item;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="card-back">❓</div>
            <div class="card-front">${item}</div>
        `;
        
        card.addEventListener('click', () => flipCard(card));
        gameContainer.appendChild(card);
    });
    
    function flipCard(card) {
        // Prevent flipping if:
        // - Already flipped
        // - Already matched
        // - Two cards already flipped
        // - Cards are being checked
        if (!canFlip || 
            card.classList.contains('flipped') || 
            card.classList.contains('matched') ||
            flippedCards.length >= 2) {
            return;
        }
        
        // Flip the card
        card.classList.add('flipped');
        flippedCards.push(card);
        
        // If two cards are flipped, check for match
        if (flippedCards.length === 2) {
            canFlip = false;
            checkMatch();
        }
    }
    
    function checkMatch() {
        const [card1, card2] = flippedCards;
        const item1 = card1.dataset.item;
        const item2 = card2.dataset.item;
        
        if (item1 === item2) {
            // Match found!
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                
                matchedPairs++;
                matchesDisplay.textContent = matchedPairs;
                
                flippedCards = [];
                canFlip = true;
                
                // Check if all pairs matched
                if (matchedPairs === 6) {
                    feedback.textContent = '✨ "Impressive. Very nice. Let\'s see Paul Allen\'s memory..."';
                    feedback.classList.add('success');
                    
                    setTimeout(() => {
                        unlockMemory();
                    }, 2000);
                }
            }, 500);
        } else {
            // No match - flip back
            setTimeout(() => {
                card1.classList.add('wrong');
                card2.classList.add('wrong');
                
                setTimeout(() => {
                    card1.classList.remove('flipped', 'wrong');
                    card2.classList.remove('flipped', 'wrong');
                    flippedCards = [];
                    canFlip = true;
                }, 300);
            }, 800);
        }
    }
}