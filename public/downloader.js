$(document).ready(function(){
    

   const urlParams = new URLSearchParams(window.location.search);
   const code = urlParams.get('code');
   const redirect_uri = "https://torrent-2-gdrive.herokuapp.com/downloader" // replace with your redirect_uri;
// const redirect_uri = "http://localhost:3000/downloader"
   const client_secret = "NGteP4yLLi5cJJYxL6OzvNeo"; // replace with your client secret
   const scope = "https://www.googleapis.com/auth/drive";
   var access_token= "";
   var client_id = "508180742878-29lmfjuvj9n86vkh0aph9lu4hghs0me8.apps.googleusercontent.com"// replace it with your client id;
   

   $.ajax({
       type: 'POST',
       url: "https://www.googleapis.com/oauth2/v4/token",
       data: {code:code
           ,redirect_uri:redirect_uri,
           client_secret:client_secret,
       client_id:client_id,
       scope:scope,
       grant_type:"authorization_code"},
       dataType: "json",
       success: function(resultData) { 
          localStorage.setItem("accessToken",resultData.access_token);
          localStorage.setItem("refreshToken",resultData.refreshToken);
          localStorage.setItem("expires_in",resultData.expires_in);
          window.history.pushState({}, document.title, "/downloader"); 
       }
 });

   function stripQueryStringAndHashFromPath(url) {
       return url.split("?")[0].split("#")[0];
   }   

   var Upload = function (file) {
       this.file = file;
   };
   
   Upload.prototype.getType = function() {
       localStorage.setItem("type",this.file.type);
       return this.file.type;
   };
   Upload.prototype.getSize = function() {
       localStorage.setItem("size",this.file.size);
       return this.file.size;
   };
   Upload.prototype.getName = function() {
       return this.file.name;
   };
   Upload.prototype.doUpload = function () {
       var that = this;
       var formData = new FormData();
   
       // add assoc key values, this will be posts values
       formData.append("file", this.file, this.getName());
       formData.append("upload_file", true);
   
       $.ajax({
           header: "Access-Control-Allow-Origin: *",
           type: "POST",
           beforeSend: function(request) {
               request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
               
           },
           url: "https://www.googleapis.com/upload/drive/v2/files",
           data:{
               uploadType:"media"
           },
           xhr: function () {
               var myXhr = $.ajaxSettings.xhr();
               if (myXhr.upload) {
                   myXhr.upload.addEventListener('progress', that.progressHandling, false);
               }
               return myXhr;
           },
           success: function (data) {
               console.log(data);
           },
           error: function (error) {
               console.log(error);
           },
           async: true,
           data: formData,
           cache: false,
           contentType: false,
           processData: false,
           timeout: 60000
       });
   };
   
   Upload.prototype.progressHandling = function (event) {
       var percent = 0;
       var position = event.loaded || event.position;
       var total = event.total;
       var progress_bar_id = "#progress-wrp";
       if (event.lengthComputable) {
           percent = Math.ceil(position / total * 100);
       }
       // update progressbars classes so it fits your code
       $(progress_bar_id + " .progress-bar").css("width", +percent + "%");
       $(progress_bar_id + " .status").text(percent + "%");
   };

   $("#upload").on("click", function (e) {
       var file = $("#files")[0].files[0];
       console.log(file);
       var upload = new Upload(file);
   
       // maby check size or type here with upload.getSize() and upload.getType()
   
       // execute upload
       upload.doUpload();
   });
});