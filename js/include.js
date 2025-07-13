document.addEventListener('DOMContentLoaded', () => {
    const partials = [
        { placeholder: 'navbar-placeholder', file: 'partials/navbar.html' },
        { placeholder: 'home-placeholder', file: 'partials/home.html' },
        { placeholder: 'about-placeholder', file: 'partials/about.html' },
        { placeholder: 'skills-placeholder', file: 'partials/skills.html' },
        { placeholder: 'contact-placeholder', file: 'partials/contact.html' },
        { placeholder: 'footer-placeholder', file: 'partials/footer.html' }
    ];

    partials.forEach(partial => {
        fetch(partial.file)
            .then(response => response.text())
            .then(data => {
                document.getElementById(partial.placeholder).innerHTML = data;
            })
            .catch(error => console.error(`Error loading ${partial.file}:`, error));
    });
});