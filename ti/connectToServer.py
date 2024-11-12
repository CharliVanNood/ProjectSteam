import network
import time
import urequests
import json
import machine

class DistSensor:
    def __init__(self, pinTrig, pinEcho):
        self.pinTrig = machine.Pin(pinTrig, machine.Pin.OUT)
        self.pinEcho = machine.Pin(pinEcho, machine.Pin.IN)
    
    def distance(self):
        self.pinTrig.low()
        time.sleep_us(2)
        self.pinTrig.high()
        time.sleep_us(10)
        self.pinTrig.low()
        while self.pinEcho.value() == 0:
            pass
        t1 = time.ticks_us()
        while self.pinEcho.value() == 1:
            pass
        t2 = time.ticks_us()
        duration = t2 - t1
        distance_m = (duration * 343) / 2
        return distance_m / 10000
    
def conn(ssid, password, max_wait=10):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)
    while max_wait > 0:
        if wlan.isconnected():
            print("Connected to WiFi:", wlan.ifconfig())
            break
        max_wait -= 1
        print("Waiting for connection...")
        time.sleep(1)

    if not wlan.isconnected():
        print("Could not connect to WiFi")
        exit(1)
    else:
        print("Connected to WiFi successfully")

def calculate_temperature():
    adc = machine.ADC(4)
    adc_value = adc.read_u16()
    voltage = adc_value * (3.3 / 65535)
    temperature = (voltage - 0.5) * 100
    return temperature


distSensor = DistSensor(pinTrig=27, pinEcho=26)

#replace ip with webserver ip
url = 'http://192.168.1.20:8080'  

#replace ssid and password with wifi credentials
ssid = "..."
password = "..."


def send(data):
    headers = {'content-type': 'application/json'}
    response = urequests.post(url, data=json.dumps(data), headers=headers)
    #print(response.text) #debugging uncomment if needed
    response.close()


conn(ssid=ssid, password=password)
while True:
    if not network.WLAN(network.STA_IF).isconnected():
        print("Reconnecting to WiFi...")
        conn(ssid=ssid, password=password)
    
    data = {
        "distance": round(distSensor.distance(),2),
        "temperature": round(calculate_temperature(),2)
    }
    for key, value in data.items():
        if value is None:
            print("Could not read", key)
            print(key, ":", value)
            continue

    #print("Sending data:", data) #debugging uncomment if needed
    try:
        send(data)
    except OSError as e:
        print("Could not send data:", e)  
    time.sleep(1)  
