$PSDefaultParameterValues["Out-File:Encoding"] = "utf8"
gperf .\builtins.gperf -c -t > builtins.h
gperf .\aliases.gperf -c -t > aliases.h