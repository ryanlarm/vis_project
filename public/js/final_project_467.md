# 467 Final Project Notes

---

## AWS

### Explanation

AWS IoT is a online, publish-subscriber system provided by Amazon that utilizes the MQTT protocol to connect devices.

### Configuration

## Hardware

### Thermocouples

## Software

### Arduino Code

### Raspberry Pi Code

I had problems trying to install the freeRTOS kernel on my Raspberry Pi, so I opted to use the C++ SDK instead of the embedded-C SDK. The embedded-C SDK was designed to be used along side the RTOS platform, so without it, I can't really use it as far as I can tell.

### Android Application

To develop Android applications, I'm using the Android studio IDE which is the industry standard for android application development because it offers a simulator for the applications. 

The application itself is very simple and only displays the current tempurature readouts from each of the thermocouples.