from urllib.request import urlopen
import urllib.parse 
import json
from datetime import datetime
from datetime import timedelta

# docs=https://dev.socrata.com/foundry/www.data.act.gov.au/94a5-zqnn
# Get the dataset
endpoint = 'https://www.data.act.gov.au/resource/94a5-zqnn.json'
fromdate=datetime.now()-timedelta(hours=48)
#url=endpoint+"?name=Florey&$where=date>='"+fromdate.strftime("%Y-%m-%dT%H:00:00")+"'"
url=endpoint+"?$where=date>='"+fromdate.strftime("%Y-%m-%dT%H:00:00")+"'"
url+="&$order="+urllib.parse.quote_plus("datetime DESC")
print(url)
response = urlopen(url)
result=response.read().decode('utf-8')
js=json.loads(result)
for rec in js:
    if not 'pm2_5' in rec:
        rec['pm2_5']='???'
    print(rec['name'],rec['datetime'],rec['pm2_5'])
