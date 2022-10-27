# Results

```
winstonFile*1000: 965.765ms
winstonTwoFiles*1000: 877.761ms
winstonStream*1000: 1.804s
winstonTwoStreams*1000: 896.987ms
pinoDestination*1000: 305.529ms
pinoTwoDestinations*1000: 645.479ms
pinoTransportOneTarget*1000: 367.194ms
pinoTransportTwoTargets*1000: 364.595ms
```

Improvements:
- \>200% improvement over winston
- with transports, the overhead is offloaded from the application process
