const listingImage = document.getElementById('listingImage');
const imageModal = document.getElementById('imageModal');
const closeModal = document.getElementById('closeModal');
listingImage.addEventListener('click', () => {
    imageModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    imageModal.style.display = 'none';
});

// Close modal if user clicks outside of modal content
window.addEventListener('click', (event) => {
    if (event.target === imageModal) {
        imageModal.style.display = 'none';
    }
});