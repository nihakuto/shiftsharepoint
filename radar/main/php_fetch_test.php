<?php
   $json = file_get_contents("https://dexonline.ro/definitie/skate?format=json");
?>
<!DOCTYPE html>
<html>
<head>
    <title>test</title>
</head>
<body>
<script>
// function getTitle(externalUrl){
//   var proxyurl = "http://localhost/get_external_content.php?url=" + externalUrl;
//   $.ajax({
//     url: proxyurl,
//     async: true,
//     success: function(response) {
//       alert(response);
//     },   
//     error: function(e) {
//       alert("error! " + e);
//     }
//   });
// }
// getTitle('https://dexonline.ro/definitie/skate?format=json')

    var json = <?php echo $json; ?>;
    document.body.onload = function(){
        document.write(json.word);//return Skate
    };
</script>
</body>
</html>