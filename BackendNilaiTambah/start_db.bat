@echo off
start "" "d:\laragon\bin\mysql\mysql-8.0.30-winx64\bin\mysqld.exe" --datadir="%~dp0mysql_data" --port=3307 --console
echo Database started on port 3307.
