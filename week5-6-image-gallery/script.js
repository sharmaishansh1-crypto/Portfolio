// ========================================
// PIXEL GALLERY — INTERACTIVE FEATURES
// ========================================

// Get HTML elements
const gallery = document.getElementById("gallery");
const filterButtons = document.querySelectorAll(".filter-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const imageCaption = document.getElementById("imageCaption");

const closeLightboxBtn = document.getElementById("closeLightbox");
const prevImageBtn = document.getElementById("prevImage");
const nextImageBtn = document.getElementById("nextImage");

// All gallery cards
const galleryItems = Array.from(
    document.querySelectorAll(".gallery-item")
);

let visibleImages = [...galleryItems];
let currentImageIndex = 0;
let previouslyFocusedElement = null;


// ========================================
// 1. FILTER IMAGES BY CATEGORY
// ========================================

filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const selectedCategory = button.dataset.category;

        // Update active filter button
        filterButtons.forEach(function(filterButton) {
            filterButton.classList.remove("active");
        });

        button.classList.add("active");

        // Show matching images
        galleryItems.forEach(function(item) {
            const category = item.dataset.category;

            if (
                selectedCategory === "all" ||
                category === selectedCategory
            ) {
                item.classList.remove("hidden");
            } else {
                item.classList.add("hidden");
            }
        });

        // Update images available to the lightbox
        visibleImages = galleryItems.filter(function(item) {
            return !item.classList.contains("hidden");
        });
    });
});


// ========================================
// 2. EVENT DELEGATION FOR IMAGE CLICKS
// ========================================

gallery.addEventListener("click", function(event) {
    const card = event.target.closest(".gallery-item");

    if (!card || card.classList.contains("hidden")) {
        return;
    }

    // Find the clicked image among currently visible cards
    currentImageIndex = visibleImages.indexOf(card);

    if (currentImageIndex !== -1) {
        openLightbox(card);
    }
});


// ========================================
// 3. OPEN LIGHTBOX
// ========================================

function openLightbox(card) {
    const image = card.querySelector("img");
    const title = card.querySelector("h2");
    const category = card.querySelector(".image-info span");

    previouslyFocusedElement = document.activeElement;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    imageCaption.textContent =
        title.textContent + " — " + category.textContent;

    lightbox.hidden = false;
    document.body.style.overflow = "hidden";

    closeLightboxBtn.focus();
}


// ========================================
// 4. CLOSE LIGHTBOX
// ========================================

function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";

    if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
    }
}

closeLightboxBtn.addEventListener("click", closeLightbox);


// Close when clicking the dark background
lightbox.addEventListener("click", function(event) {
    if (event.target === lightbox) {
        closeLightbox();
    }
});


// ========================================
// 5. NEXT AND PREVIOUS IMAGE
// ========================================

function showImage(index) {
    if (visibleImages.length === 0) {
        return;
    }

    // Wrap around at either end of the gallery
    currentImageIndex =
        (index + visibleImages.length) % visibleImages.length;

    const card = visibleImages[currentImageIndex];
    const image = card.querySelector("img");
    const title = card.querySelector("h2");
    const category = card.querySelector(".image-info span");

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    imageCaption.textContent =
        title.textContent + " — " + category.textContent;
}

prevImageBtn.addEventListener("click", function() {
    showImage(currentImageIndex - 1);
});

nextImageBtn.addEventListener("click", function() {
    showImage(currentImageIndex + 1);
});


// ========================================
// 6. KEYBOARD CONTROLS
// ========================================

document.addEventListener("keydown", function(event) {
    if (lightbox.hidden) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        showImage(currentImageIndex + 1);
    }

    if (event.key === "ArrowLeft") {
        showImage(currentImageIndex - 1);
    }
});