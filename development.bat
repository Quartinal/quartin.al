@echo off
echo This is a DEVELOPMENT file. You should not be running this file in production or on Linux.
v main.v
for %%f in ("main.*") do (
    echo Running %%f
    %%f
)