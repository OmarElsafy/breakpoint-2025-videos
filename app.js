// Import video data
const videos = videosData;

// Get all unique categories
const categories = ['all', ...new Set(videos.map(v => v.category))];

// Current filter state
let currentFilter = 'all';
let currentSearch = '';

// Initialize the app
function init() {
    renderCategoryButtons();
    renderVideos();
    setupSearch();
    setupIntersectionObserver();
}

// Render category filter buttons
function renderCategoryButtons() {
    const categoryNav = document.getElementById('categoryNav');
        categoryNav.innerHTML = '';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = `
            px-5 py-2.5 rounded-full font-medium text-sm
            transition-all duration-300 ease-out
            ${category === currentFilter 
                ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/30' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}
        `;
        button.textContent = category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ');
        button.onclick = () => filterByCategory(category);
        categoryNav.appendChild(button);
    });
}

// Filter videos by category
function filterByCategory(category) {
    currentFilter = category;
    renderCategoryButtons();
    renderVideos();
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        renderVideos();
    });
}

// Render videos in bento grid
function renderVideos() {
    const videoGrid = document.getElementById('videoGrid');
    const filteredVideos = videos.filter(video => {
        const matchesCategory = currentFilter === 'all' || video.category === currentFilter;
        const matchesSearch = !currentSearch || 
            video.title.toLowerCase().includes(currentSearch) ||
            (video.companies && video.companies.some(c => c.toLowerCase().includes(currentSearch))) ||
            (video.speakers && video.speakers.some(s => s.toLowerCase().includes(currentSearch)));
        return matchesCategory && matchesSearch;
    });

    // Update count
    document.getElementById('videoCount').textContent = 
        `Showing ${filteredVideos.length} video${filteredVideos.length !== 1 ? 's' : ''}`;

    // Clear grid
    videoGrid.innerHTML = '';

    // Render videos
    filteredVideos.forEach((video, index) => {
        const card = createVideoCard(video, index);
        videoGrid.appendChild(card);
    });
}

// Create video card
function createVideoCard(video, index) {
    const card = document.createElement('div');
    const isFeatured = index === 0 && currentFilter === 'all' && !currentSearch;
    
    card.className = `
        group relative overflow-hidden rounded-3xl bg-gray-50
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-900/10
        cursor-pointer reveal
        ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''}
    `;
    
    // Thumbnail
    const thumbnail = `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
    
    card.innerHTML = `
        <div class="aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
            <img 
                src="${thumbnail}" 
                alt="${video.title}"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <!-- Play button overlay -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                    <svg class="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                </div>
            </div>
        </div>
        
        <div class="p-6">
            <!-- Category badge -->
            <span class="inline-block px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-full mb-3">
                ${video.category.replace(/_/g, ' ')}
            </span>
            
            <!-- Title -->
            <h3 class="text-gray-900 font-semibold tracking-tight text-lg mb-3 line-clamp-2">
                ${video.title}
            </h3>
            
            <!-- Companies -->
            ${video.companies && video.companies.length > 0 ? `
                <div class="mb-2">
                    <p class="text-xs font-medium text-gray-500 mb-1">Companies:</p>
                    <div class="flex flex-wrap gap-1">
                        ${video.companies.map(company => 
                            `<span class="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md">${company}</span>`
                        ).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- Speakers -->
            ${video.speakers && video.speakers.length > 0 ? `
                <div>
                    <p class="text-xs font-medium text-gray-500 mb-1">Speakers:</p>
                    <div class="flex flex-wrap gap-1">
                        ${video.speakers.map(speaker => 
                            `<span class="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-md">${speaker}</span>`
                        ).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    // Click handler to open video
    card.onclick = () => {
        window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
    };
    
    return card;
}

// Setup Intersection Observer for scroll animations
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Observe all cards
    const observeCards = () => {
        document.querySelectorAll('.reveal:not(.visible)').forEach(card => {
            observer.observe(card);
        });
    };

    // Initial observation
    setTimeout(observeCards, 100);

    // Re-observe when content changes
    const gridObserver = new MutationObserver(observeCards);
    gridObserver.observe(document.getElementById('videoGrid'), {
        childList: true
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);