
$("form").formjax();

$("form input").on("change", function() {
  $(this).parents('form').submit();
  $('.nominee--info').addClass('loser');
  $(this).parents('.nominee--info').removeClass('loser').addClass('winner');
});

