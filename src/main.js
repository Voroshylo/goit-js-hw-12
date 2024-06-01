import iziToast from 'izitoast';
import { fetchImages } from './js/pixabay-api';
import { renderImages, showError, clearGallery, showLoader, hideLoader, toggleLoadMoreButton, } from './js/render-functions';

let currentPage = 1;
let currentQuery = '';



document.querySelector('#search-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = event.target.elements.searchQuery.value.trim();
  if (!query) {
    showError('Please enter a search query');
    return;
  }
  currentQuery = query;
  currentPage = 1;
  clearGallery();
  toggleLoadMoreButton(false);
  showLoader();
  try {
    const data = await fetchImages(query);
    if (data.hits.length === 0) {
      showError('Sorry, there are no images matching your search query. Please try again!');
    } else {
      renderImages(data.hits, true);
      toggleLoadMoreButton(data.totalHits > currentPage * 15);
    }
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoader();
  }
});

document.querySelector('.load-more').addEventListener('click', async () => {
  currentPage += 1;
  showLoader();
  try {
    const data = await fetchImages(currentQuery, currentPage);
    renderImages(data.hits, false);
    toggleLoadMoreButton(data.totalHits > currentPage * 15);
    if (data.totalHits <= currentPage * 15) {
      iziToast.info({
        title: 'info',
        message: 'Weare sorry, but you`ve reached the end of search result.',
        position: 'topRight'
      });
    }
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoader();
  }
});