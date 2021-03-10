const checkParams=() => {

        var modal=$('#sidebarModal');
        $('#sidebar').click(function(e) {
          var edit_url = $(this).attr('href');
          modal.load(edit_url + ' #content',function(){
            modal.dialog("open");
          });
        });
        // modal.dialog({ autoOpen: false, title: "Your title", draggable: true,
        // resizable: false, modal: true, width:'auto'});

    });


const checkParams = () => {
  // 1. Obtienes la URL actual
  // 2. Revisas los params (query strings)
  // 3. IF existe el param `modal=true`
  // 4. entonces abres el modal
}
