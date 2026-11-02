// Page Loader dismissal
function hideLoader() {
  if ($('#loader').length && $('#loader').is(':visible')) {
    if (window.gsap) {
      gsap.to('#loader', {
        duration: 1,
        yPercent: -100,
        y: 0,
        opacity: 0,
        ease: "power2.inOut",
        onComplete: function() {
          $('#loader').css('display', 'none');
        }
      });
      gsap.to('#header', { duration: 0, display: "block", delay: 0.5 });
    } else {
      $('#loader').fadeOut(500, function() {
        $(this).css('display', 'none');
      });
      $('#header').css('display', 'block');
    }
  }
}

$(window).on('load', function() {
  hideLoader();
});

// Fallback loader timer if window.load is delayed
setTimeout(function() {
  hideLoader();
}, 2500);

// Color panel switcher (if present)
$(function() {
  $('.color-panel').on("click", function(e) {
    e.preventDefault();
    $('.color-changer').toggleClass('color-changer-active');
  });

  $('.colors a').on("click", function(e) {
    e.preventDefault();
    var attr = $(this).attr("title");
    $('head').append('<link rel="stylesheet" href="css/' + attr + '.css">');
  });
});

// Navigation Menu Functions
function openNavigation() {
  var $nav = $('#navigation-content');
  $nav.css('display', 'flex');

  if (window.gsap) {
    gsap.to('#navigation-content', {
      duration: 0.6,
      yPercent: 0,
      y: 0,
      ease: "power2.out"
    });
  } else {
    $nav.css('transform', 'translateY(0%)');
  }
}

function closeNavigation(callback) {
  var $nav = $('#navigation-content');

  if (window.gsap) {
    gsap.to('#navigation-content', {
      duration: 0.6,
      yPercent: -100,
      y: 0,
      ease: "power2.in",
      onComplete: function() {
        if (typeof callback === 'function') {
          callback();
        }
      }
    });
  } else {
    $nav.css('transform', 'translateY(-100%)');
    if (typeof callback === 'function') {
      callback();
    }
  }
}

// Navigation Event Listeners
$(function() {
  // Ensure initial navigation position
  if (window.gsap) {
    gsap.set('#navigation-content', { yPercent: -100, y: 0 });
  }

  // Open menu on menubar click
  $('.menubar').on('click', function(e) {
    e.preventDefault();
    openNavigation();
  });

  // Close menu on close icon click
  $('.navigation-close').on('click', function(e) {
    e.preventDefault();
    closeNavigation();
  });

  // Close menu on navigation logo click
  $('#navigation-content .logo img').on('click', function(e) {
    e.preventDefault();
    closeNavigation();
  });

  // Close menu on Escape key press
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      closeNavigation();
    }
  });

  // Section transition handler
  function navigateToSection(targetSelector) {
    var $target = $(targetSelector);

    // If target doesn't exist on page
    if (!$target.length) {
      closeNavigation(function() {
        if (targetSelector === '#contact') {
          window.location.href = 'mailto:contact@asadullahdahri.com';
        }
      });
      return;
    }

    // Target exists: close menu and run transition
    closeNavigation(function() {
      if ($('#breaker').length && $('#breaker-two').length && window.gsap) {
        gsap.to('#breaker', 0, { display: "block" });
        gsap.to('#breaker-two', 0, { display: "block", delay: 0.1 });
        gsap.to('#header, #about, #services, #portfolio, #blog, #contact', 0, { display: "none" });
        gsap.to(targetSelector, 0, {
          display: "block",
          delay: 0.7,
          onComplete: function() {
            window.scrollTo(0, 0);
          }
        });
        gsap.to('#breaker', 0, { display: "none", delay: 1.5 });
        gsap.to('#breaker-two', 0, { display: "none", delay: 1.5 });
      } else {
        $('#header, #about, #services, #portfolio, #blog, #contact').hide();
        window.scrollTo(0, 0);
        $target.fadeIn(400);
      }
    });
  }

  // Navigation Links click events
  $('#home-link').on('click', function(e) {
    e.preventDefault();
    navigateToSection('#header');
  });

  $('#about-link').on('click', function(e) {
    e.preventDefault();
    navigateToSection('#about');
  });

  $('#services-link').on('click', function(e) {
    e.preventDefault();
    navigateToSection('#services');
  });

  $('#portfolio-link').on('click', function(e) {
    e.preventDefault();
    navigateToSection('#portfolio');
  });

  $('#blog-link').on('click', function(e) {
    e.preventDefault();
    navigateToSection('#blog');
  });

  $('#contact-link').on('click', function(e) {
    e.preventDefault();
    navigateToSection('#contact');
  });
});

// Typewriter / Text Rotate Animation
$(function() {
  var TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  };

  TxtRotate.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 100;
    }

    setTimeout(function() {
      that.tick();
    }, delta);
  };

  var elements = document.getElementsByClassName('txt-rotate');
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }

  // Inject cursor CSS for typewriter
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0em solid #666 ; }";
  document.body.appendChild(css);
});

// Custom Cursor mover and hover effects
$(function() {
  var $cursor = $('.cursor');
  if (!$cursor.length) return;

  function cursormover(e) {
    if (window.gsap) {
      gsap.to($cursor, {
        x: e.clientX,
        y: e.clientY,
        stagger: 0.002
      });
    } else {
      $cursor.css({
        left: e.clientX + 'px',
        top: e.clientY + 'px'
      });
    }
  }

  function cursorhover() {
    if (window.gsap) {
      gsap.to($cursor, {
        scale: 1.4,
        opacity: 1
      });
    }
  }

  function cursorreset() {
    if (window.gsap) {
      gsap.to($cursor, {
        scale: 1,
        opacity: 0.6
      });
    }
  }

  $(window).on('mousemove', cursormover);
  $('.menubar').hover(cursorhover, cursorreset);
  $('a').hover(cursorhover, cursorreset);
  $('.navigation-close').hover(cursorhover, cursorreset);
});
