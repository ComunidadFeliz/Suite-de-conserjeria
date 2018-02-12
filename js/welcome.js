const titleCase = function(string) {
  return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


$(function(){

  ipcRenderer.on('3MInput', function(e, data){
    if(remote.getGlobal('token') !== null && remote.getGlobal('actualCommunity') !== null && remote.getGlobal('actualProperty') !== null) {
      data.fullname = titleCase(data.fullname);
      fullname = data.fullname.split(" ");
      name = fullname[0];
      let sex;
      if(data.sex === "M") {
        sex = 'Masculino';
        $("#neutral-image").addClass('hidden');
        $("#woman-image").addClass('hidden');
        $("#man-image").removeClass('hidden');
        $(".message").html("<h1>Bienvenido, <span>"+name+"</span></h1>");
        setTimeout(function(){
          $("#neutral-image").removeClass('hidden');
          $("#woman-image").addClass('hidden');
          $("#man-image").addClass('hidden');
          $(".message").html("<h1>Haz <span>check-in</span> con tu carnet</h1>");
        }, 6000);
      } else if (data.sex === "F"){
        sex = 'Femenino';
        $("#neutral-image").addClass('hidden');
        $("#woman-image").removeClass('hidden');
        $("#man-image").addClass('hidden');
        $(".message").html("<h1>Bienvenida, <span>"+name+"</span></h1>");
        setTimeout(function(){
          $("#neutral-image").removeClass('hidden');
          $("#woman-image").addClass('hidden');
          $("#man-image").addClass('hidden');
          $(".message").html("<h1>Haz <span>check-in</span> con tu carnet</h1>");
        }, 6000);
      }

      if(data.fullname){
        let options = {
          url: remote.getGlobal('url_reference')+"/api/visitas",
          headers: {
            "Access-Token": remote.getGlobal('token'),
            "Community-id": remote.getGlobal('actualCommunity').index
          },
          json: {
            name: data.fullname,
            rut: data.rut,
            sex: sex,
            registered_at: new Date(),
            property_id: remote.getGlobal('actualProperty').index, 
          }
        }

        request.post(options, function(error, response, body) {
          if(!error && response.statusCode == 200) {
            console.log("register success!");
            console.log(body.guest_registry);
          } else {
            console.log(error);
          }
        });

      }
      
    }
  });

});