<?php
#echo "Pinging BOM\n";
function getreq($key,$def='')
{
  if (isset($_REQUEST[$key])) return $_REQUEST[$key];
  return $def;
}

function getDistanceFromLatLonInKm($lat1, $lon1, $lat2, $lon2) {
    $R = 6371; // Radius of the earth in km
    $dLat = deg2rad($lat2 - $lat1);  // deg2rad below
    $dLon = deg2rad($lon2 - $lon1);
    $a =
        sin($dLat / 2) * sin($dLat / 2) +
        cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
        sin($dLon / 2) * sin($dLon / 2)
        ;
    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
    $d = $R * $c; // Distance in km
    return $d;
}

const URL_WEATHER = "ftp://ftp.bom.gov.au/anon/gen/fwo/IDN60920.xml";
const CANBERRA = [-35.2812958, 149.124822];

$url=URL_WEATHER;
//print("Fetching document...");
$data=file_get_contents($url);
//print("Document loaded.".strlen($data)."\n");
$xmlDoc = new DOMDocument();
$xmlDoc->loadXML($data);
//print("Parsed\n");
$xpath=new DOMXPath($xmlDoc);
$dest=Array();
foreach ($xmlDoc->getElementsByTagName("station") as $station) {
    $lat=$station->getAttribute("lat");
    $lon=$station->getAttribute("lon");
    $d=getDistanceFromLatLonInKm(CANBERRA[0],CANBERRA[1],$lat,$lon);
    if ($d<=60)  {
        $reading=Array();
//        print("Station: ".$station->getAttribute("stn-name")." ($lat,$lon) ($d)\n");
        $reading["wmo"]=$station->getAttribute("wmo-id");
        $reading["name"]=$station->getAttribute("stn-name");
        $reading["lat"]=$lat;
        $reading["lon"]=$lon;
        $period=$xpath->query("period",$station)[0];
        $reading["datetime"]=$period->getAttribute("time-local");
        foreach ($xpath->query("level[@index='0']/element",$period) as $element) {
            $reading[$element->getAttribute("type")]=$element->nodeValue;
        }
        $dest[]=$reading;
        
    }
}
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate');     // HTTP/1.1
header('Cache-Control: pre-check=0, post-check=0, max-age=0');    // HTTP/1.1
header ("Pragma: no-cache");
header("Access-Control-Allow-Origin: *");
print(json_encode($dest));
?>
