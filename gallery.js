// Gallery System Module
class GallerySystem {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.loadImages();
        this.setupGallery();
        this.setupLightbox();
        this.setupFilters();
    }

    loadImages() {
        // This would typically load from an API or data file
        // For now, we'll use sample data
        this.images = [
            {
                src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                category: 'lobby',
                title: 'Grand Lobby',
                description: 'Our Living Gallery lobby with curated local art'
            },
            {
                src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                category: 'suites',
                title: 'Executive Suite',
                description: 'Sleep Sanctuary with Frette linens'
            },
            {
                src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2058&q=80',
                category: 'suites',
                title: 'Diplomatic Suite',
                description: 'Expansive luxury with executive lounge access'
            },
            {
                src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                category: 'dining',
                title: 'Spice & Sea Restaurant',
                description: 'Fine dining with Niger Delta cuisine'
            },
            {
                src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                category: 'wellness',
                title: 'The Spill Wellness',
                description: 'Spa treatments with indigenous ingredients'
            },
            {
                src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                category: 'wellness',
                title: 'Treatment Room',
                description: 'Holistic healing environment'
            }
        ];
    }

    setupGallery() {
        const galleryContainer = document.querySelector('.gallery-container');
        if (!galleryContainer) return;

        // Create gallery grid
        galleryContainer.innerHTML = this.createGalleryGrid();
        
        // Add click handlers
        this.addGalleryHandlers();
    }

    createGalleryGrid() {
        return `
            <div class="gallery-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="suites">Suites</button>
                <button class="filter-btn" data-filter="dining">Dining</button>
                <button class="filter-btn" data-filter="wellness">Wellness</button>
                <button class="filter-btn" data-filter="lobby">Lobby</button>
            </div>
            
            <div class="gallery-grid">
                ${this.images.map((img, index) => `
                    <div class="gallery-item" data-category="${img.category}" data-index="${index}">
                        <div class="gallery-image">
                            <img src="${img.src}" alt="${img.title}" loading="lazy">
                            <div class="gallery-overlay">
                                <h3>${img.title}</h3>
                                <p>${img.description}</p>
                                <div class="gallery-zoom">
                                    <i class="fas fa-search-plus"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    addGalleryHandlers() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.openLightbox(index);
            });
        });
    }

    setupLightbox() {
        // Create lightbox element
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'lightbox';
        this.lightbox.innerHTML = this.createLightboxHTML();
        document.body.appendChild(this.lightbox);
        
        // Add lightbox event listeners
        this.addLightboxHandlers();
    }

    createLightboxHTML() {
        return `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <button class="lightbox-close">
                    <i class="fas fa-times"></i>
                </button>
                
                <button class="lightbox-nav prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                
                <div class="lightbox-main">
                    <img src="" alt="" class="lightbox-image">
                    <div class="lightbox-info">
                        <h3 class="lightbox-title"></h3>
                        <p class="lightbox-description"></p>
                        <div class="lightbox-counter">
                            <span class="current">1</span> / <span class="total">${this.images.length}</span>
                        </div>
                    </div>
                </div>
                
                <button class="lightbox-nav next">
                    <i class="fas fa-chevron-right"></i>
                </button>
                
                <div class="lightbox-thumbnails">
                    ${this.images.map((img, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <img src="${img.src}" alt="${img.title}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    addLightboxHandlers() {
        // Close button
        this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
            this.closeLightbox();
        });

        // Navigation buttons
        this.lightbox.querySelector('.lightbox-nav.prev').addEventListener('click', () => {
            this.previousImage();
        });

        this.lightbox.querySelector('.lightbox-nav.next').addEventListener('click', () => {
            this.nextImage();
        });

        // Thumbnail clicks
        this.lightbox.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.dataset.index);
                this.showImage(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.classList.contains('active')) {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.previousImage();
                if (e.key === 'ArrowRight') this.nextImage();
            }
        });

        // Close on overlay click
        this.lightbox.querySelector('.lightbox-overlay').addEventListener('click', () => {
            this.closeLightbox();
        });
    }

    openLightbox(index) {
        this.currentIndex = index;
        this.showImage(index);
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 300);
    }

    showImage(index) {
        if (index < 0) index = this.images.length - 1;
        if (index >= this.images.length) index = 0;
        
        this.currentIndex = index;
        const image = this.images[index];
        
        // Update main image
        const lightboxImage = this.lightbox.querySelector('.lightbox-image');
        const lightboxTitle = this.lightbox.querySelector('.lightbox-title');
        const lightboxDesc = this.lightbox.querySelector('.lightbox-description');
        const currentCounter = this.lightbox.querySelector('.current');
        
        // Fade effect
        lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImage.src = image.src;
            lightboxImage.alt = image.title;
            lightboxTitle.textContent = image.title;
            lightboxDesc.textContent = image.description;
            currentCounter.textContent = index + 1;
            
            lightboxImage.style.opacity = '1';
        }, 200);
        
        // Update active thumbnail
        this.lightbox.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    previousImage() {
        this.showImage(this.currentIndex - 1);
    }

    nextImage() {
        this.showImage(this.currentIndex + 1);
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter gallery
                const filter = btn.dataset.filter;
                this.filterGallery(filter);
            });
        });
    }

    filterGallery(filter) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const category = item.dataset.category;
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Initialize gallery
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.gallery-container')) {
        new GallerySystem();
    }
});