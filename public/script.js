(function (){
  //let ischild=false;
  $("#type").change(function(){
    if($('#type').val()=="Child") {
      $('#parentemail').append(`<h1>Parent's Email</h1>`);
      $('#parentemail').append(`<input type="text" id='email' name='email'/>`);
    }
    else {
      $('#parentemail').empty()
    }
  });
  
})();