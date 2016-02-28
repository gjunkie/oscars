
var getTallies = function() {
  $.ajax({
    url: '/api/user/tallies',
    type: 'GET',
    dataType: 'json',
    success: function(tallies) {
      $('.tallies ul').html('');
      for (var i = 0; k = tallies.length, i < k; i++) {
        var color = tallies[i].color || '#E0E0E0';
        $('.tallies ul').append('<li data-user="'+tallies[i].id+'"><span class="user-mark" style="background-color: '+color+'"></span>'+tallies[i].name+': '+tallies[i].tally+'</li>');
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


$(".categories--category h2").on("click", function() {
  $(this).parent().toggleClass('active');
});


var prevTallyUser = null;
$(".tallies").on("click", 'li', function() {
  var user = $(this).data('user');
  if (prevTallyUser != user) {
    $(this).parent().find('li').addClass('inactive');
    $(this).removeClass('inactive');
    $('.nominee--votes a').addClass('inactive');
    $('.nominee--votes').find('[data-user="'+user+'"]').removeClass('inactive');
    $('.nominee--favorites a').addClass('inactive');
    $('.nominee--favorites').find('[data-user="'+user+'"]').removeClass('inactive');
    prevTallyUser = user;
  } else {
    $(this).parent().find('li').removeClass('inactive');
    $('.nominee--votes a').removeClass('inactive');
    $('.nominee--favorites a').removeClass('inactive');
    prevTallyUser = null;
  }
});

$('.tallies').on("mouseenter", "li", function() {
  var user = $(this).data('user');
  $('.nominee--votes a').addClass('hoverInactive');
  $('.nominee--votes').find('[data-user="'+user+'"]').removeClass('hoverInactive');
  $('.nominee--favorites a').addClass('hoverInactive');
  $('.nominee--favorites').find('[data-user="'+user+'"]').removeClass('hoverInactive');
});

$('.tallies').on("mouseleave", "li", function() {
  var user = $(this).data('user');
  $('.nominee--votes a').removeClass('hoverInactive');
  $('.nominee--favorites a').removeClass('hoverInactive');
});

$(".tallies").hover(function() {
  $(this).addClass('active');
}, function(){
  $(this).removeClass('active');
});

$(".tallies .pin").on("click", function() {
  console.log('click pin');
  $('.tallies').toggleClass('pinned');
});

$(".toggle-switches span").on("click", function() {
  if ($(this).hasClass('expand')) {
    $('.categories--category').addClass('active');
  } else {
    $('.categories--category').removeClass('active');
  }
});

$("form input").on("change", function() {
  parentCatId = '#' + $(this).data('category');
  $(parentCatId).submit();
  $(parentCatId).find('.nominee--info').removeClass('winner').addClass('loser');
  $(this).parents('.nominee--info').removeClass('loser').addClass('winner');
});

var clock = document.getElementById("time")
var targetDate = new Date('Sun Feb 28 2016 17:30:00 GMT-0800 (PST)');
var now = new Date();

console.log(targetDate)
console.log(now)
console.log(now < targetDate)
if (now < targetDate) {
  clock.innerHTML = countdown(targetDate).toString();
  setInterval(function(){
    if (now < targetDate) {
      clock.innerHTML = countdown(targetDate).toString();
      now = new Date();
    } else {
      $('.deadline').hide();
    }
  }, 1000);
}

getTallies();
