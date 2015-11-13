#!C:\Users\Lundi\Miniconda2\python.exe -u
#!/usr/bin/python

import scipy.stats as stats
import cgi

print "Content-type:text/html\r\n\r\n"

param_dict = {}

arguments = cgi.FieldStorage()

for i in arguments.keys():
    #print i
    param_dict[str(i)] = float(arguments[i].value)
print param_dict

#SEBeta = float(arguments[0].value)

#beta = float(arguments[1].value)


print stats.t.sf(abs(param_dict['beta'] / param_dict['SEBeta']), 14)*2
