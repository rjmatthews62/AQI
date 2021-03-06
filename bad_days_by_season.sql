select dbo.aus_season(log_date) season,min(log_date) earliest,max(log_date) latest,count(*) days from
(select log_date,max(pm25_1_hr) pm25 from aqi_hourly
  group by log_date
  having max(pm25_1_hr)>200) x
  group by dbo.aus_season(x.log_date) 

  