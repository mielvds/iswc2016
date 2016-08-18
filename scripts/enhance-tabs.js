$(function() {

  /* Tabs fix for bootstrap */
  var hash = window.location.hash;
  hash && $('ul.nav a[href="' + hash + '"]').tab('show');

  $('.nav-pills a').click(function (e) {
    $(this).tab('show');

    var scrollmem = $('body').scrollTop() || $('html').scrollTop();
    window.location.hash = this.hash;
    $('html,body').scrollTop(scrollmem);
  });

  $('.previous a, .next a').click(function (e) {
    $('ul.nav a[href="' + this.hash + '"]').tab('show');

    $('html,body').scrollTop(0);
  });
});
