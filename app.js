// Breakpoint 2025 Videos App
let allVideos = [];
let currentCategory = 'all';

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
    // Note: videosData should be loaded from videos-data.js
    if (typeof videosData !== 'undefined') {
        allVideos = videosData;
        renderVideos(allVideos);
        updateVideoCount(allVideos.length);
    } else {
        console.error('videosData not loaded');
        document.getElementById('videoGrid').innerHTML = '<p style="text-align: center; color: #fff;">Loading videos...</p>';
    }

    // Setup search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    // Setup category buttons
    setupCategoryButtons();
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
    }
    renderVideos(filtered);
    updateVideoCount(filtered.length);
}}

function renderVideos(videos) {
    const grid = document.getElementById('videoGrid');

    if (videos.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #fff; padding: 2rem;">No videos found</p>';
        return;
    }

    grid.innerHTML = videos.map(video => `
        <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank" class="video-card">
            <div class="video-thumbnail">
                <img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt="${video.title}" loading="lazy">
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-category">${getCategoryName(video.category)}</p>
                ${video.companies ? `<p class="video-companies">${video.companies.join(', ')}</p>` : ''}
            </div>
        </a>
    `).join('');
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
        'education': 'Education'
    };

    return categoryNames[category] || category;
}
