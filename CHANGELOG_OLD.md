# Older changes
## 0.3.2 (2022-12-16)
* (HGlab01) Add feature to find cheapest stations over all locations (#365)
* (HGlab01) Bump ioBroker-jsonExplorer to 0.1.10
* (HGlab01) Bump axios to 1.2.1

## 0.3.1 (2022-10-25)
* (HGlab01) Add option to exclude closed gas stations (#407)

## 0.3.0 (2022-08-30)
* (HGlab01) !Breaking change! NodeJS 14.16 or higher required
* (HGlab01) !Breaking change! ioBroker js-controller 4.0 or higher required
* (HGlab01) Bump is-online from 9.0.1 to 10.0.0

## 0.2.10 (2022-02-24)
* (HGlab01) Bump iobroker-jsonexplorer to v0.1.9
* (HGlab01) js-controller 4.0 readiness

## 0.2.9 (2021-11-29)
* (HGlab01) Bump iobroker-jsonexplorer to v0.1.8
* (HGlab01) Replace ping-based internet-check with isOnline library

## 0.2.8 (2021-11-16)
* (HGlab01) Bump iobroker-jsonexplorer to v0.1.7
* (HGlab01) Improve error handling

## 0.2.7 (2021-10-16)
* (HGlab01) Bump iobroker-jsonexplorer to v0.1.2
* (HGlab01) don't report getaddrinfo issue on Sentry (IOBROKER-FUELPRICEMONITOR-2)
* (HGlab01) add attribute 'uuid' (IOBROKER-FUELPRICEMONITOR-1B)

## 0.2.6 (2021-07-24)
* (HGlab01) Bump iobroker-jsonexplorer to v0.1.1
* (HGlab01) Check internet connection on startup

## 0.2.5 (2021-04-30)
* (HGlab01) improve for js-controller v3.3.1
* (HGlab01) Bump iobroker-jsonexplorer to v0.0.0-19

## 0.2.4 (2021-04-21)
* (HGlab01) add feature (experimental!) to sort by ID instead of price (helps to monitor one specific gas station)
* (HGlab01) add attributes 'from', 'to', 'day' and 'orders'
* (HGlab01) Bump iobroker-jsonexplorer to v0.0.0-18

## 0.2.3 (2021-03-26)
* (HGlab01) switch library from deprecated "request" to "axios"

## 0.2.2 (2021-03-13)
* (HGlab01) improve error handling and debug log

## 0.2.1 (2021-03-08)
* (HGlab01) Bump js-controller to 3.2.16 for proper device/channel/state deletion
* (HGlab01) use function deleteEverything from json-Explorer@0.0.13
* (HGlab01) improve device/channel/state cleaning

## 0.2.0 (2021-03-04)
* (HGlab01) additional locations can be added
* (HGlab01) for a proper working of the new version a uninstall/install is recommended
* (HGlab01) small improvements

## 0.1.4 (2021-02-22)
* (HGlab01) optimize device/channel deletion
* (HGlab01) improve Sentry handling

## 0.1.3 (2021-02-20)
* (HGlab01) add attributes accessMod and clubCardText
* (HGlab01) Improve logs
* (HGlab01) fuel type (Diesel, Super95, CNG) can be selected

## 0.1.2 (2021-02-17)
* (HGlab01) first beta version
