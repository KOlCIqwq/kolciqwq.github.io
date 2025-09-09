### About DOOF

DOOF is a smart application designed to make tracking food, nutrients, and calories intuitive and straightforward. The primary motivation was to create a user-friendly alternative to existing complex calorie trackers.

---

### Motivation
Through a friend’s recommendation I stumbled upon a barcode scanning application. While useful, I noticed that the application only offered a simple “healthy or not” evaluation of food products. 

So why not build an application that combines barcode scanning with food inventory management and personal health tracking?

From this concept, DOOF was born. A tool that allows user to scan product barcode, track and organize them in an inventory and integrate calories and nutrition trackeing into daily routine

---

### Choice of Programming Languages
I selected Flutter to build the application. The other option was React Native. I have no experience with React Native's language, TypeScript. I have experience with Java, which is similar to Flutter's language, Dart. I chose Flutter to start development faster.

---

### Core features
#### Barcode Scanner
I first built a custom barcode scanner. It required perfect alignment and failed in low light. I replaced the custom scanner with the ZXing library. This improved performance. The scanner was slow because it processed the full camera image. I added a scanning rectangle to the interface. The application now crops the image to the rectangle before processing. This increased scanning speed.

#### Items Information
The application needed a product database. I integrated the OpenFoodFacts API. This API provides free access to a large database of food products.

#### Calories tracker
I added a calorie and nutrient tracker. After you scan a product, you log it as consumed. The application tracks all the nutritional information for you.

#### Profile
You create a personal profile with your weight, height, and goals. The application uses this information to calculate your specific daily needs for calories, protein, and fat.

---

### Data storing
I chose Supabase for data storage and user authentication. You must authenticate to use the app. Supabase stores your personal information and inventory of items. The next step is to add storage for consumption logs.
