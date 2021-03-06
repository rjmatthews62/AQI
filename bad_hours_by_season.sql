select dbo.aus_season(log_time) season,min(log_time) earliest,max(log_time) latest,count(*) hours from
(select log_time,max(pm25_1_hr) pm25 from aqi_hourly
  group by log_time
  having max(pm25_1_hr)>200) x
  group by dbo.aus_season(x.log_time) 

  