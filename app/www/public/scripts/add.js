
$('form').formjax({
  success: function(response) {
    console.log(response);
    console.log($(this));
  }
});
