// Add this at the beginning of your script
window.addEventListener('load', function() {
    document.querySelectorAll('.slide img').forEach(img => {
        // Check if image exists
        fetch(img.src)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log(`Image exists: ${img.src}`);
            })
            .catch(error => {
                console.error(`Image does not exist: ${img.src}`, error);
                img.classList.add('error');
            });

        // Log natural dimensions when image loads
        img.addEventListener('load', function() {
            console.log(`Image loaded: ${this.src}`);
            console.log(`Natural dimensions: ${this.naturalWidth}x${this.naturalHeight}`);
        });

        // Update the image error handling
        img.onerror = function() {
            console.error(`Image failed to load: ${this.src}`);
            this.src = './placeholder.jpg';
            this.classList.add('error');
        };

        img.onload = function() {
            console.log(`Image loaded successfully: ${this.src}`);
            this.classList.remove('error');
        };
    });
});

// Variables for text formatting
let selectedText = null;

// Text functionality
document.querySelectorAll('.movable-text').forEach(text => {
    let isDragging = false;
    let startX, startY;
    let initialX, initialY;

    // Set initial position
    text.style.top = '50%';
    text.style.left = '50%';
    text.style.transform = 'translate(-50%, -50%)';

    // Show format controls and update them when text is clicked
    text.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedText = text;
        
        // Update controls to match current text styles
        const styles = window.getComputedStyle(text);
        document.getElementById('fontSelect').value = styles.fontFamily.split(',')[0].replace(/['"]/g, '') || 'Arial';
        document.getElementById('sizeSelect').value = parseInt(styles.fontSize) || '24';
        document.getElementById('colorSelect').value = rgbToHex(styles.color);
    });

    // Dragging functionality
    text.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
        if (text.contentEditable === 'true') return;
        isDragging = true;
        text.classList.add('dragging');
        startX = e.clientX;
        startY = e.clientY;
        const rect = text.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        text.style.transform = 'none';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const parentRect = text.parentElement.getBoundingClientRect();
        const textRect = text.getBoundingClientRect();

        let newX = initialX - parentRect.left + dx;
        let newY = initialY - parentRect.top + dy;

        newX = Math.max(0, Math.min(newX, parentRect.width - textRect.width));
        newY = Math.max(0, Math.min(newY, parentRect.height - textRect.height));

        text.style.left = `${newX}px`;
        text.style.top = `${newY}px`;
    }

    function stopDragging() {
        isDragging = false;
        text.classList.remove('dragging');
    }

    // Double click to edit
    text.addEventListener('dblclick', () => {
        text.contentEditable = true;
        text.focus();
    });

    text.addEventListener('blur', () => {
        text.contentEditable = false;
    });
});

// Font controls with immediate updates
document.getElementById('fontSelect').addEventListener('change', function() {
    if (selectedText) {
        selectedText.style.setProperty('font-family', this.value, 'important');
    }
});

document.getElementById('sizeSelect').addEventListener('change', function() {
    if (selectedText) {
        selectedText.style.setProperty('font-size', `${this.value}px`, 'important');
    }
});

document.getElementById('colorSelect').addEventListener('change', function() {
    if (selectedText) {
        const selectedColor = this.value;
        selectedText.style.color = selectedColor;
        selectedText.style.setProperty('color', selectedColor, 'important');
        
        // Update background for better visibility
        if (selectedColor === '#FFFFFF') {
            selectedText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        } else {
            selectedText.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        }
    }
});

// Helper function to convert RGB to Hex
function rgbToHex(rgb) {
    if (rgb.startsWith('#')) return rgb;
    
    const rgbValues = rgb.match(/\d+/g);
    if (!rgbValues) return '#000000';
    
    const r = parseInt(rgbValues[0]);
    const g = parseInt(rgbValues[1]);
    const b = parseInt(rgbValues[2]);
    
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Clear selection when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.movable-text') && !e.target.closest('.format-controls')) {
        selectedText = null;
    }
});

// Slider functionality
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;

function updateSlider() {
    const translateX = currentSlide * (100 / 3);
    slider.style.transform = `translateX(-${translateX}%)`;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        if (index === currentSlide) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Previous button click handler
prevBtn.addEventListener('click', () => {
    currentSlide = Math.max(0, currentSlide - 1);
    updateSlider();
});

// Next button click handler
nextBtn.addEventListener('click', () => {
    currentSlide = Math.min(slides.length - 1, currentSlide + 1);
    updateSlider();
});

// Initialize slider
updateSlider();

// Add this to your existing JavaScript
document.getElementById('addTextBtn').addEventListener('click', () => {
    // Get the active slide
    const activeSlide = document.querySelector(`.slide:nth-child(${currentSlide + 1})`);
    if (!activeSlide) return;

    // Create new text element
    const newText = document.createElement('div');
    newText.className = 'movable-text';
    newText.textContent = 'New Text';

    // Set initial position
    newText.style.top = '50%';
    newText.style.left = '50%';
    newText.style.transform = 'translate(-50%, -50%)';

    // Add the text to the active slide
    activeSlide.appendChild(newText);

    // Add event listeners for the new text
    let isDragging = false;
    let startX, startY;
    let initialX, initialY;

    // Show format controls and update them when text is clicked
    newText.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedText = newText;
        
        // Update controls to match current text styles
        const styles = window.getComputedStyle(newText);
        document.getElementById('fontSelect').value = styles.fontFamily.split(',')[0].replace(/['"]/g, '') || 'Arial';
        document.getElementById('sizeSelect').value = parseInt(styles.fontSize) || '24';
        document.getElementById('colorSelect').value = rgbToHex(styles.color);
    });

    // Dragging functionality
    newText.addEventListener('mousedown', startDragging);
    
    function startDragging(e) {
        if (newText.contentEditable === 'true') return;
        isDragging = true;
        newText.classList.add('dragging');
        startX = e.clientX;
        startY = e.clientY;
        const rect = newText.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        newText.style.transform = 'none';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const parentRect = newText.parentElement.getBoundingClientRect();
        const textRect = newText.getBoundingClientRect();

        let newX = initialX - parentRect.left + dx;
        let newY = initialY - parentRect.top + dy;

        newX = Math.max(0, Math.min(newX, parentRect.width - textRect.width));
        newY = Math.max(0, Math.min(newY, parentRect.height - textRect.height));

        newText.style.left = `${newX}px`;
        newText.style.top = `${newY}px`;
    }

    function stopDragging() {
        isDragging = false;
        newText.classList.remove('dragging');
    }

    // Double click to edit
    newText.addEventListener('dblclick', () => {
        newText.contentEditable = true;
        newText.focus();
    });

    newText.addEventListener('blur', () => {
        newText.contentEditable = false;
    });

    // Add the drag and stop dragging listeners to document
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
});

// Variables for slider and selection
let selectedOrder = [];
let isSelectionMode = true;

// Modify the changeSlide function
function changeSlide(index) {
    if (isSelectionMode) {
        // Selection mode
        const thumbnail = document.querySelectorAll('.thumbnail')[index];
        
        if (selectedOrder.includes(index)) {
            // If already selected, remove it
            const position = selectedOrder.indexOf(index);
            selectedOrder.splice(position, 1);
            thumbnail.classList.remove('selected');
            
            // Update order numbers for remaining selected thumbnails
            document.querySelectorAll('.thumbnail').forEach((thumb, idx) => {
                if (selectedOrder.includes(idx)) {
                    const newOrder = selectedOrder.indexOf(idx) + 1;
                    thumb.setAttribute('data-selection-order', newOrder);
                }
            });
        } else if (selectedOrder.length < 3) {
            // Add new selection if less than 3 selected
            selectedOrder.push(index);
            thumbnail.classList.add('selected');
            thumbnail.setAttribute('data-selection-order', selectedOrder.length);
            
            // If we have selected all three images
            if (selectedOrder.length === 3) {
                isSelectionMode = false;
                arrangeSlides();
            }
        }
    } else {
        // Normal slider mode - use the selectedOrder array to get the correct index
        const actualIndex = selectedOrder.indexOf(index);
        if (actualIndex !== -1) {
            currentSlide = actualIndex;
            updateSlider();
        }
    }
}

// Function to arrange slides based on selection
function arrangeSlides() {
    // Rearrange the slides in DOM
    const slidesArray = Array.from(slides);
    const sliderContainer = document.querySelector('.slider');
    
    // Clear the slider
    sliderContainer.innerHTML = '';
    
    // Add slides in the selected order
    selectedOrder.forEach((originalIndex) => {
        const newSlide = slidesArray[originalIndex].cloneNode(true);
        sliderContainer.appendChild(newSlide);
        
        // Reattach event listeners for movable text
        const movableText = newSlide.querySelector('.movable-text');
        if (movableText) {
            attachTextEventListeners(movableText);
        }
    });
    
    // Reset current slide to first
    currentSlide = 0;
    updateSlider();
    
    // Update thumbnails to show the new order
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        thumb.classList.remove('selected');
        if (selectedOrder.includes(index)) {
            const orderIndex = selectedOrder.indexOf(index) + 1;
            thumb.setAttribute('data-selection-order', orderIndex);
            thumb.classList.add('selected');
        }
    });
}

// Helper function to attach text event listeners
function attachTextEventListeners(text) {
    let isDragging = false;
    let startX, startY;
    let initialX, initialY;
    let wasDragged = false;

    text.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedText = text;
        
        const styles = window.getComputedStyle(text);
        document.getElementById('fontSelect').value = styles.fontFamily.split(',')[0].replace(/['"]/g, '') || 'Arial';
        document.getElementById('sizeSelect').value = parseInt(styles.fontSize) || '24';
        document.getElementById('colorSelect').value = rgbToHex(styles.color);
    });

    text.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
        if (text.contentEditable === 'true') return;
        isDragging = true;
        wasDragged = false;
        text.classList.add('dragging');
        startX = e.clientX;
        startY = e.clientY;
        const rect = text.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        text.style.transform = 'none';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        wasDragged = true;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const parentRect = text.parentElement.getBoundingClientRect();
        const textRect = text.getBoundingClientRect();

        let newX = initialX - parentRect.left + dx;
        let newY = initialY - parentRect.top + dy;

        newX = Math.max(0, Math.min(newX, parentRect.width - textRect.width));
        newY = Math.max(0, Math.min(newY, parentRect.height - textRect.height));

        text.style.left = `${newX}px`;
        text.style.top = `${newY}px`;
    }

    function stopDragging() {
        if (isDragging && wasDragged) {
            saveTextState();
        }
        isDragging = false;
        wasDragged = false;
        text.classList.remove('dragging');
    }

    // Double click to edit
    text.addEventListener('dblclick', () => {
        text.contentEditable = true;
        text.focus();
    });

    // Save state when text editing is done
    text.addEventListener('blur', () => {
        text.contentEditable = false;
        saveTextState();
    });

    // Save state when text content changes
    text.addEventListener('input', () => {
        saveTextState();
    });
}

// Update the updateThumbnails function
function updateThumbnails() {
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        if (isSelectionMode) {
            // During selection mode
            if (selectedOrder.includes(index)) {
                thumb.classList.add('selected');
            }
        } else {
            // During slider mode
            if (selectedOrder[currentSlide] === index) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        }
    });
}

// Update the slider container CSS
const sliderContainer = document.querySelector('.slider-container');
sliderContainer.style.overflowX = 'hidden';
sliderContainer.style.scrollBehavior = 'smooth';

// Initialize
updateThumbnails();

// Add a reset selection button
function resetSelection() {
    selectedOrder = [];
    isSelectionMode = true;
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('selected');
        thumb.removeAttribute('data-selection-order');
    });
    
    // Reset slider to original order
    const sliderContainer = document.querySelector('.slider');
    const originalSlides = Array.from(document.querySelectorAll('.slide'));
    sliderContainer.innerHTML = '';
    originalSlides.forEach(slide => {
        sliderContainer.appendChild(slide.cloneNode(true));
    });
    
    currentSlide = 0;
    updateSlider();
}

// Add this button to your HTML
const resetButton = document.createElement('button');
resetButton.textContent = 'Reset Selection';
resetButton.className = 'reset-btn';
resetButton.onclick = resetSelection;
document.querySelector('.thumbnail-container').appendChild(resetButton);

// Add these variables at the top of your script
let textHistory = {
    states: [],
    currentIndex: -1,
    maxStates: 20 // Maximum number of states to keep
};

// Function to save state
function saveTextState() {
    const allSlides = document.querySelectorAll('.slide');
    const state = [];
    
    allSlides.forEach((slide, slideIndex) => {
        const texts = slide.querySelectorAll('.movable-text');
        const slideTexts = [];
        
        texts.forEach(text => {
            slideTexts.push({
                content: text.textContent,
                style: {
                    left: text.style.left,
                    top: text.style.top,
                    fontFamily: text.style.fontFamily,
                    fontSize: text.style.fontSize,
                    color: text.style.color,
                    backgroundColor: text.style.backgroundColor
                }
            });
        });
        
        state.push(slideTexts);
    });

    // Remove any redo states
    textHistory.states = textHistory.states.slice(0, textHistory.currentIndex + 1);
    
    // Add new state
    textHistory.states.push(state);
    
    // Remove oldest state if we exceed maxStates
    if (textHistory.states.length > textHistory.maxStates) {
        textHistory.states.shift();
    } else {
        textHistory.currentIndex++;
    }
    
    updateUndoRedoButtons();
}

// Function to restore state
function restoreTextState(state) {
    const allSlides = document.querySelectorAll('.slide');
    
    allSlides.forEach((slide, slideIndex) => {
        // Clear existing texts
        const existingTexts = slide.querySelectorAll('.movable-text');
        existingTexts.forEach(text => text.remove());
        
        // Restore texts from state
        if (state[slideIndex]) {
            state[slideIndex].forEach(textState => {
                const newText = document.createElement('div');
                newText.className = 'movable-text';
                newText.textContent = textState.content;
                
                // Restore styles
                Object.assign(newText.style, textState.style);
                
                // Add event listeners
                attachTextEventListeners(newText);
                
                slide.appendChild(newText);
            });
        }
    });
}

// Function to update undo/redo buttons
function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    
    undoBtn.disabled = textHistory.currentIndex <= 0;
    redoBtn.disabled = textHistory.currentIndex >= textHistory.states.length - 1;
}

// Undo function
function undo() {
    if (textHistory.currentIndex > 0) {
        textHistory.currentIndex--;
        restoreTextState(textHistory.states[textHistory.currentIndex]);
        updateUndoRedoButtons();
    }
}

// Redo function
function redo() {
    if (textHistory.currentIndex < textHistory.states.length - 1) {
        textHistory.currentIndex++;
        restoreTextState(textHistory.states[textHistory.currentIndex]);
        updateUndoRedoButtons();
    }
}

// Add event listeners for undo/redo buttons
document.getElementById('undoBtn').addEventListener('click', undo);
document.getElementById('redoBtn').addEventListener('click', redo);

// Modify the text change events to save states
function attachTextEventListeners(text) {
    let isDragging = false;
    let startX, startY;
    let initialX, initialY;
    let wasDragged = false;

    text.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedText = text;
        
        const styles = window.getComputedStyle(text);
        document.getElementById('fontSelect').value = styles.fontFamily.split(',')[0].replace(/['"]/g, '') || 'Arial';
        document.getElementById('sizeSelect').value = parseInt(styles.fontSize) || '24';
        document.getElementById('colorSelect').value = rgbToHex(styles.color);
    });

    text.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
        if (text.contentEditable === 'true') return;
        isDragging = true;
        wasDragged = false;
        text.classList.add('dragging');
        startX = e.clientX;
        startY = e.clientY;
        const rect = text.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        text.style.transform = 'none';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        wasDragged = true;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const parentRect = text.parentElement.getBoundingClientRect();
        const textRect = text.getBoundingClientRect();

        let newX = initialX - parentRect.left + dx;
        let newY = initialY - parentRect.top + dy;

        newX = Math.max(0, Math.min(newX, parentRect.width - textRect.width));
        newY = Math.max(0, Math.min(newY, parentRect.height - textRect.height));

        text.style.left = `${newX}px`;
        text.style.top = `${newY}px`;
    }

    function stopDragging() {
        if (isDragging && wasDragged) {
            saveTextState();
        }
        isDragging = false;
        wasDragged = false;
        text.classList.remove('dragging');
    }

    // Double click to edit
    text.addEventListener('dblclick', () => {
        text.contentEditable = true;
        text.focus();
    });

    // Save state when text editing is done
    text.addEventListener('blur', () => {
        text.contentEditable = false;
        saveTextState();
    });

    // Save state when text content changes
    text.addEventListener('input', () => {
        saveTextState();
    });
}

// Update the format control event listeners
document.getElementById('fontSelect').addEventListener('change', function() {
    if (selectedText) {
        selectedText.style.setProperty('font-family', this.value, 'important');
        saveTextState();
    }
});

document.getElementById('sizeSelect').addEventListener('change', function() {
    if (selectedText) {
        selectedText.style.setProperty('font-size', `${this.value}px`, 'important');
        saveTextState();
    }
});

document.getElementById('colorSelect').addEventListener('change', function() {
    if (selectedText) {
        const selectedColor = this.value;
        selectedText.style.color = selectedColor;
        selectedText.style.setProperty('color', selectedColor, 'important');
        
        if (selectedColor === '#FFFFFF') {
            selectedText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        } else {
            selectedText.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        }
        saveTextState();
    }
});

// Update the addTextBtn click handler
document.getElementById('addTextBtn').addEventListener('click', () => {
    const activeSlide = document.querySelector(`.slide:nth-child(${currentSlide + 1})`);
    if (!activeSlide) return;

    const newText = document.createElement('div');
    newText.className = 'movable-text';
    newText.textContent = 'New Text';
    newText.style.top = '50%';
    newText.style.left = '50%';
    newText.style.transform = 'translate(-50%, -50%)';

    activeSlide.appendChild(newText);
    attachTextEventListeners(newText);
    saveTextState();
});

// Initialize first state
saveTextState();

