
var getTallies = function() {
  $.ajax({
    url: '/api/user/tallies',
    type: 'GET',
    dataType: 'json',
    success: function(tallies) {
      $('.tallies ul').html('');
      for (var i = 0; k = tallies.length, i < k; i++) {
        $('.tallies ul').append('<li><span class="user-mark" style="background-color: '+tallies[i].color+'"></span>'+tallies[i].name+': '+tallies[i].tally+'</li>');
      }
    },
    error: function(response) {
      console.log('error getting tallies');
    }
  });
}
$("form").formjax({
  success: function(response) {
    getTallies();
  }
});

$("form input").on("change", function() {
  parentCatId = '#' + $(this).data('category');
  $(parentCatId).submit();
  $(parentCatId).find('.nominee--info').addClass('loser');
  $(this).parents('.nominee--info').removeClass('loser').addClass('winner');
});

// get tallies on page load
getTallies();
