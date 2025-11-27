let signUpForm = document.querySelector('#signUpForm');
let logInForm = document.querySelector('#logInForm');
let signUpBtn = document.querySelector('#signUpBtn');
let logInBtn = document.querySelector('#logInBtn');
let resetPassbtn = document.querySelector('#resetPassBtn');
let resetEmailVal = document.querySelector('#resetEmailVal');
let resetEmailID = document.querySelector('#resetEmailId');
let changePass = document.querySelector('#changePass');
let confirmChangePass = document.querySelector('#confirmChangePass');
let confirmPassForm = document.querySelector('#confirmPassForm');
let backToLoginBtns = document.querySelectorAll('.backToLoginBtn');
let createAccountEmailVal = document.querySelector('#createAccountEmailVal');
let createAccountFullNameVal = document.querySelector('#createAccountFullNameVal');
let createAccountPasswordVal = document.querySelector('#createAccountPasswordVal');
let loginEmailVal = document.querySelector('#loginEmailVal');
let loginPasswordVal = document.querySelector('#loginPasswordVal');
let hamburgerBtn = document.querySelector('.bar');
let sideBar = document.querySelector('.left');
let parentSideBar = document.querySelector('.hero');
let profileBtn = document.querySelector('.profileBtn');
let profileDropdown = document.querySelector('.profileDrop');
let homeBtn;
let archiveBtn;

// Store bookmarks data
let bookmarksData = [];

// Store current sort type
let currentSort = 'recentVisit';

// hideCard function
function hideCard(card) {
    let cardElement = document.querySelector(card);
    cardElement.classList.add('hidden');
    cardElement.classList.remove('flex');
}

// showCard function
function showCard(card) {
    let cardElement = document.querySelector(card);
    cardElement.classList.remove('hidden');
    cardElement.classList.add('flex');
}

// Function to format date to display format
function formatDate(dateString) {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
}

// Function to format visit count
function formatVisitCount(count) {
    if (count === 0) return 'Never visited';
    if (count === 1) return '1 visit';
    return `${count} visits`;
}

// Function to update visit count and last visited
function updateVisitStats(bookmarkId) {
    const bookmark = bookmarksData.find(b => b.id === bookmarkId);
    if (bookmark) {
        bookmark.visitCount += 1;
        bookmark.lastVisited = new Date().toISOString();

        refreshCurrentView();
        
    }
}

// Function to toggle pin status
function togglePinStatus(bookmarkId) {
    const bookmark = bookmarksData.find(b => b.id === bookmarkId);
    if (bookmark) {
        bookmark.pinned = !bookmark.pinned;
        return true;
    }
    return false;
}

// Function to toggle archive status
function toggleArchiveStatus(bookmarkId) {
    const bookmark = bookmarksData.find(b => b.id === bookmarkId);
    if (bookmark) {
        bookmark.isArchived = !bookmark.isArchived;
        
        // If archiving, unpin the bookmark
        if (bookmark.isArchived) {
            bookmark.pinned = false;
        }
        
        return true;
    }
    return false;
}

// Function to delete a bookmark
function deleteBookmark(bookmarkId) {
    // Find the index of the bookmark to delete
    const bookmarkIndex = bookmarksData.findIndex(b => b.id === bookmarkId);
    
    if (bookmarkIndex !== -1) {
        // Remove the bookmark from the array
        bookmarksData.splice(bookmarkIndex, 1);
        
        // Show success notification
        showNotification('Bookmark deleted successfully');
        
        // Refresh the current view
        refreshCurrentView();
        
        return true;
    }
    
    return false;
}

// Function to sort bookmarks based on current sort type
function sortBookmarks(bookmarks, sortType) {
    const sortedBookmarks = [...bookmarks]; 
    
    switch(sortType) {
        case 'recentAdd':
            // Sort by creation date (newest first) with pinned first
            return sortedBookmarks.sort((a, b) => {
                // Pinned bookmarks always come first
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                
                // Sort by creation date (newest first) for non-pinned
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB - dateA;
            });
            
        case 'recentVisit':
            // Sort by last visited (most recent first) with pinned first
            return sortedBookmarks.sort((a, b) => {
                // Pinned bookmarks always come first
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                
                // Handle last visited dates for non-pinned
                // Never visited bookmarks go to the end
                if (!a.lastVisited && b.lastVisited) return 1;
                if (a.lastVisited && !b.lastVisited) return -1;
                if (!a.lastVisited && !b.lastVisited) return 0;
                
                const dateA = new Date(a.lastVisited);
                const dateB = new Date(b.lastVisited);
                return dateB - dateA;
            });
            
        case 'mostVisit':
            // Sort by visit count (highest first) with pinned first
            return sortedBookmarks.sort((a, b) => {
                // Pinned bookmarks always come first
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                
                // Sort by visit count (descending) for non-pinned
                return b.visitCount - a.visitCount;
            });
            
        default:
            return sortedBookmarks;
    }
}

// Close sortBy dropdown when clicking outside
document.addEventListener('click', (e) => {
    const sortByDiv = document.querySelector('.sortBy');
    const sortButton = document.querySelector('.sorting');
    
    // Check if click is outside both the sort button and sort dropdown
    if (sortByDiv && !sortByDiv.classList.contains('hidden') && 
        !sortByDiv.contains(e.target) && 
        !sortButton.contains(e.target)) {
        sortByDiv.classList.add('hidden');
    }
});

// Function to create bookmark card HTML
function createBookmarkCard(bookmark) {
    const domain = new URL(bookmark.url).hostname;
    
    return `
        <div class="bg-white w-[340px] max-w-md rounded px-6 py-4 mb-4">
            <div class="flex flex-col">
                <div class="flex justify-between items-start">
                    <div class="flex gap-3 items-start">
                        <img src="${bookmark.favicon}" alt="${bookmark.title} favicon" class="w-6 h-6 mt-1">
                        <div>
                            <h1 class="text-xl font-semibold">${bookmark.title}</h1>
                            <p class="text-slate-600 text-sm">${domain}</p>
                        </div>
                    </div>
                    <div class="relative">
                        <button class="border border-slate-300 p-2 rounded hover:bg-slate-400 cursor-pointer bookmark-menu-btn" data-id="${bookmark.id}">
                            <img src="./assets/images/icon-menu-bookmark.svg" alt="Menu">
                        </button>
                        <div class="border border-slate-300 flex-col gap-2 px-4 py-2 rounded absolute right-0 w-[150px] bg-white hidden shadow-lg bookmark-dropdown" data-id="${bookmark.id}">
                            <a href="${bookmark.url}" target="_blank" class="flex gap-2 hover:bg-slate-400 px-2 py-1 rounded visit-link" data-id="${bookmark.id}">
                                <img src="./assets/images/icon-visit.svg" alt="">
                                <p>Visit</p>
                            </a>
                            <button class="flex gap-2 hover:bg-slate-400 px-2 py-1 rounded w-full text-left copy-url-btn" data-url="${bookmark.url}">
                                <img src="./assets/images/icon-copy.svg" alt="">
                                <p>Copy URL</p>
                            </button>
                            <button class="flex gap-2 hover:bg-slate-400 px-2 py-1 rounded w-full text-left toggle-pin-btn" data-id="${bookmark.id}">
                                <img src="./assets/images/icon-pin.svg" alt="">
                                <p>${bookmark.pinned ? 'Unpin' : 'Pin'}</p>
                            </button>
                            <button class="flex gap-2 hover:bg-slate-400 px-2 py-1 rounded w-full text-left edit-btn" data-id="${bookmark.id}">
                                <img src="./assets/images/icon-edit.svg" alt="">
                                <p>Edit</p>
                            </button>
                            <button class="flex gap-2 hover:bg-slate-400 px-2 py-1 rounded w-full text-left archive-btn" data-id="${bookmark.id}">
                                <img src="./assets/images/icon-archive.svg" alt="">
                                <p>${bookmark.isArchived ? 'Unarchive' : 'Archive'}</p>
                            </button>
                            <button class="flex gap-2 hover:bg-slate-400 px-2 py-1 rounded w-full text-left delete-btn" data-id="${bookmark.id}">
                                <img src="./assets/images/icon-delete.svg" alt="">
                                <p>Delete</p>
                            </button>
                        </div>
                    </div>
                </div>
                <hr class="my-4 border border-slate-300">
                <div class="mb-3">
                    <p class="text-slate-700 min-h-28">${bookmark.description}</p>
                </div>
                <div class="tags flex my-2 gap-2 flex-wrap">
                    ${bookmark.tags.map(tag => 
                        `<span class="bg-slate-200 px-2 py-1 text-sm rounded-full">${tag}</span>`
                    ).join('')}
                </div>
                <hr class="my-4 border border-slate-300">
                <div class="externals gap-4 flex flex-wrap">
                    <div class="flex items-center gap-1">
                        <img src="./assets/images/icon-visit-count.svg" alt="Visit count">
                        <p class="text-sm text-slate-600">${formatVisitCount(bookmark.visitCount)}</p>
                    </div>
                    <div class="flex items-center gap-1">
                        <img src="./assets/images/icon-last-visited.svg" alt="Last visited">
                        <p class="text-sm text-slate-600">${formatDate(bookmark.lastVisited)}</p>
                    </div>
                    <div class="flex items-center gap-1">
                        <img src="./assets/images/icon-created.svg" alt="Created">
                        <p class="text-sm text-slate-600">${formatDate(bookmark.createdAt)}</p>
                    </div>
                    <div class="flex ${bookmark.pinned ? '' : 'hidden'} items-center gap-1">
                        <img src="./assets/images/icon-pin.svg" alt="">
                    </div>
                    
                </div>
            </div>
        </div>
    `;
}

// Function to refresh the current view
function refreshCurrentView() {
    const isViewingArchived = document.querySelector('.bookmark-title').textContent === 'Archived Bookmarks';
    
    const selectedTags = getSelectedTags();

    if(selectedTags.length > 0) {
        filterBookmarksByTags();
    } else {
        loadBookmarks(isViewingArchived);
    }

    //for the theme 
    const currentDarkMode = localStorage.getItem('darkMode') === 'true';
    if (currentDarkMode) {
        updateCardColors('#002E2D', 'white');
    }
}

// Function to show notification
function showNotification(message) {

    let notification = document.createElement('div');
    notification.className = 'notification fixed top-4 right-4 bg-[#014745] text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300';
    document.body.appendChild(notification);
    
    // Set message and show
    notification.textContent = message;
    notification.classList.remove('hidden');
    notification.classList.remove('opacity-0');
    notification.classList.add('opacity-100');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('opacity-100');
        notification.classList.add('opacity-0');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }, 3000);
}

// Function to update tag counts dynamically
function updateTagCounts() {
    const tagCounts = {};
    
    // Count occurrences of each tag in active bookmarks
    bookmarksData.forEach(bookmark => {
        if (!bookmark.isArchived) {
            bookmark.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        }
    });
    
    
    const tagElements = document.querySelectorAll('.inputData');
    tagElements.forEach(element => {
        const label = element.querySelector('label');
        if (label) {
            const tagName = label.textContent.trim();
            
            const parentDiv = element.closest('.flex');
            const countElement = parentDiv.querySelector('.inputCount');
            
            if (countElement) {
                const count = tagCounts[tagName] || 0;
                countElement.textContent = count;
            }
        }
    });
}

// Function to add event listeners for bookmark interactions
function addBookmarkEventListeners() {
    // Toggle dropdown menus
    document.querySelectorAll('.bookmark-menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const bookmarkId = e.currentTarget.getAttribute('data-id');
            const dropdown = document.querySelector(`.bookmark-dropdown[data-id="${bookmarkId}"]`);
            
            // Close all other dropdowns
            document.querySelectorAll('.bookmark-dropdown').forEach(drop => {
                if (drop !== dropdown) {
                    drop.classList.add('hidden');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('hidden');
        });
    });
    
    // Visit link functionality
    document.querySelectorAll('.visit-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const bookmarkId = e.currentTarget.getAttribute('data-id');
            updateVisitStats(bookmarkId);
        });
    });
    
    // Archive/Unarchive functionality
    document.querySelectorAll('.archive-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bookmarkId = e.currentTarget.getAttribute('data-id');
            const wasArchived = toggleArchiveStatus(bookmarkId);
            
            if (wasArchived) {
                const bookmark = bookmarksData.find(b => b.id === bookmarkId);
                if (bookmark) {
                    const action = bookmark.isArchived ? 'archived' : 'unarchived';
                    showNotification(`Bookmark ${action} successfully`);
                    
                    refreshCurrentView();
                }
            }
            
            // Close the dropdown
            const dropdown = document.querySelector(`.bookmark-dropdown[data-id="${bookmarkId}"]`);
            dropdown.classList.add('hidden');
        });
    });

    // Toggle pin functionality
    document.querySelectorAll('.toggle-pin-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bookmarkId = e.currentTarget.getAttribute('data-id');
            const wasPinned = togglePinStatus(bookmarkId);
            
            if (wasPinned) {
                const bookmark = bookmarksData.find(b => b.id === bookmarkId);
                if (bookmark) {
                    const action = bookmark.pinned ? 'pinned' : 'unpinned';
                    showNotification(`Bookmark ${action} successfully`);
                    
                    refreshCurrentView();
                }
            }
            
            // Close the dropdown
            const dropdown = document.querySelector(`.bookmark-dropdown[data-id="${bookmarkId}"]`);
            dropdown.classList.add('hidden');
        });
    });

    // Copy URL functionality
    document.querySelectorAll('.copy-url-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const url = e.currentTarget.getAttribute('data-url');
            navigator.clipboard.writeText(url).then(() => {
                showNotification('URL copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy URL: ', err);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('URL copied to clipboard');
            });
        });
    });
    
    // EDIT BUTTON FUNCTIONALITY 
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bookmarkId = e.currentTarget.getAttribute('data-id');
            
            const bookmark = bookmarksData.find(b => b.id === bookmarkId);
            
            if (bookmark) {
                openEditBookmarkModal(bookmark);
            }
            
            // Close the dropdown
            const dropdown = document.querySelector(`.bookmark-dropdown[data-id="${bookmarkId}"]`);
            if (dropdown) {
                dropdown.classList.add('hidden');
            }
        });
    });
    
    // DELETE BUTTON FUNCTIONALITY
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bookmarkId = e.currentTarget.getAttribute('data-id');
            const bookmark = bookmarksData.find(b => b.id === bookmarkId);
            
            if (bookmark) {
                // Confirm deletion with user
                if (confirm(`Are you sure you want to delete "${bookmark.title}"? This action cannot be undone.`)) {
                    deleteBookmark(bookmarkId);
                }
            }
            
            // Close the dropdown
            const dropdown = document.querySelector(`.bookmark-dropdown[data-id="${bookmarkId}"]`);
            dropdown.classList.add('hidden');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.bookmark-menu-btn') && !e.target.closest('.bookmark-dropdown')) {
            document.querySelectorAll('.bookmark-dropdown').forEach(dropdown => {
                dropdown.classList.add('hidden');
            });
        }
    });
}

// Function to load bookmarks from JSON and display them
async function loadBookmarks(showArchived = false) {
    try {
        // Only fetch data if we don't have it already
        if (bookmarksData.length === 0) {
            const response = await fetch('./data.json');
            const data = await response.json();
            bookmarksData = data.bookmarks;
        }
        
        const cardsContainer = document.querySelector('.cards');
        
        // Clear existing content
        cardsContainer.innerHTML = '';
        
        // Filter bookmarks based on archive status
        const filteredBookmarks = bookmarksData.filter(bookmark => 
            showArchived ? bookmark.isArchived : !bookmark.isArchived
        );
        
        // Apply current sorting
        const sortedBookmarks = sortBookmarks(filteredBookmarks, currentSort);
        
        // Show message if no bookmarks found
        if (sortedBookmarks.length === 0) {
            const message = showArchived 
                ? '<p class="text-slate-500 text-center py-8">No archived bookmarks found.</p>'
                : '<p class="text-slate-500 text-center py-8">No bookmarks found.</p>';
            cardsContainer.innerHTML = message;
            return;
        }
        
        // Create and append bookmark cards
        sortedBookmarks.forEach(bookmark => {
            const cardHTML = createBookmarkCard(bookmark);
            cardsContainer.innerHTML += cardHTML;
        });
        
        // Add event listeners for dropdown menus
        addBookmarkEventListeners();

        // update tag counts
        updateTagCounts();

        // for the theme 
        const currentDarkMode = localStorage.getItem('darkMode') === 'true';
        if (currentDarkMode) {
            updateCardColors('#002E2D', 'white');
        } else {
            updateCardColors('white', 'black');
        }
        
    } catch (error) {
        console.error('Error loading bookmarks:', error);
        document.querySelector('.cards').innerHTML = '<p class="text-red-500">Error loading bookmarks. Please try again later.</p>';
    }
}

// Initialize bookmark modal functionality
function initializeBookmarkModal() {
    const modal = document.querySelector('.editBookmark');
    
    const form = modal.querySelector('form');
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    
    if (form) {
        // Form submission
        form.addEventListener('submit', handleBookmarkFormSubmit);
    }
    
    if (closeBtn) {
        // Close modal events
        closeBtn.addEventListener('click', closeBookmarkModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeBookmarkModal);
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBookmarkModal();
        }
    });
}

// Initialize character counter for description textarea
function initializeCharacterCounter() {
    const textarea = document.querySelector('.editBookmark textarea');
    const charCount = document.querySelector('.editBookmark p.w-full.text-end');
    
    if (textarea && charCount) {
        textarea.addEventListener('input', (e) => {
            const length = e.target.value.length;
            charCount.textContent = `${length}/280`;
        });
    }
}

function updateSidebarActiveState(activeButton) {
    // Remove active styles from both buttons
    if (homeBtn) homeBtn.classList.remove('bg-slate-400', 'font-semibold');
    if (archiveBtn) archiveBtn.classList.remove('bg-slate-400', 'font-semibold');
    
    // Add active styles to the clicked button
    if (activeButton === 'home' && homeBtn) {
        homeBtn.classList.add('bg-slate-400', 'font-semibold');
    } else if (activeButton === 'archive' && archiveBtn) {
        archiveBtn.classList.add('bg-slate-400', 'font-semibold');
    }
}

// Initialize sort buttons functionality
function initializeSortButtons() {
    const sortDiv = document.querySelector('.sortBy');
    const recentAddBtn = sortDiv.querySelector('.recentAdd');
    const recentVisitBtn = sortDiv.querySelector('.recentVisit');
    const mostVisitBtn = sortDiv.querySelector('.mostVisit');
    
    // Remove checkmarks from all buttons
    function clearCheckmarks() {
        recentAddBtn.querySelector('img').classList.add('hidden');
        recentVisitBtn.querySelector('img').classList.add('hidden');
        mostVisitBtn.querySelector('img').classList.add('hidden');
    }
    
    // Add checkmark to active button
    function setActiveSortButton(activeButton) {
        clearCheckmarks();
        activeButton.querySelector('img').classList.remove('hidden');
    }
    
    // Set initial active button based on current sort
    switch(currentSort) {
        case 'recentAdd':
            setActiveSortButton(recentAddBtn);
            break;
        case 'recentVisit':
            setActiveSortButton(recentVisitBtn);
            break;
        case 'mostVisit':
            setActiveSortButton(mostVisitBtn);
            break;
    }
    
    // Recent Add button
    recentAddBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentSort = 'recentAdd';
        setActiveSortButton(recentAddBtn);
        sortDiv.classList.add('hidden');
        refreshCurrentView();
    });
    
    // Recent Visit button
    recentVisitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentSort = 'recentVisit';
        setActiveSortButton(recentVisitBtn);
        sortDiv.classList.add('hidden');
        refreshCurrentView();
    });
    
    // Most Visit button
    mostVisitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentSort = 'mostVisit';
        setActiveSortButton(mostVisitBtn);
        sortDiv.classList.add('hidden');
        refreshCurrentView();
    });
}

// Initialize the app - show login form by default
document.addEventListener('DOMContentLoaded', function() {
    showCard('.logInForm');
    hideCard('.hero');
    
    // Initialize button references after DOM is loaded
    homeBtn = document.querySelector('#homeBtn');
    archiveBtn = document.querySelector('#archiveBtn');
    
    // Initialize bookmark modal functionality
    initializeBookmarkModal();
    initializeCharacterCounter();
    
    // Add event listeners for navigation buttons
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            
            document.querySelectorAll('.inputData input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });

            document.querySelector('.bookmark-title').textContent = 'All Bookmarks';
            
            // Load unarchived bookmarks
            loadBookmarks(false);
            
            // Update active state in sidebar
            updateSidebarActiveState('home');
        });
    }
    
    if (archiveBtn) {
        archiveBtn.addEventListener('click', () => {

            document.querySelectorAll('.inputData input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });

            // Update the page title to show we're viewing archived bookmarks
            document.querySelector('.bookmark-title').textContent = 'Archived Bookmarks';
            
            // Load archived bookmarks
            loadBookmarks(true);
            
            // Update active state in sidebar
            updateSidebarActiveState('archive');
        });
    }
    
    // Initialize sort buttons
    initializeSortButtons();
});

// Add search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.searchBar');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            const cardsContainer = document.querySelector('.cards');
            const isViewingArchived = document.querySelector('.bookmark-title').textContent === 'Archived Bookmarks';
            
            // Filter bookmarks based on archive status and search term
            const filteredBookmarks = bookmarksData.filter(bookmark => {
                const matchesArchive = isViewingArchived ? bookmark.isArchived : !bookmark.isArchived;
                const matchesSearch = searchTerm === '' || bookmark.title.toLowerCase().includes(searchTerm)
                return matchesArchive && matchesSearch;
            });
            
            // Clear existing content
            cardsContainer.innerHTML = '';
            
            // Show message if no bookmarks found
            if (filteredBookmarks.length === 0) {
                const message = '<p class="text-slate-500 text-center py-8">No bookmarks found matching your search.</p>';
                cardsContainer.innerHTML = message;
                return;
            }
            
            // Apply current sorting to search results
            const sortedBookmarks = sortBookmarks(filteredBookmarks, currentSort);
            
            // Create and append bookmark cards
            sortedBookmarks.forEach(bookmark => {
                const cardHTML = createBookmarkCard(bookmark);
                cardsContainer.innerHTML += cardHTML;
            });

             // Apply current theme to the search results
            const currentDarkMode = localStorage.getItem('darkMode') === 'true';
            if (currentDarkMode) {
                updateCardColors('#002E2D', 'white');
            } else {
                updateCardColors('white', 'black');
            }
            
            // Add event listeners for dropdown menus
            addBookmarkEventListeners();
        });
    }
}

// Open add bookmark modal
function openAddBookmarkModal() {
    const modal = document.querySelector('.editBookmark');
    const form = modal.querySelector('form');
    
    // Hide main content
    hideCard('.hero');
    
    // Clear form
    form.reset();
    
    // Reset character count
    const charCount = form.querySelector('p.w-full.text-end');
    if (charCount) {
        charCount.textContent = '0/280';
    }
    
    // Set form action to add
    form.setAttribute('data-action', 'add');
    form.removeAttribute('data-id');
    
    // Update modal title
    const modalTitle = modal.querySelector('h1');
    if (modalTitle) {
        modalTitle.textContent = 'Add Bookmark';
    }
    
    // Show modal - remove hidden class
    modal.classList.remove('hidden');
}

// Initialize add button functionality
function initializeAddButton() {
    const addButton = document.querySelector('.addBookmark'); 
        addButton.addEventListener('click', (e) => {
            e.preventDefault();
            openAddBookmarkModal();
        });
}

// Sort button functionality
function initializeSortButton() {
    const sortButton = document.querySelector('.sorting');
    const sortDiv = document.querySelector('.sortBy');
    
    if (sortButton && sortDiv) {
        // Remove any existing event listeners first
        sortButton.replaceWith(sortButton.cloneNode(true));
        const newSortButton = document.querySelector('.sorting');
        
        newSortButton.addEventListener('click', (e) => {
            e.stopPropagation();
            sortDiv.classList.toggle('hidden');
        });
    }
}

// Open edit bookmark modal
function openEditBookmarkModal(bookmark) {
    const modal = document.querySelector('.editBookmark');
    const form = modal.querySelector('form');
    
    // Hide main content
    hideCard('.hero');
    
    // Populate form with existing data
    const titleInput = form.querySelector('input[placeholder="Enter Title"]');
    const descriptionInput = form.querySelector('textarea');
    const urlInput = form.querySelector('input[placeholder="https://example.com"]');
    const faviconInput = form.querySelector('input[placeholder*="favicon"]');
    const tagsInput = form.querySelector('input[placeholder*="Tags"]');
    
    if (titleInput) titleInput.value = bookmark.title;
    if (descriptionInput) descriptionInput.value = bookmark.description;
    if (urlInput) urlInput.value = bookmark.url;
    if (faviconInput) faviconInput.value = bookmark.favicon;
    if (tagsInput) tagsInput.value = bookmark.tags.join(', ');
    
    // Update character count
    const charCount = form.querySelector('p.w-full.text-end');
    if (charCount) {
        charCount.textContent = `${bookmark.description.length}/280`;
    }
    
    // Set form action to edit
    form.setAttribute('data-action', 'edit');
    form.setAttribute('data-id', bookmark.id);
    
    // Update modal title
    const modalTitle = modal.querySelector('h1');
    if (modalTitle) {
        modalTitle.textContent = 'Edit Bookmark';
    }
    
    // Show modal
    modal.classList.remove('hidden');
}

// Edit bookmark functionality
function initializeEditBookmark() {
    document.querySelectorAll('.cards .edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bookmarkId = e.currentTarget.getAttribute('data-id');
            const bookmark = bookmarksData.find(b => b.id === bookmarkId);
            
            if (bookmark) {
                openEditBookmarkModal(bookmark);
            }
            
            // Close the dropdown
            const dropdown = document.querySelector(`.bookmark-dropdown[data-id="${bookmarkId}"]`);
            dropdown.classList.add('hidden');
        });
    });
}


// Handle form submission for both add and edit

function handleBookmarkFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const action = form.getAttribute('data-action');
    
    // Use FormData for cleaner code
    const formData = new FormData(form);
    const title = formData.get('title');
    const description = formData.get('description');
    const url = formData.get('url');
    const favicon = formData.get('favicon');
    const tags = formData.get('tags').split(',').map(tag => tag.trim());
    
    
    // Basic validation
    if (!title || !description || !url) {
        alert('Please fill in all required fields (Title, Description, URL)');
        return;
    }
    
    if (action === 'edit') {
        // Edit existing bookmark
        const bookmarkId = form.getAttribute('data-id');
        const bookmark = bookmarksData.find(b => b.id === bookmarkId);
        
        if (bookmark) {
            bookmark.title = title;
            bookmark.description = description;
            bookmark.url = url;
            bookmark.favicon = favicon;
            bookmark.tags = tags;
            
            showNotification('Bookmark updated successfully');
        }
    } else {
        // Add new bookmark
        const newBookmark = {
            id: 'bm-' + String(bookmarksData.length + 1).padStart(3, '0'),
            title: title,
            url: url,
            favicon: favicon,
            description: description,
            tags: tags,
            pinned: false,
            isArchived: false,
            visitCount: 0,
            createdAt: new Date().toISOString(),
            lastVisited: null
        };
        
        bookmarksData.push(newBookmark);
        showNotification('Bookmark added successfully');
    }
    
    // Close modal and refresh view
    closeBookmarkModal();
    refreshCurrentView();
}

// Close bookmark modal
function closeBookmarkModal() {
    const modal = document.querySelector('.editBookmark');
    modal.classList.add('hidden');
    
    // Show main content again
    showCard('.hero');
}



// sign up form works
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let passwordReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    if (emailReg.test(createAccountEmailVal.value) && passwordReg.test(createAccountPasswordVal.value)) {
        hideCard('.signUpForm');
        showCard('.logInForm');
        // Auto-fill login form with signup credentials
        loginEmailVal.value = createAccountEmailVal.value;
        loginPasswordVal.value = createAccountPasswordVal.value;
    }
    else {
        alert('Please enter a valid email and password');
    }
});

// signup form ends here.

// filtering the tags. 

// Function to get selected tags
function getSelectedTags() {
    const selectedTags = [];
    const tagCheckboxes = document.querySelectorAll('.inputData input[type="checkbox"]:checked');
    
    tagCheckboxes.forEach(checkbox => {
        const label = checkbox.parentElement.querySelector('label');
        if (label) {
            selectedTags.push(label.textContent.toLowerCase());
        }
    });
    
    return selectedTags;
}

// Function to filter bookmarks by selected tags
function filterBookmarksByTags() {
    const selectedTags = getSelectedTags();
    const isViewingArchived = document.querySelector('.bookmark-title').textContent === 'Archived Bookmarks';
    
    const cardsContainer = document.querySelector('.cards');
    
    // If no tags are selected, show all bookmarks based on archive status
    if (selectedTags.length === 0) {
        refreshCurrentView();
        return;
    }
    
    // Filter bookmarks based on archive status AND selected tags
    const filteredBookmarks = bookmarksData.filter(bookmark => {
        const matchesArchive = isViewingArchived ? bookmark.isArchived : !bookmark.isArchived;
        const matchesTags = selectedTags.some(tag => 
            bookmark.tags.some(bookmarkTag => 
                bookmarkTag.toLowerCase() === tag
            )
        );
        
        return matchesArchive && matchesTags;
    });
    
    // Clear existing content
    cardsContainer.innerHTML = '';
    
    // Show message if no bookmarks found
    if (filteredBookmarks.length === 0) {
        const message = '<p class="text-slate-500 text-center py-8">No bookmarks found matching the selected tags.</p>';
        cardsContainer.innerHTML = message;
        return;
    }
    
    // Apply current sorting to filtered results
    const sortedBookmarks = sortBookmarks(filteredBookmarks, currentSort);
    
    // Create and append bookmark cards
    sortedBookmarks.forEach(bookmark => {
        const cardHTML = createBookmarkCard(bookmark);
        cardsContainer.innerHTML += cardHTML;
    });

     // Apply current theme to the filtered cards
    const currentDarkMode = localStorage.getItem('darkMode') === 'true';
    if (currentDarkMode) {
        updateCardColors('#002E2D', 'white');
    } else {
        updateCardColors('white', 'black');
    }
    
    // Add event listeners for dropdown menus
    addBookmarkEventListeners();
}

// Function to initialize tag filtering
function initializeTagFiltering() {
    const tagCheckboxes = document.querySelectorAll('.inputData input[type="checkbox"]');
    
    tagCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            filterBookmarksByTags();
        });
    });
}

// login form works
logInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(createAccountEmailVal.value == loginEmailVal.value && createAccountPasswordVal.value == loginPasswordVal.value) {
        hideCard('.logInForm');
        showCard('.hero');
        
        // Initialize all functionality after successful login
        loadBookmarks(); // Load bookmarks after successful login
        initializeSearch(); // Initialize search functionality
        initializeAddButton(); // Initialize add button
        initializeSortButton(); // Initialize sort button
        initializeSortButtons(); // Initialize sort buttons functionality
        initializeTagFiltering(); // Initialize tag filtering
        initializeBookmarkModal(); // Initialize bookmark modal
        
        // Set home as active by default
        updateSidebarActiveState('home');

        // mini profile data
        const profileName = document.querySelector('.profileName');
        const profileEmail = document.querySelector('.profileEmail');
        profileName.textContent = createAccountFullNameVal.value;
        profileEmail.textContent = createAccountEmailVal.value;

        // for the theme
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }

    }
    else {
        alert('You do not have any account with this email');
    }
})
// login form ends here

// sign up button works
signUpBtn.addEventListener('click', () => {
    hideCard('.logInForm');
    showCard('.signUpForm');
    createAccountEmailVal.value = '';
    createAccountPasswordVal.value = '';
    createAccountFullNameVal.value = '';
    loginEmailVal.value = '';
    loginPasswordVal.value = '';
});

//signup button ends here

// login button works
logInBtn.addEventListener('click', () => {
    hideCard('.signUpForm');
    showCard('.logInForm');
    createAccountEmailVal.value = '';
    createAccountPasswordVal.value = '';
    createAccountFullNameVal.value = '';
    loginEmailVal.value = '';
    loginPasswordVal.value = '';
});

// login button ends here

// reset password through email button works
resetPassbtn.addEventListener('click', () => {
    hideCard('.logInForm');
    showCard('#resetEm');
    resetEmailVal.value = '';
    changePass.value = '';
    confirmChangePass.value = '';
});

// reset password through email button ends here

// reset email form works 1st stage works
resetEmailID.addEventListener('submit', (e) => {
    e.preventDefault();
    if(createAccountEmailVal.value == resetEmailVal.value) {
        hideCard('#resetEm');
        showCard('#confirmPass');
    }
    else {
        alert('You do not have any account with this email');
    }
})

// reset email form works 1st stage ends here

// reset password form works
confirmPassForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(changePass.value == confirmChangePass.value) {
        createAccountPasswordVal.value = changePass.value;
        loginPasswordVal.value = changePass.value;
        hideCard('#confirmPass');
        showCard('.logInForm');
        alert('You have successfully reset your password');
    }
    else {
        alert('Passwords do not match');
    }
})

// reset password form ends here
// inside reset form back to login button works
backToLoginBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        hideCard('#resetEm');
        hideCard('#confirmPass');
        showCard('.logInForm');
    })
})

// inside reset form back to login button ends here
//full form work has been finished.

// for responsiveness. 

function sideBarToggle() {
    if (sideBar.classList.contains('hidden')) {
        sideBar.classList.remove('hidden');
        sideBar.classList.add('absolute', 'left-0', 'top-0', 'h-screen');
        parentSideBar.classList.remove('flex', 'justify-center');
    }
    else {
        sideBar.classList.add('hidden');
        sideBar.classList.remove('absolute', 'left-0', 'top-0', 'h-screen');
        parentSideBar.classList.add('flex', 'justify-center');
    }
}

document.addEventListener('click', (e) => {
    const isSidebarVisible = !sideBar.classList.contains('hidden');
    const clickedOutside = !sideBar.contains(e.target) && !e.target.closest('.bar');

    if (isSidebarVisible && clickedOutside) {
        sideBarToggle();
    }

    // that mini profile dropdown
    const isProfileBtn = e.target.closest('.profileBtn');
    const isProfileDropdown = e.target.closest('.profileDrop');
    
    if (!isProfileBtn && !isProfileDropdown) {
        profileDropdown.classList.add('hidden');
    }
});
hamburgerBtn.addEventListener('click',(e) => {
    e.stopPropagation();
    sideBarToggle();
});

// for responsiveness ends here

// that mini profile dropdown

profileBtn.addEventListener('click', () => {
    profileDropdown.classList.toggle('hidden'); // addiional code is at line 654
});

// mini profile dropdown ends here.

// theme changer starts here
let darkMode = localStorage.getItem('darkMode') === 'true'; 
const darkBtn = document.querySelector('.darkBtn');
const lightBtn = document.querySelector('.lightBtn');

function catchCardNColor(cards, bgcolor, textcolor) {
    cardElements = document.querySelectorAll(cards);
    cardElements.forEach(card => {
        card.style.backgroundColor = bgcolor;
        card.style.color = textcolor;
        
        // Also update all text elements inside the card
        const textElements = card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div:not(.inputCount)');
        textElements.forEach(element => {
            element.style.color = textcolor;
        });
    });
}

function updateCardColors(bgcolor, textcolor) {
    // Update all bookmark cards
    const bookmarkCards = document.querySelectorAll('.cards > div');
    bookmarkCards.forEach(card => {
        card.style.backgroundColor = bgcolor;
        card.style.color = textcolor;
        
        // Update text colors inside cards
        const title = card.querySelector('h1');
        const domain = card.querySelector('p.text-slate-600');
        const description = card.querySelector('p.text-slate-700');
        const tags = card.querySelectorAll('.tags span');
        const externalTexts = card.querySelectorAll('.externals p');
        const bookMarkDropDown = card.querySelectorAll('.bookmark-dropdown');
        const profileDrop = document.querySelector('.profileDrop');

        if (title) title.style.color = textcolor;
        if (domain) domain.style.color = textcolor === 'white' ? '#d1d5db' : '#6b7280';
        if (description) description.style.color = textcolor === 'white' ? '#e5e7eb' : '#374151';
        
        // Update tags
        tags.forEach(tag => {
            tag.style.backgroundColor = textcolor === 'white' ? '#374151' : '#e5e7eb';
            tag.style.color = textcolor === 'white' ? 'white' : 'black';
        });

        // dropdown cards
        bookMarkDropDown.forEach(dropdown => {
            dropdown.style.backgroundColor = textcolor === 'white' ? '#374151' : '#e5e7eb';
            dropdown.style.color = textcolor === 'white' ? 'white' : 'black';
        });

        //profile Drop Down card
        profileDrop.style.backgroundColor = textcolor === 'white' ? '#374151' : '#e5e7eb';
        profileDrop.style.color = textcolor === 'white' ? 'white' : 'black';

        // Update external info text
        externalTexts.forEach(text => {
            text.style.color = textcolor === 'white' ? '#d1d5db' : '#6b7280';
        });
    });
}
let logoChange = document.querySelectorAll('.logoChange');

document.addEventListener('DOMContentLoaded', function() {
    if (darkMode) {
        applyDarkTheme();
    } else {
        applyLightTheme();
    }
});

function applyDarkTheme() {
    darkMode = true;
    localStorage.setItem('darkMode', 'true');
    
    catchCardNColor('.dark1', '#001414', 'white');
    catchCardNColor('.dark2', '#001F1F', 'white');
    catchCardNColor('.dark3', '#002E2D', 'white');
    catchCardNColor('.insideHero', '#001F1F', 'white');
    updateCardColors('#002E2D', 'white');
    
    logoChange.forEach(element => {
        element.setAttribute('src', './assets/images/logo-dark-theme.svg');
    });
}

function applyLightTheme() {
    darkMode = false;
    localStorage.setItem('darkMode', 'false');
    
    catchCardNColor('.dark1', '#E8F0EF', 'black');
    catchCardNColor('.dark2', 'white', 'black');
    catchCardNColor('.dark3', 'white', 'black');
    catchCardNColor('.insideHero', '#f1f5f9', 'black');
    updateCardColors('white', 'black');

    const addBookmark = document.querySelector('.addBookmark');
    addBookmark.style.color = 'white';
    
    logoChange.forEach(element => {
        element.setAttribute('src', './assets/images/logo-light-theme.svg');
    });
}

darkBtn.addEventListener('click', applyDarkTheme);
lightBtn.addEventListener('click', applyLightTheme);

// theme changer ends here

// log out btn works

const logoutBtn = document.querySelector('.logOut');

logoutBtn.addEventListener('click', () => {
    hideCard('.hero')
    showCard('.logInForm');
})

// log out btn ends here