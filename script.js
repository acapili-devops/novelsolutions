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

const contactForm = document.querySelector("#contact-form");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const phoneInput = contactForm.elements.namedItem("contactNumber");
  const phoneDigits = phoneInput.value.replace(/\D/g, "");
  phoneInput.setCustomValidity(
    phoneDigits.length >= 7 && phoneDigits.length <= 15
      ? ""
      : "Enter a phone number with 7 to 15 digits.",
  );

  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const message = [
    `Name: ${formData.get("firstName")} ${formData.get("lastName")}`,
    `Email: ${formData.get("email")}`,
    `Contact number: ${formData.get("contactNumber")}`,
    "",
    `Message: ${formData.get("message") || "No additional message provided."}`,
  ].join("\n");
  const subject = `Website inquiry from ${formData.get("firstName")} ${formData.get("lastName")}`;
  const emailLink = `mailto:info@novelsolutions.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  const status = document.querySelector("#contact-status");

  status.textContent = "Opening your email app. Review and send the message there to complete your inquiry.";
  window.location.href = emailLink;
});

contactForm?.elements.namedItem("contactNumber").addEventListener("input", (event) => {
  const phoneDigits = event.currentTarget.value.replace(/\D/g, "");
  event.currentTarget.setCustomValidity(
    !event.currentTarget.value ||
      (phoneDigits.length >= 7 && phoneDigits.length <= 15)
      ? ""
      : "Enter a phone number with 7 to 15 digits.",
  );
});
