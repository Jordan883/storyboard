(function (){
  //let ischild=false;
  $("#type").change(function(){
    if($('#type').val()=="Child") {
      $('#parentemail').empty()
      $('#parentemail').append(`<h1>Parent's Email</h1>`);
      $('#parentemail').append(`<input type="text" id='parentemail' name='parentemail'/>`);
    }
    else {
      $('#parentemail').empty()
      $('#parentemail').append(`<h1>Do you already have a parent account? If yes, type your email.</h1>`);
      $('#parentemail').append(`<input type="text" id='parentemail' name='parentemail'/>`);

    }
  });
  
})();