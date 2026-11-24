const menuButton = document.querySelector(".menu-toggle");
const navPanel = document.querySelector(".nav-panel");
const siteHeader = document.querySelector(".site-header");
const preloader = document.querySelector(".preloader");

if (preloader) {
  window.setTimeout(() => {
    preloader.classList.add("is-hidden");
    preloader.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("is-loading");
    window.setTimeout(() => preloader.remove(), 400);
  }, 1500);
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navPanel.classList.toggle("open", !isOpen);
});

navPanel.addEventListener("click", (event) => {
  if (event.target.closest("a") && window.matchMedia("(max-width: 640px)").matches) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navPanel.classList.remove("open");
  }
});

window.addEventListener(
  "scroll",
  () => siteHeader.classList.toggle("scrolled", window.scrollY > 8),
  { passive: true },
);

document.querySelector("#year").textContent = new Date().getFullYear();

const slideshow = document.querySelector(".semiconductor-slideshow");

if (slideshow) {
  const slides = [...slideshow.querySelectorAll(".slideshow-slide")];
  const dots = [...slideshow.querySelectorAll(".slideshow-dots button")];
  const previousButton = slideshow.querySelector(".slideshow-prev");
  const nextButton = slideshow.querySelector(".slideshow-next");
  let currentSlide = 0;
  let slideshowTimer;

  const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === currentSlide);
    });
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentSlide;
      dot.classList.toggle("active", isActive);
      dot.toggleAttribute("aria-current", isActive);
    });
  };

  const restartTimer = () => {
    window.clearInterval(slideshowTimer);
    slideshowTimer = window.setInterval(() => showSlide(currentSlide + 1), 5000);
  };

  previousButton.addEventListener("click", () => {
    showSlide(currentSlide - 1);
    restartTimer();
  });

  nextButton.addEventListener("click", () => {
    showSlide(currentSlide + 1);
    restartTimer();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      restartTimer();
    });
  });

  const lightbox = document.querySelector(".slideshow-lightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const lightboxClose = lightbox?.querySelector(".lightbox-close");
  const lightboxPrevious = lightbox?.querySelector(".lightbox-prev");
  const lightboxNext = lightbox?.querySelector(".lightbox-next");

  const showExpandedImage = (index) => {
    showSlide(index);
    lightboxImage.src = slides[currentSlide].querySelector("img").src;
    lightboxImage.alt = slides[currentSlide].querySelector("img").alt;
  };

  slideshow.querySelector(".slideshow-track").addEventListener("click", () => {
    showExpandedImage(currentSlide);
    window.clearInterval(slideshowTimer);
    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    } else {
      lightbox.setAttribute("open", "");
    }
  });

  lightboxClose?.addEventListener("click", () => lightbox.close());
  lightboxPrevious?.addEventListener("click", () => showExpandedImage(currentSlide - 1));
  lightboxNext?.addEventListener("click", () => showExpandedImage(currentSlide + 1));
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox?.addEventListener("close", restartTimer);

  slideshow.addEventListener("mouseenter", () => window.clearInterval(slideshowTimer));
  slideshow.addEventListener("mouseleave", restartTimer);
  restartTimer();
}

const contactForm = document.querySelector("#contact-form");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const message = [
    `Name: ${formData.get("firstName")} ${formData.get("lastName")}`,
    `Email: ${formData.get("email")}`,
    "",
    `Message: ${formData.get("message") || "No additional message provided."}`,
  ].join("\n");
  const subject = `Website inquiry from ${formData.get("firstName")} ${formData.get("lastName")}`;
  const emailLink = `mailto:customer_service@novelsolutions.tech?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  const status = document.querySelector("#contact-status");

  status.textContent = "Opening your email app. Review and send the message there to complete your inquiry.";
  window.location.href = emailLink;
});
