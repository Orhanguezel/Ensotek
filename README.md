
---

# Kuhlturm Enotek Web Project

This is a web project for Kuhlturm-Ensotek GmbH, providing an interactive website to display information about the company's activities, products, team, and more. The project uses HTML, CSS, JavaScript (with components) for modular content structure, and jQuery for additional functionality.

## Project Structure

```
kuhlturm-ensotek/
│
├── assets/
│   └── img/             # Image assets used across the website
│
├── components/          # JavaScript modules for individual components
│   ├── aktivit.js       # Activities section component
│   ├── artikel.js       # Article section component
│   ├── carousel.js      # Carousel section component
│   ├── footer.js        # Footer section component
│   ├── galerie.js       # Gallery section component
│   ├── geschichte.js    # History section component
│   ├── header.js        # Header (navbar) component
│   ├── kontakt.js       # Contact section component
│   ├── mainContent.js   # Main content layout component
│   ├── materialien.js   # Materials section component
│   ├── news.js          # News section component
│   ├── newsItems.js     # List of news items (data file)
│   ├── products.js      # Products section component
│   ├── referansImg.js   # Reference images for different sections
│   ├── referenzen.js    # References section component
│   ├── team.js          # Team section component
│   ├── uberUns.js       # About us section component
│   ├── vision.js        # Vision section component
│   └── zertifikate.js   # Certificates section component
│
├── css/                 # CSS files for styling individual components
│   ├── aktivit.css      # Styling for Activities section
│   ├── artikel.css      # Styling for Article section
│   ├── carousel.css     # Styling for the Carousel
│   ├── components.css   # General component styles
│   ├── footer.css       # Styling for the Footer
│   ├── galerie.css      # Styling for Gallery section
│   ├── geschichte.css   # Styling for History section
│   ├── kontakt.css      # Styling for Contact section
│   ├── layout.css       # General layout and responsive design
│   ├── materialien.css  # Styling for Materials section
│   ├── news.css         # Styling for News section
│   ├── products.css     # Styling for Products section
│   ├── referenzen.css   # Styling for References section
│   ├── root.css         # Global CSS variables and base styles
│   ├── team.css         # Styling for Team section
│   ├── uberUns.css      # Styling for About us section
│   ├── vision.css       # Styling for Vision section
│   └── zertifikate.css  # Styling for Certificates section
│
├── js/
│   └── app.js           # Main JavaScript entry point for the project
│
├── index.html           # Main HTML file for the website
├── artikel.html         # HTML file for the article page
├── contact.php          # PHP file to handle form submissions
├── materialien.html     # HTML file for materials page
├── produkte.html        # HTML file for products page
├── README.md            # Project documentation
├── LICENSE              # License file
├── package.json         # Project dependencies
└── package-lock.json    # Lockfile for dependencies
```

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine
- Basic knowledge of HTML, CSS, and JavaScript

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repository-url.git
   ```

2. Navigate to the project folder:

   ```bash
   cd kuhlturm-ensotek
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

### Running the Project

1. You can serve the files locally using a local development server such as `Live Server` extension for VS Code or by using npm packages like `http-server`:

   ```bash
   npm install -g http-server
   http-server .
   ```

2. Visit `http://localhost:8080` (or whatever port the server indicates) to view the website locally.

### Project Structure Overview

- **Components**: All content is modularized into different components (in `components/` folder). These components are loaded dynamically using JavaScript.
  
- **CSS**: Each section of the site has its own CSS file for easier maintenance and modularity.

- **PHP (Contact Form)**: The form submission functionality is handled through a `contact.php` file located in the root directory.

### Key Features

- **Responsive Design**: The site is fully responsive, and optimized for different screen sizes (mobile, tablet, desktop).
- **Modular Components**: The website uses modular JavaScript components for better reusability and separation of concerns.
- **Custom CSS**: Each section has custom CSS that can be updated independently, ensuring flexibility.

## Usage

1. **Header and Navigation**: Located in `header.js`, this component creates the site's navigation and the logo section.
   
2. **Carousel**: The main slider or carousel is implemented in `carousel.js`, using custom JavaScript.
   
3. **Contact Form**: The contact form functionality is managed in `contact.php` and styled using `kontakt.css`.
   
4. **Gallery**: The gallery images can be added and managed in `galerie.js` and styled with `galerie.css`.

## Development

You can make changes in individual component files and CSS files. After making changes, refresh the local server to see updates.

### Adding New Components

1. Create a new component file in the `components/` folder.
2. Add relevant HTML, CSS, and JavaScript code.
3. Import and use the new component in the `index.html` or other related HTML files.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes.
4. Push the branch and open a pull request.

## License

This project is licensed under the MIT License.

---

