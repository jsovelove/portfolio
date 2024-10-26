// CameraButtonController.js
export class CameraButtonController {
  constructor(cameraController, buttonContainer, moveCameraButton, sectionOne, moveCameraPosition, backPosition) {
    this.cameraController = cameraController;
    this.buttonContainer = buttonContainer;
    this.moveCameraButton = moveCameraButton;
    this.sectionOne = sectionOne;
    this.isMobile = window.matchMedia("(pointer: coarse)").matches && window.innerWidth <= 1024;

    // Define positions for moving and returning
    this.moveCameraPosition = moveCameraPosition;
    this.backPosition = backPosition;

    // Attach click event to the moveCameraButton
    this.moveCameraButton.addEventListener('click', () => this.handleMoveCameraClick());

    // Create the Back button with an upward arrow icon
    this.backButton = document.createElement('button');
    this.backButton.classList.add('control-button');
    const backIcon = document.createElement('span');
    backIcon.classList.add('material-icons');
    backIcon.textContent = 'arrow_upward';
    this.backButton.appendChild(backIcon);
    this.backButton.addEventListener('click', () => this.handleBackClick());

    // Create the BIO button
    this.bioButton = document.createElement('button');
    this.bioButton.classList.add('control-button', 'page-button');
    this.bioButton.textContent = "BIO";
    this.bioButton.addEventListener('click', () => this.handleBioClick());

    // Create the SKILLS button
    this.skillsButton = document.createElement('button');
    this.skillsButton.classList.add('control-button', 'page-button');
    this.skillsButton.textContent = "SKILLS";
    this.skillsButton.addEventListener('click', () => this.handleSkillsClick());

    // Initially show sectionOne and Move Camera utton
    this.showSectionOne();
    this.showMoveCameraButton();
  }

  // Handle Move Camera button click
  handleMoveCameraClick() {
    const targetPosition = this.isMobile && this.moveCameraPosition.mobile ? this.moveCameraPosition.mobile : this.moveCameraPosition.default;
    this.cameraController.moveTo(targetPosition);

    // Replace Move Camera button with Back and BIO buttons, and hide sectionOne
    this.toggleToBackAndBioButtons();
    this.hideSectionOne();
  }

  // Handle Back button click
  handleBackClick() {
    const targetPosition = this.isMobile && this.backPosition.mobile ? this.backPosition.mobile : this.backPosition.default;
    this.cameraController.moveTo(targetPosition);

    // Reset sequence by displaying Move Camera button again
    this.resetToMoveCameraButton();
    this.showSectionOne();
  }

  // Handle BIO button click
  handleBioClick() {
    // Move camera to y = 300 and replace BIO with SKILLS button
    this.cameraController.moveTo({ x: 50, y: 900, z: -20 });
    this.toggleToSkillsButton();
  }

  // Handle SKILLS button click (add behavior as needed)
  handleSkillsClick() {
    console.log("SKILLS button clicked");
  }

  // Show only Move Camera button
  showMoveCameraButton() {
    this.clearButtons();
    this.buttonContainer.appendChild(this.moveCameraButton);
  }

  // Show Back and BIO buttons in a row
  showBackAndBioButtons() {
    this.clearButtons();
    this.buttonContainer.appendChild(this.backButton);
    this.buttonContainer.appendChild(this.bioButton);
  }

  // Toggle to show Move Camera button (reset sequence)
  resetToMoveCameraButton() {
    this.showMoveCameraButton();

    // Reset the button sequence to show BIO on the next toggle
    this.bioButton.style.display = 'block'; // Make sure BIO button is visible
    this.skillsButton.style.display = 'none'; // Hide SKILLS button
  }

  // Toggle to Back and BIO buttons
  toggleToBackAndBioButtons() {
    this.showBackAndBioButtons();
  }

  // Show the SKILLS button and hide the BIO button
  toggleToSkillsButton() {
    this.clearButtons();
    this.buttonContainer.appendChild(this.backButton);
    this.buttonContainer.appendChild(this.skillsButton);
  }

  // Hide sectionOne
  hideSectionOne() {
    this.sectionOne.style.display = 'none';
  }

  // Show sectionOne as flex
  showSectionOne() {
    this.sectionOne.style.display = 'flex';
  }

  // Clear all buttons from the button container
  clearButtons() {
    [this.moveCameraButton, this.backButton, this.bioButton, this.skillsButton].forEach(button => {
      if (button.parentElement === this.buttonContainer) {
        this.buttonContainer.removeChild(button);
      }
    });
  }
}
