$(document).on('ready', function() {
  var elementHeight = {},
      lastScrollTop = 0;

  elementHeight.uol = 44;
  elementHeight.espn = 50;
  elementHeight.secondaryMenu = $('.secondary-menu').height();
  elementHeight.wholeMenu = $('header#top').height() + 44 // UOL;

  $('#container').css('marginTop', elementHeight.wholeMenu);


  $(window).on('scroll touchmove', function() {
    var scrollTopHeight = $(this).scrollTop();

    if (scrollTopHeight >= elementHeight.uol + elementHeight.espn) {
      $('body').addClass('past-header');
    } else {
      $('body').removeClass('past-header');
    }

    if (scrollTopHeight < lastScrollTop) {
      // downscroll code
      $('body').addClass('scroll-up');
    } else {
      $('body').removeClass('scroll-up');
    }
    lastScrollTop = scrollTopHeight;
  });
});
