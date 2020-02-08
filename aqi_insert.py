from urllib.request import urlopen
import urllib.parse 
import json
from datetime import datetime
from datetime import timedelta

# docs=https://dev.socrata.com/foundry/www.data.act.gov.au/94a5-zqnn
# Get the dataset
endpoint = r"https://www.data.act.gov.au/resource/ufvu-jybu.json?$where=datetime%3E=%272020-01-20T09:00:00.000%27&$order=datetime"
fromdate=datetime.now()-timedelta(hours=48)
#url=endpoint+"?name=Florey&$where=date>='"+fromdate.strftime("%Y-%m-%dT%H:00:00")+"'"
#url=endpoint+"?$where=date>='"+fromdate.strftime("%Y-%m-%dT%H:00:00")+"'"
#url+="&$order="+urllib.parse.quote_plus("datetime DESC")
url=endpoint
#print(url)
response = urlopen(url)
result=response.read().decode('utf-8')
js=json.loads(result)
for rec in js:
    fields=""
    data=""
    for k in rec.keys():
        f=k
        if k=='datetime': f='log_time'
        elif k=='date': f='log_date'
        elif k=='time': f='log_tm'
        elif k=='pm2_5_1_hr': f='pm25_1_hr'
        elif k=='pm2_5_24hr_rolling': f='pm25_24hr_rolling'
        if fields!="": fields+=","
        fields+=f
        if data!="": data+=","
        data+="'"+rec[k]+"'"
    print("insert into aqi_hourly("+fields+") values ("+data+");")
