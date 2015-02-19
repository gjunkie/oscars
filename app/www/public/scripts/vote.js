$("form").formjax({
  success: function(response) {
    Notifly.create({ 
      message: 'Your vote was recorded',
      class: 'success',
      linger: 2500,
      fadeIn: 1250,
      fadeOut: 1250
    });
  },
  error: function(response) {
    Notifly.create({ 
      message: 'Shoot! There was an error!',
      class: 'error',
      linger: 2500,
      fadeIn: 1250,
      fadeOut: 1250
    });
  }
});

$("form input").on("change", function() {
  $(this).parents('form').submit();
});
