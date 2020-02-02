<?php
#echo "Pinging BOM\n";
function getreq($key,$def='')
{
  if (isset($_REQUEST[$key])) return $_REQUEST[$key];
  return $def;
}

$station=getreq('station',"94926");
$url="http://reg.bom.gov.au/fwo/IDN60903/IDN60903.$station.json";
$data=file_get_contents($url);
$json=json_decode($data);
$header=$json->observations->header[0];
$data=$json->observations->data[0];
#print($header->ID." ".$header->name." Wind=".$data->wind_dir." ".$data->wind_spd_kmh."km Temp=".$data->air_temp." Rain=".$data->rain_trace."\n");
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate');     // HTTP/1.1
header('Cache-Control: pre-check=0, post-check=0, max-age=0');    // HTTP/1.1
header ("Pragma: no-cache");
header("Access-Control-Allow-Origin: *");
print(json_encode($data));
?>
