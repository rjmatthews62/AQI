USE [aqi]
GO
/****** Object:  UserDefinedFunction [dbo].[aus_season]    Script Date: 8/02/2020 10:55:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER FUNCTION [dbo].[aus_season](@d date)
RETURNS varchar(20)
AS
BEGIN
  DECLARE @year int
  DECLARE @month int
  DECLARE @result varchar(max)
  set @year=year(@d)
  set @month=month(@d)
  if @month=12 set @year=@year+1 
  if @month in (12,1,2) 
    set @result='1-Summer '
  else if @month in (3,4,5)
    set @result='2-Autumn'
  else if @month in (6,7,8)
    set @result='3-Winter'
  else 
    set @result='4-Spring'
  set @result=cast(@year as varchar(4))+' '+@result
  return @result
END
