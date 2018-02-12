const electron = require('electron');
const { remote, ipcRenderer, shell } = electron;
const request = require('request');
const url = require('url');
const path = require('path');

$(function(){

  // $('#content').load("welcomeToEvent.html");  

  $("form").submit(function(e){
    e.preventDefault();

    // Validate email
    const email = document.querySelector("#email").value;
    if(email) {
      if(!email.includes("@")) {
        if($(".email-error")) $(".email-error").remove(); 
        $("#email-form").append("<label class='email-error'>Ingrese correo válido, debe contener @</label>");
        $("#email-form").addClass("has-error");
      }
    } else {
      if($(".email-error")) $(".email-error").remove(); 
      $("#email-form").append("<center class='email-error'><label>Ingrese su correo</label></center>");
      $("#email-form").addClass("has-error");
    }
    
    // Validates password
    const pwd = document.querySelector("#pwd").value;
    if(!pwd) {
      if($(".pwd-error")) $(".pwd-error").remove(); 
      $("#pwd-form").append("<center class='pwd-error'><label>Ingrese contraseña</label></center>");
      $("#pwd-form").addClass("has-error");
    }
    
    if(email && pwd) {
      request.post(remote.getGlobal('url_reference')+"/api/login",
      { json: { 
        email: email, 
        password: pwd 
        }
      }, function(error, response, body) {
        if(!error && response.statusCode == 200) {
          ipcRenderer.send('setToken', body.access_token);
          $('#content').load("selectProperty.html");  
        } else {
          if($(".form-error")) $(".form-error").remove(); 
          $(".end-of-form").before("<center class='form-error'><label>Correo o contraseña incorrectos</label></center>");
          console.log(error);
          document.querySelector('#pwd').value = "";
        };
      });
    }
  });

  $("#email").keyup(function(e){
    if($(".form-error")) $(".form-error").remove();
    if($(".email-error")) $(".email-error").remove();
    $("#email-form").removeClass("has-error");
  });
  $("#pwd").keyup(function(e){
    if($(".form-error")) $(".form-error").remove();
    if($(".pwd-error")) $(".pwd-error").remove(); 
    $("#pwd-form").removeClass("has-error");
  });
});