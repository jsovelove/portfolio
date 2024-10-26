// CameraButtonController.js
export class CameraButtonController {
  constructor(cameraController, buttonContainer, moveCameraButton, sectionOne, aboutMe, moveCameraPosition, backPosition) {
    this.cameraController = cameraController;
    this.buttonContainer = buttonContainer;
    this.moveCameraButton = moveCameraButton;
    this.sectionOne = sectionOne;
    this.aboutMe = aboutMe; // Add aboutMe element to the constructor
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

    // Create the PROJECTS button
    this.projectsButton = document.createElement('button');
    this.projectsButton.classList.add('control-button', 'page-button');
    this.projectsButton.textContent = "PROJECTS";
    this.projectsButton.addEventListener('click', () => this.handleProjectsClick());

    // Initially show sectionOne and Move Camera button
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
    this.hideAboutMe(); // Ensure aboutMe is hidden when reset
  }

  // Handle BIO button click
  handleBioClick() {
    // Move camera to y = 300 and replace BIO with SKILLS button
    this.cameraController.moveTo({ x: 50, y: 900, z: -20 });
    this.toggleToBackAndSkillsButtons();
    this.showAboutMe(); // Show aboutMe when BIO is clicked
  }

  // Handle SKILLS button click
  handleSkillsClick() {
    // Move camera to a higher position (e.g., y = 600) and replace SKILLS with PROJECTS button
    this.cameraController.moveTo({ x: 50, y: 1200, z: -20 });
    this.toggleToBackAndProjectsButtons();
    this.hideAboutMe(); // Hide aboutMe when SKILLS is clicked
  }

  // Handle PROJECTS button click
  handleProjectsClick() {
    // Move camera to an even higher position (e.g., y = 900) or perform other actions
    this.cameraController.moveTo({ x: 50, y: 2000, z: -20 });
    console.log("PROJECTS button clicked");
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

  // Show Back and SKILLS buttons in a row
  showBackAndSkillsButtons() {
    this.clearButtons();
    this.buttonContainer.appendChild(this.backButton);
    this.buttonContainer.appendChild(this.skillsButton);
  }

  // Show Back and PROJECTS buttons in a row
  showBackAndProjectsButtons() {
    this.clearButtons();
    this.buttonContainer.appendChild(this.backButton);
    this.buttonContainer.appendChild(this.projectsButton);
  }

  // Toggle to show Move Camera button (reset sequence)
  resetToMoveCameraButton() {
    this.showMoveCameraButton();
  }

  // Toggle to Back and BIO buttons
  toggleToBackAndBioButtons() {
    this.showBackAndBioButtons();
  }

  // Toggle to Back and SKILLS buttons
  toggleToBackAndSkillsButtons() {
    this.showBackAndSkillsButtons();
  }

  // Toggle to Back and PROJECTS buttons
  toggleToBackAndProjectsButtons() {
    this.showBackAndProjectsButtons();
  }

  // Hide sectionOne
  hideSectionOne() {
    this.sectionOne.style.display = 'none';
  }

  // Show sectionOne as flex
  showSectionOne() {
    this.sectionOne.style.display = 'flex';
  }

  // Show aboutMe section
  showAboutMe() {
    this.aboutMe.style.display = 'flex';
  }

  // Hide aboutMe section
  hideAboutMe() {
    this.aboutMe.style.display = 'none';
  }

  // Clear all buttons from the button container
  clearButtons() {
    [this.moveCameraButton, this.backButton, this.bioButton, this.skillsButton, this.projectsButton].forEach(button => {
      if (button.parentElement === this.buttonContainer) {
        this.buttonContainer.removeChild(button);
      }
    });
  }
}
