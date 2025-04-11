document.addEventListener('DOMContentLoaded', function() {
    const feedSelect = document.getElementById('feed-select');
    const refreshBtn = document.getElementById('refresh-btn');
    const feedContainer = document.getElementById('feed-container');
    const loadingIndicator = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    
    // RSS feed URLs
    const feedUrls = {
        "Mozilla Hacks": "https://hacks.mozilla.org/feed/",
        "BBC World News": "http://feeds.bbci.co.uk/news/world/rss.xml",
        "TechCrunch": "https://techcrunch.com/feed/"
    };
    
    // Initialize the dashboard
    function initDashboard() {
        // Load the first feed by default
        if (feedSelect.value) {
            loadFeed(feedSelect.value);
        }
        
        // Set up event listeners
        feedSelect.addEventListener('change', function() {
            if (this.value) {
                loadFeed(this.value);
            } else {
                clearFeedContainer();
            }
        });
        
        refreshBtn.addEventListener('click', function() {
            if (feedSelect.value) {
                loadFeed(feedSelect.value);
            }
        });
    }
    
    // Load RSS feed
    function loadFeed(feedUrl) {
        showLoading();
        clearError();
        clearFeedContainer();
        
        // Use a CORS proxy to avoid CORS issues with RSS feeds
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
        
        fetch(proxyUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.contents) {
                    parseRSS(data.contents);
                } else {
                    throw new Error('Invalid feed data');
                }
            })
            .catch(error => {
                showError(`Failed to load feed: ${error.message}`);
            })
            .finally(() => {
                hideLoading();
            });
    }
    
    // Parse RSS XML
    function parseRSS(rssText) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(rssText, "text/xml");
            
            // Check for parsing errors
            const errorNode = xmlDoc.querySelector('parsererror');
            if (errorNode) {
                throw new Error('Error parsing RSS feed');
            }
            
            // Extract feed title
            const feedTitle = xmlDoc.querySelector('channel > title')?.textContent || 'Untitled Feed';
            
            // Extract items
            const items = xmlDoc.querySelectorAll('item');
            if (items.length === 0) {
                throw new Error('No articles found in feed');
            }
            
            // Display articles
            displayArticles(items, feedTitle);
        } catch (error) {
            showError(`Error parsing feed: ${error.message}`);
        }
    }
    
    // Display articles in the feed container
    function displayArticles(items, feedTitle) {
        feedContainer.innerHTML = `<h2>${feedTitle}</h2>`;
        
        items.forEach(item => {
            const title = item.querySelector('title')?.textContent || 'No title';
            const link = item.querySelector('link')?.textContent || '#';
            const description = item.querySelector('description')?.textContent || 'No description available';
            const pubDate = item.querySelector('pubDate')?.textContent || '';
            const enclosure = item.querySelector('enclosure');
            const imageUrl = enclosure ? enclosure.getAttribute('url') : null;
            
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card';
            
            articleCard.innerHTML = `
                ${imageUrl ? `<img src="${imageUrl}" alt="${title}" class="article-image">` : ''}
                <div class="article-content">
                    <h3 class="article-title"><a href="${link}" target="_blank" rel="noopener">${title}</a></h3>
                    <div class="article-meta">
                        ${pubDate ? `<span><i class="far fa-calendar-alt"></i> ${formatDate(pubDate)}</span>` : ''}
                    </div>
                    <div class="article-description">${cleanDescription(description)}</div>
                </div>
            `;
            
            feedContainer.appendChild(articleCard);
        });
    }
    
    // Helper function to clean up description HTML
    function cleanDescription(description) {
        // Remove any HTML tags for safety
        const div = document.createElement('div');
        div.innerHTML = description;
        return div.textContent || div.innerText || '';
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    // UI Helper functions
    function showLoading() {
        loadingIndicator.style.display = 'flex';
    }
    
    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    function clearError() {
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
    }
    
    function clearFeedContainer() {
        feedContainer.innerHTML = '';
    }
    
    // Initialize the dashboard
    initDashboard();
});