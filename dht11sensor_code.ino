#define BLYNK_TEMPLATE_NAME "RAIN ALERT"
#define BLYNK_AUTH_TOKEN "6d20WZjMW0CI40a7A8JuN2Sq1Wb1sAQI"
#define BLYNK_TEMPLATE_ID "TMPL3KNd8h547"
#define BLYNK_PRINT Serial
#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>
#include <DHT.h>


char auth[] = "6d20WZjMW0CI40a7A8JuN2Sq1Wb1sAQI";
char ssid[] = "realme GT 6T Special Edition";
char pass[] = "Anirudh@2003";

DHT dht(D4, DHT11);
BlynkTimer timer;

void sendSensor() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();



  if(isnan(h) || isnan(t)){
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  
    Serial.print(t, 1);  // Proper format
    Serial.print(",");
    Serial.println(h, 1);

      Blynk.virtualWrite(V0,t);
      Blynk.virtualWrite(V1,h);
 
}

