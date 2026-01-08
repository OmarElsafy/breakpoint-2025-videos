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
        filtered = filtered.filter(video => 
            video.title.toLowerCase().includes(searchTerm)
        );
    }
    
    renderVideos(filtered);
    updateVideoCount(filtered.length);
}

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
                <span class="video-category">${getCategoryName(video.category)}</span>
            </div>
        </a>
    `).join('');
}

function updateVideoCount(count) {
    const countEl = document.getElementById('videoCount');
    countEl.textContent = `Showing ${count} video${count !== 1 ? 's' : ''}`;
}

function getCategoryName(category) {
    const categoryNames = {
        'all': 'All Videos',
        'defi': 'DeFi',
        'credit': 'Credit',
        'payments': 'Payments',
        'infrastructure': 'Infrastructure',
        'ai': 'AI',
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
