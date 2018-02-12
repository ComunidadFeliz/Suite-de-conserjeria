$(function() {
    if(remote.getGlobal('token') !== null) {
      let options = {
        url: remote.getGlobal('url_reference')+"/api/comunidades",
        headers: {
          "Access-Token": remote.getGlobal('token')
        }
      };
  
      // Get communities
      request.get(options, function(error, response, body) {
        if(!error && response.statusCode == 200) {
          let $communities = $('#selCom');
          const b = JSON.parse(body);
          ipcRenderer.send('resetCommunities');
          b.communities_names.forEach(function(community) {
            $communities.append('<option>'+community.name+'</option>');
            ipcRenderer.send('setCommunities', community);
          });
          $(".selectpicker").selectpicker();
        } else {
          console.log(error);
        }
      });
    }

    $("#sel-prop-btn").on('click', function() {
      let selected_property = $("#selProp").find(":selected").text();
      index = remote.getGlobal('properties').findIndex(x => x.name===selected_property);
      data = remote.getGlobal('properties')[index];
      console.log(data);
      ipcRenderer.send('setProperty', data);
      $("#property-footer-text").text("Comunidad "+data.name);
      $('#content').load("welcomeToEvent.html");
    });
  
    $("#sel-com-btn").on('click', function() {
      let selected_community = $("#selCom").find(":selected").text();
      index = remote.getGlobal('communities').findIndex(x => x.name===selected_community);
      data = remote.getGlobal('communities')[index];
      console.log(data);
      ipcRenderer.send('setActualCommunity', data);
      
     
      let options = {
        url: remote.getGlobal('url_reference')+"/api/propiedades",
        headers: {
          "Access-Token": remote.getGlobal('token'),
          "Community-id": remote.getGlobal('actualCommunity').index
        }
      };
    
      request.get(options, function(error, response, body) {
        if(!error && response.statusCode == 200) {
          const b = JSON.parse(body);
          ipcRenderer.send('resetProperties');
          $('#selProp').selectpicker();
          b.properties.forEach(function(property) {
            ipcRenderer.send('setProperties', property);
            $('#selProp').append('<option value='+property.name+'>'+property.name+'</option>');
            $('#selProp').selectpicker('refresh');
          });
          $(".select-community-div").addClass('hidden');
          $(".select-property-div").removeClass('hidden');
          
        } else {
          console.log(error);
        }
      });
    })
  
  });
  