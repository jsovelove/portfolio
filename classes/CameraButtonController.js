// CameraButtonController.js
export class CameraButtonController {
  constructor(cameraController, buttonContainer, moveCameraButton, sectionOne, moveCameraPosition, backPosition) {
    this.cameraController = cameraController;
    this.buttonContainer = buttonContainer;
    this.moveCameraButton = moveCameraButton; // Existing moveCameraButton from HTML
    this.sectionOne = sectionOne; // Reference to sectionOne element
    this.isMobile = window.matchMedia("(pointer: coarse)").matches && window.innerWidth <= 1024;

    // Define positions for moving and returning
    this.moveCameraPosition = moveCameraPosition;
    this.backPosition = backPosition;

    // Attach click event to the moveCameraButton
    this.moveCameraButton.addEventListener('click', () => this.moveCamera());

    // Create the Back button with an upward arrow icon
    this.backButton = document.createElement('button');
    this.backButton.classList.add('control-button');
    const backIcon = document.createElement('span');
    backIcon.classList.add('material-icons');
    backIcon.textContent = 'arrow_upward'; // Set the Google Material "upward arrow" icon
    this.backButton.appendChild(backIcon);
    this.backButton.addEventListener('click', () => this.moveBack());

    // Initially show sectionOne and Move Camera button
    this.showSectionOne();
    this.showMoveCameraButton();
  }

  // Method to move the camera and hide sectionOne
  moveCamera() {
    const targetPosition = this.isMobile && this.moveCameraPosition.mobile ? this.moveCameraPosition.mobile : this.moveCameraPosition.default;
    this.cameraController.moveTo(targetPosition);

    // Replace Move Camera button with Back button and hide sectionOne
    this.toggleButtons();
    this.hideSectionOne();
  }

  // Method to move the camera back and show sectionOne
  moveBack() {
    const targetPosition = this.isMobile && this.backPosition.mobile ? this.backPosition.mobile : this.backPosition.default;
    this.cameraController.moveTo(targetPosition);

    // Replace Back button with Move Camera button and show sectionOne
    this.toggleButtons();
    this.showSectionOne();
  }

  // Toggle between showing Move Camera and Back button
  toggleButtons() {
    if (this.moveCameraButton.parentElement) {
      this.hideMoveCameraButton();
      this.showBackButton();
    } else {
      this.hideBackButton();
      this.showMoveCameraButton();
    }
  }

  // Show and hide sectionOne
  showSectionOne() {
    this.sectionOne.style.display = 'flex'; // Display sectionOne
  }

  hideSectionOne() {
    this.sectionOne.style.display = 'none'; // Hide sectionOne
  }

  // Show the move camera button
  showMoveCameraButton() {
    if (!this.moveCameraButton.parentElement) {
      this.buttonContainer.appendChild(this.moveCameraButton);
    }
  }

  // Hide the move camera button
  hideMoveCameraButton() {
    if (this.moveCameraButton.parentElement) {
      this.buttonContainer.removeChild(this.moveCameraButton);
    }
  }

  // Show the back button
  showBackButton() {
    this.buttonContainer.appendChild(this.backButton);
  }

  // Hide the back button
  hideBackButton() {
    if (this.backButton.parentElement) {
      this.buttonContainer.removeChild(this.backButton);
    }
  }

  // Method to add other custom buttons
  addButton({ label, position }) {
    const button = document.createElement('button');
    button.classList.add('control-button');
    button.textContent = label;

    button.addEventListener('click', () => {
      const targetPosition = this.isMobile && position.mobile ? position.mobile : position.default;
      this.cameraController.moveTo(targetPosition);
    });

    this.buttonContainer.appendChild(button);
  }
}
