
let observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Element is entering the viewport
        console.log(entry.target.id + 'in');
      } else {
        // Element is leaving the viewport
        console.log(entry.target.id + 'out');
      }
    });
  }, {
    rootMargin: '5%'
  });
  
  document.querySelectorAll('.scene').forEach(item => {
    observer.observe(item);
  });