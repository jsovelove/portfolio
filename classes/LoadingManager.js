// LoadingManager.js
import * as THREE from 'three';

export class LoadingManager {
  constructor(onLoadCallback) {
    this.loadingManager = new THREE.LoadingManager();

    // Show loading screen and hide main content at the start
    this.showLoadingScreen();
    this.hideMainContent();

    // Loading events
    this.loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      console.log(`Started loading: ${url}. Items loaded: ${itemsLoaded} of ${itemsTotal}.`);
    };

    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log(`Loading in progress: ${url}. Items loaded: ${itemsLoaded} of ${itemsTotal}.`);
      this.updateProgress(itemsLoaded, itemsTotal);
    };

    this.loadingManager.onLoad = () => {
      console.log('Loading complete.');
      this.hideLoadingScreen();
      this.showMainContent();
      if (onLoadCallback) onLoadCallback(); // Call callback after loading completes
    };

    this.loadingManager.onError = (url) => {
      console.error(`Error loading: ${url}`);
      this.showError();
    };
  }

  // Show the loading screen
  showLoadingScreen() {
    const loadingElement = document.getElementById('loadingScreen');
    if (loadingElement) loadingElement.style.display = 'flex';
  }

  // Hide the loading screen
  hideLoadingScreen() {
    const loadingElement = document.getElementById('loadingScreen');
    if (loadingElement) loadingElement.style.display = 'none';
  }

  // Show the main content after loading completes
  showMainContent() {
    const mainContent = document.querySelector('main');
    if (mainContent) mainContent.style.display = 'block';
  }

  // Hide the main content initially
  hideMainContent() {
    const mainContent = document.querySelector('main');
    if (mainContent) mainContent.style.display = 'none';
  }

  // Update loading progress
  updateProgress(itemsLoaded, itemsTotal) {
    const progressElement = document.getElementById('loadingProgress');
    if (progressElement) {
      const progress = (itemsLoaded / itemsTotal) * 100;
      progressElement.style.width = `${progress}%`;
      progressElement.textContent = `${Math.round(progress)}%`;
    }
  }

  // Show an error message if loading fails
  showError() {
    const errorElement = document.getElementById('loadingError');
    if (errorElement) errorElement.style.display = 'block';
  }

  // Get the Three.js loading manager for asset loaders
  getManager() {
    return this.loadingManager;
  }
}
