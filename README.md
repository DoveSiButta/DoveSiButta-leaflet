## (Open) Data Maps Wanderer ##

Introduction
-----------

It's been a while since I have been trying to make order among all the geography-related topics from the perspective of a technical and non-technical user.
During the past year I have encountered many tools and services that allow to fulfill the need for geographical data information. 

Here are some examples:

 - Viewing the map of a city you will be visiting in your next trip;
 - finding all restaurants/theaters/whatever around a certain location;
 - search for places, businesses and locations based on a name;
 - obtain directions between your location and a desired destination;
 - ...and much more.

Now, for the average user, all these actions are performed through a single website: [Google Maps][1] (yes you could also use [Bing Maps][2] but... why?). 

But, as usual, what is apparently simple is actually very complicated. While Google hides all the complexity behind a single application, to replicate the same features outside of Google Maps and the likes requires a lot of interoperable tools. Thankfully, those tools and data exist.

Let's make a step back: our goal, as users, is rarely that of "getting data" but it's most likely that of obtaining information. 

There are two sides of the matter: the *data* and the *tools* used to represent that data. Google and Microsoft own both the data and the tools, and they grant access to users under certain [License][3] (for developers) and [Terms of Use][4] (for end users), which we accept upon usage of such services. 

That is totally fine. After all, would you complain of such amazing service? There's another question, however. One day someone stepped ask and wondered "what if certain data was as publicly accessible as the air we breathe and as the water we drink?". 
This is the basis of Open Data (Public Domain) licensing initiative, which does not deny the existence of paid services, but encourages the publishing of the information under a license that grant absolute rights on that information. 

Just like water, you can access free and pure water on a mountain hike in the Alps, but you pay for the commodity of having tap water in your house: such is with data, where you pay for the services that allow you to access such data and not for the data itself. 

In the case of geographical data, we have two types of data:

 - *Tiles* contain the graphical representation of a map, with altitude curves, streets, water, grass, and so on. 
 - *Points of Interest* represent everything that was given a name by man. Buildings, tops of mountains, objects and much more.
 - The administrative information represents country borders and regions.

On top of the maps, any kind of relevant data can be plotted. For example, price of houses and rents can be projected on top of a map in order to provide information. Such data can come from any source: government, private companies, or even *crowdsourced*.

The following section tries to make order among the tools used to work with maps under [Open Data licenses][5] (such as the Open Data Commons Open Database License used by OpenStreetMap).
 
Let's move deeper in putting all the pieces on the board. I will cover the following:

 1. [Leaflet][6]
 2. [OpenStreetMap][7]
 3. [Overpass API][8]
 4. [OpenLayers][9]
 5. MapQuest
 6. [MapBox][10]

As the most knowledgeable people may have noticed, I am mixing up various kinds of tools and services, but they represent the pieces of the puzzle we need to put together in order to achieve our goals of obtaining the desired information, so please bear with me. 
  

Leaflet
-------
Leaflet is a Javascript library for displaying a map in a HTML page and working with it (such as adding menu, markers and shapes - called *polygons* - to it). that's it. Is a very generic piece of software (and this is good) and in fact not just it can handle different types of map sources (such as OpenStreetMap and others) but it can also be included in other products. 

OpenStreetMap
------------
OpenStreetMap is a project to create a "wiki" map of the world. This project is ran by the OpenStreetMap Foundation. The OpenStreetMap database is the real big player in here because it is a source for both Points of Interest and tiles. It is made accessible to end-users through the portal [OpenStreetMap.org.][11], but the entire database can be [downloaded][12] on your hard drive (if you know what to do with it). 
OpenStreetMap data is more useful if made available through certain APIs, such as OverPass API.
Going back to examples, let's say you want to look for a city you know by name -but not by location. In that case, OpenStreetMap.org offers a handy search box that returns a list of places according to the terms searched by the user. Although this is seamless to the end-user, this search is actually delivered by another service called **OpenStreetMap Nominatim**. 

Overpass API
-----------
Overpass API is, as the name says and API (an interface) made to run queries on the OpenStreetMap database so you don't have to come up for a way to do that yourself. 
With Overpass API a developer can run queries for content within OpenStreetMap database, ranging from streets to any kind of *tagged* object there contained.
[Overpass-Turbo][13] is a great tool to test queries on Overpass API and export them (or the data) into various formats.
Overpass API is a service targeted to developers, so they can build easy to use apps on top of OpenStreetMap contents. 

MapBox
------
MapBox is a commercial company that offers services and tools to make the best out of open data. The first reason you will be involved with MapBox is its *tile service*, which means that MapBox can offer you (as a developer) a way to customize the aspect of the OpenStreetMap maps you are presenting to your users. MapBox also contributes to the open source community with components for various platforms, such as SDKs to integrate OpenStreetMap maps into iOS. 

MapQuest
--------
As MapBox, also MapQuest is a commercial company. While MapBox is targeted to developers, MapQuest is targeted to end-users and offers services (such as directions and location search) on top of open data maps, powered by the OpenStreetMap content. 

## A real-life scenario: Leaflet with OpenStreetMap, MapBox and Overpass API ##

So how does all of it fit together?
I will now run through the building of a web application that uses Leaflet to display a map loaded by MapBox, that allows to search for a place (e.g. a City) and that retrieves from OpenStreetMap database the location of recycle facilities in the area. 
 
The project is also [available on GitHub][14].


# Building the platform

From this point onwards I will go through the building process of a web application that uses the power of open maps and tools to display information related to recycling. 

 1. Display a map in the page and load a starting location
 2. Search for a location
 3. Display content from OpenStreetMap into the map, and refresh the map when the user drags it or changes location
 4. Allow to filter for different data types (In this case, the recycling types: Plastic, Glass, etc.)
 5. Load and display municipality borders on top of the map
 6. Assign different colors to municipalities based on certain information (in our case, depending whether the municipality performs collection or waste door-to-door)

## Display a map

## Search for a location 



 
Notes and Questions
---------------

- Can Open Data and Google Maps co-exist?
Sure thing, in fact they can also play along well together. You can have geographical data (such as location of schools in a city) published under an open license and develop an application that displays such data on top of a map offered by Google. Why not? 

- Can Google data and open source maps co-exist?
This is harder. Say that you have information about locations provided by Google then some limitations apply:

> If your application displays Places API data on a map, that map must
> be provided by Google.
> 
> If your application displays Places API data on a page or view that
> does not also display a Google Map, you must show a "Powered by
> Google" logo with that data. For example, if your application displays
> a list of Places on one tab, and a Google Map with those Places on
> another tab, the first tab must show the "Powered by Google" logo.


----------


 
> Written with [StackEdit](https://stackedit.io/).


  [1]: http://maps.google.com
  [2]: http://maps.bing.com
  [3]: https://developers.google.com/maps/licensing
  [4]: https://developers.google.com/maps/terms?hl=en
  [5]: http://www.openstreetmap.org/copyright
  [6]: http://leafletjs.com/
  [7]: http://www.openstreetmap.org/
  [8]: http://overpass-api.de/
  [9]: http://openlayers.org/
  [10]: https://www.mapbox.com/
  [11]: www.OpenStreetMap.org.
  [12]: http://planet.openstreetmap.org/
  [13]: http://overpass-turbo.eu/
  [14]: https://github.com/DoveSiButta/DoveSiButta-leaflet
