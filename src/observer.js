
let observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Element is entering the viewport
      } else {
        // Element is leaving the viewport
      }
    });
  }, {
    rootMargin: '5%'
  });
  
  document.querySelectorAll('.scene').forEach(item => {
    observer.observe(item);
  });