// Breakpoint 2025 Videos App
let allVideos = [];
let currentCategory = 'all';

// Initialise app
window.addEventListener('DOMContentLoaded', () => {
    // Note: videosData should be loaded from videos-data.js
    if (typeof videosData !== 'undefined') {
        allVideos = videosData;
        renderVideos(allVideos);
        updateVideoCount(allVideos.length);
    } else {
        console.error('videosData not loaded');
        document.getElementById('videoGrid').innerHTML =
            '<p style="text-align: center; color: #fff;">Loading videos...</p>';
    }

    // Setup search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    // Setup category buttons
    setupCategoryButtons();

    // Setup modal close handlers
    const modal = document.getElementById('videoModal');
    const closeBtn = document.querySelector('.video-modal-close');

    closeBtn.addEventListener('click', closeVideoModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVideoModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeVideoModal();
        }
    });
});

function setupCategoryButtons() {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.getAttribute('data-category');
            currentCategory = category;
            filterVideos(category);
        });
    });
}

function filterVideos(category) {
    const filtered = category === 'all'
        ? allVideos
        : allVideos.filter(video => video.category === category);

    renderVideos(filtered);
    updateVideoCount(filtered.length);
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();

    let filtered = currentCategory === 'all'
        ? allVideos
        : allVideos.filter(video => video.category === currentCategory);

    if (searchTerm) {
        filtered = filtered.filter(video => {
            const titleMatch = video.title.toLowerCase().includes(searchTerm);
            const companiesMatch = video.companies?.some(company =>
                company.toLowerCase().includes(searchTerm)
            );
            const speakersMatch = video.speakers?.some(speaker =>
                speaker.toLowerCase().includes(searchTerm)
            );

            return titleMatch || companiesMatch || speakersMatch;
        });
    }

    renderVideos(filtered);
    updateVideoCount(filtered.length);
}

function renderVideos(videos) {
    const grid = document.getElementById('videoGrid');

    if (videos.length === 0) {
        grid.innerHTML =
            '<p style="grid-column: 1/-1; text-align: center; color: #fff; padding: 2rem;">No videos found</p>';
        return;
    }

    grid.innerHTML = videos.map(video => `
        <div class="video-card" data-video-id="${video.id}">
            <div class="video-thumbnail">
                <img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt="${video.title}" loading="lazy">
                <div class="play-button">▶</div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-category">${getCategoryName(video.category)}</p>
                ${video.companies ? `<p class="video-companies">${video.companies.join(', ')}</p>` : ''}
            </div>
        </div>
    `).join('');

    // CRITICAL: Add click handlers AFTER innerHTML is set
    // Use a small delay to ensure DOM has updated
    setTimeout(() => {
        const cards = document.querySelectorAll('.video-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const videoId = card.getAttribute('data-video-id');
                openVideoModal(videoId);
            });
        });
    }, 0);
}

function openVideoModal(videoId) {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');
    const floating = document.getElementById('floatingPlayer');

    player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (floating) floating.classList.remove('floating'); // start full-size in modal
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');
    const floating = document.getElementById('floatingPlayer');

    modal.style.display = 'none';
    player.src = '';
    document.body.style.overflow = 'auto';
    if (floating) floating.classList.remove('floating');
}

function updateVideoCount(count) {
    document.getElementById('videoCount').textContent = count;
}

function getCategoryName(category) {
    const categoryNames = {
        'ai': 'AI',
        'defi': 'DeFi',
        'institutional': 'Institutional',
        'gaming': 'Gaming',
        'nfts': 'NFTs',
        'developer': 'Developer Tools',
        'security': 'Security',
        'community': 'Community',
        'ecosystem': 'Ecosystem',
        'mobile': 'Mobile',
        'dao': 'DAO',
        'consumer': 'Consumer',
        'solana-mobile': 'Solana Mobile',
        'analytics': 'Analytics',
        'stablecoins': 'Stablecoins',
        'privacy': 'Privacy',
        'compliance': 'Compliance',
        'memes': 'Memes',
        'education': 'Education',

        // new / normalised categories from videos-data.js
        'cex': 'CEX',
        'data': 'Data',
        'credit': 'Credit',
        'rwa': 'RWA',
        'depin': 'DePin',
        'prediction-markets': 'Prediction Markets',
        'vc': 'VC',
        'wallets': 'Wallets',
        'fundraising': 'Fundraising'
    };

    return categoryNames[category] || category;
}

// Floating mini‑player on scroll
window.addEventListener('scroll', () => {
    const modal = document.getElementById('videoModal');
    const floating = document.getElementById('floatingPlayer');

    // only float when modal is open and elements exist
    if (modal && floating && modal.style.display === 'flex') {
        if (window.scrollY > 200) {
            floating.classList.add('floating');
        } else {
            floating.classList.remove('floating');
        }
    }
});

