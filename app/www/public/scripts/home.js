
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

var clearWinner = function(slug) {
  $.ajax({
    url: '/api/clear/winner',
    type: 'POST',
    dataType: 'json',
    data: {
      category: slug
    },
    success: function(tallies) {
      getTallies();
      var selector = '#' + slug;
      $(selector).find('input[type=radio]').removeAttr('checked');
      $(selector).find('.nominee--info').removeClass('winner loser');
    },
    error: function(response) {
      console.log(response);
      Notifly.create({ 
        message: 'There was a problem',
        class: 'success',
        linger: 2500,
        fadeIn: 1250,
        fadeOut: 1250
      });
    }
  });
}

$("form").formjax({
  success: function(response) {
    getTallies();
  }
});

$(".clear-winner").on("click", function() {
  var categorySlug = $(this).data("category");
  clearWinner(categorySlug);
});

$("form input").on("change", function() {
  parentCatId = '#' + $(this).data('category');
  $(parentCatId).submit();
  $(parentCatId).find('.nominee--info').removeClass('winner').addClass('loser');
  $(this).parents('.nominee--info').removeClass('loser').addClass('winner');
});

getTallies();
