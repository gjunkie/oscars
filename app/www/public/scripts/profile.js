
$("form").formjax();

$(document).ready(function() {
  $('select[name="colorpicker"]').simplecolorpicker({
    picker: true
  }).on('change', function() {
    var newColor = $('select[name="colorpicker"]').val()
    $('#color').val(newColor);
    $('.user-name').css('border-color', newColor);
  });;
  var color = $('#color').val();
  $('select[name="colorpicker"]').simplecolorpicker('selectColor', color);
});
