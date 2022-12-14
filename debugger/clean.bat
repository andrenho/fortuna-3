@echo off
set choice=
set /p choice=Are you sure you want to clean?
if NOT '%choice%'=='y' goto bye
git clean -fdx
:bye
