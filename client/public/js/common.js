$(document).ready(function() {
    $('button').prop('disabled', true);
    $('input').on('keyup',function() {
       if($('input[type="text"]').val() != '' && $('input[type="email"]').val() != '' && $('input[type="password"]').val() != '') {
          $('button').prop('disabled', false);
          $("button").addClass("btn-enable");
       }
    });
   
});