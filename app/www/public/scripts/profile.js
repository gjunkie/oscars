
$("form").formjax();

$(document).ready(function() {
  $('select[name="colorpicker"]').simplecolorpicker({
    picker: true
  }).on('change', function() {
    $('#color').val($('select[name="colorpicker"]').val());
  });;
  var color = $('#color').val();
  $('select[name="colorpicker"]').simplecolorpicker('selectColor', color);
});
