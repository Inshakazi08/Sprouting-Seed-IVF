(function ($) {
  "use strict";

  // WOW.js Init
  new WOW().init();

  // Spinner Hide
  const spinner = function () {
    setTimeout(() => {
      $('#spinner').length && $('#spinner').removeClass('show');
    }, 1);
  };
  spinner();

  // Sticky Navbar
  $(window).scroll(function () {
    const scrolled = $(this).scrollTop() > 300;
    $('.sticky-top').toggleClass('shadow-sm', scrolled).css('top', scrolled ? '0px' : '-100px');
  });

  // Back to Top Button
  $(window).scroll(function () {
    $('.back-to-top').fadeToggle($(this).scrollTop() > 300, 'slow');
  });

  $('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
    return false;
  });

  // Header Carousel
  $(".header-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1500,
    items: 1,
    dots: true,
    loop: true,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>'
    ]
  });

  // Testimonial Carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    margin: 24,
    dots: false,
    loop: true,
    nav: true,
    navText: [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>'
    ],
    responsive: {
      0: { items: 1 },
      992: { items: 2 }
    }
  });

})(jQuery);

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  // Appointment Form Submission
  const appointmentForm = document.getElementById("appointmentForm");
  if (appointmentForm) {
    appointmentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = appointmentForm.name?.value.trim();
      const email = appointmentForm.email?.value.trim();
      const phone = appointmentForm.phone?.value.trim();
      const date = appointmentForm.date?.value.trim();
      const time = appointmentForm.time?.value.trim();
      const message = appointmentForm.message?.value.trim();

      try {
        const res = await fetch("/appointmentForm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, date, time, message })
        });

        const result = await res.json();

        Swal.fire({
          icon: res.ok ? "success" : "error",
          title: res.ok ? "Appointment Booked!" : "Submission Failed",
          text: result.message || (res.ok ? "Your appointment has been submitted." : "Something went wrong."),
          confirmButtonColor: "#ff5722"
        });

        if (res.ok) appointmentForm.reset();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "Could not connect to the server.",
          confirmButtonColor: "#ff5722"
        });
      }
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = contactForm.name?.value.trim();
      const email = contactForm.email?.value.trim();
      const message = contactForm.message?.value.trim();

      try {
        const res = await fetch("/contactForm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message })
        });

        const result = await res.json();

        Swal.fire({
          icon: res.ok ? "success" : "error",
          title: res.ok ? "Message Sent!" : "Submission Failed",
          text: result.message || (res.ok ? "Thank you for contacting us." : "Please try again later."),
          confirmButtonColor: "#ff5722"
        });

        if (res.ok) contactForm.reset();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "Please check your connection.",
          confirmButtonColor: "#ff5722"
        });
      }
    });
  }
});

// Newsletter Subscription
function submitNewsletter() {
  const emailInput = document.getElementById('newsletter-email');
  const email = emailInput?.value.trim();

  if (!emailInput || !emailInput.checkValidity()) {
    emailInput?.reportValidity();
    return;
  }

  const allowedDomains = ['@gmail.com', '@yahoo.com', '@outlook.com'];
  const isValidDomain = allowedDomains.some(domain => email.endsWith(domain));

  if (!isValidDomain) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Email Domain',
      text: 'Use @gmail.com, @yahoo.com, or @outlook.com.',
      confirmButtonColor: '#ff5722'
    });
    return;
  }

  Swal.fire({
    title: 'Subscribing...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  fetch("/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
  .then(res => res.json())
  .then(data => {
    Swal.close();
    Swal.fire({
      icon: data.message ? 'success' : 'error',
      title: data.message ? 'Subscribed!' : 'Oops!',
      text: data.message || data.error || 'Something went wrong.',
      confirmButtonColor: '#ff5722'
    });
    if (data.message) emailInput.value = "";
  })
  .catch(() => {
    Swal.close();
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Something went wrong. Please try again.',
      confirmButtonColor: '#ff5722'
    });
  });
}

// Admin CSV Export (Token/Auth protected - do not expose passwords)
function downloadCSV(type) {
  const token = localStorage.getItem('adminToken');
  fetch(`/admin/export/${type}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => {
    if (!res.ok) throw new Error("Download failed");
    return res.blob();
  })
  .then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  })
  .catch(err => {
    Swal.fire({
      icon: "error",
      title: "Download Error",
      text: err.message,
      confirmButtonColor: "#ff5722"
    });
  });
}

// Logout Logic
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector(".btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin-login.html";
    });
  }
});

document.getElementById('searchButton').addEventListener('click', function() {
  const searchTerm = document.getElementById('searchInput').value.trim();

  // Make sure the input isn't empty
  if (searchTerm) {
    fetch(`/admin/search?term=${searchTerm}`, { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        // Handle and display the search results
        renderSearchResults(data);
      })
      .catch(error => console.error('Error:', error));
  } else {
    alert('Please enter a search term');
  }
});

function renderSearchResults(data) {
}

