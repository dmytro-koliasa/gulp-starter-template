// placed this functions in DOMContentLoaded, since all you need to do to run it is to load the DOM
document.addEventListener('DOMContentLoaded', () => {
  // IIFE code wrapping
  (() => {

  })();
});


// placed this function in window.onload as there are style files needed in calculations
window.onload = () => {
  // Slider [Slick slider]
  (() => {
    let $slickElements = $('.js-slider');

    $slickElements.each((index, elem) => {

      const $status = $(elem).closest('.js-slider-wrapper').find(".js-arrow-count");

      $(elem).on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {

        const $count = `<div class="slider__current">${parseInt(slick.currentSlide + 1)}</div>/${slick.slideCount}`;

        $status.html($count);
      });

      let prev = $(elem).closest('.js-slider-wrapper').find('.js-arrow-prev');
      let next = $(elem).closest('.js-slider-wrapper').find('.js-arrow-next');

      $(elem).slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [{
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
            }
          }
        ],
        nextArrow: next,
        prevArrow: prev,
      });

    });
  })();

  // GALLERY [Magnific popup + Slick slider]
  (() => {
    $('.js-image-gallery').each(function () {
      var items = [];
      var $gallery = $(this);

      $gallery
        .find('.slick-slide:not(.slick-cloned)')
        .find('.js-image-gallery-link').each(function () {
          items.push($(this).attr('href'));
        });

      var uniqueItems = [];
      // Remove duplicates
      $.each(items, function (i, el) {
        if ($.inArray(el, uniqueItems) === -1) {
          uniqueItems.push(el);
        }
      });

      items = [];
      // Put in Magnific format
      $.each(uniqueItems, function (i, el) {
        items.push({
          src: el,
          type: 'image'
        });
      });

      // Assign an index to each link so the clicked one is shown first
      $gallery.find('.js-image-gallery-link').each(function () {
        var $a = $(this);
        $.each(items, function (i, el) {
          if (el.src == $a.attr('href')) {
            $a.data('index', i);
            return;
          }
        });
      });

      $gallery.on('click', '.js-image-gallery-link', function (e) {
        e.preventDefault();
        var $a = $(this);
        $.magnificPopup.open({
          type: 'image',
          items: items,
          gallery: {
            enabled: true
          }
        });
        $.magnificPopup.instance.goTo($a.data('index'));
      });

    });
  })();
}

$(document).ready(() => {
  $('.js-mask').inputmask({
    mask: "99-99-99-99",
  });

  // Popup [Custom - Native JS]
  const btns = document.querySelectorAll('.js-popup-open');
  const btnClose = document.querySelectorAll('.js-popup-close');

  btns.forEach(btn => {
    btn.addEventListener('click', e => {
      document.querySelector('.js-popup').classList.add('active');
      document.body.classList.add('withPopup');
    });
  });

  btnClose.forEach(btn => {
    btn.addEventListener('click', e => {
      document.querySelector('.js-popup').classList.remove('active');
      document.body.classList.remove('withPopup');
    });
  });


  // Sticky element [Custom - Native JS]
  // When the user scrolls the page, execute myFunction
  window.onscroll = function () {
    myFunction()
  };
  // Get the header
  var header = document.querySelector(".js-sticky");
  // Get the offset position of the navbar
  var sticky = header.offsetTop;
  // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
  function myFunction() {
    if (window.pageYOffset > 90) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }
});