/* Shared navigation, supporting pages, accessible interactions */
// Shared navigation and footer templates.
const navMarkup = `<header class="site-header" id="top"><nav class="nav wrap" aria-label="Main navigation"><a class="brand-logo" href="index.html"><img src="public/images/safaria-logo.png" alt="Safariya Adventure"></a><button class="menu-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="Open navigation"><span></span><span></span></button><div class="nav-links" id="nav-links"><a href="destinations.html">Destinations</a><a href="experiences.html">Experiences</a><a href="journeys.html">Journeys</a><a href="about.html">About</a><a href="journal.html">Journal</a><a class="nav-cta" href="plan%20your%20journey.html">Plan your journey <span>â†—</span></a></div></nav></header>`;

const footerMarkup = `<footer class="footer"><div class="wrap"><div class="footer-main"><div class="footer-brand"><a class="brand-logo" href="index.html"><img src="public/images/safaria-logo.png" alt="Safariya Adventure"></a><p>Premium Tanzanian travel<br>&amp;
 experiences.</p><span class="footer-karibu">Karibu Tanzania <i>â€” Welcome</i></span></div><div class="footer-col"><p class="eyebrow">EXPLORE</p><a href="destinations.html">Destinations</a><a href="experiences.html">Experiences</a><a href="journeys.html">Journeys</a></div><div class="footer-col"><p class="eyebrow">OUR WORLD</p><a href="about.html">About SAFARIYA</a><a href="journal.html">Journal</a><a href="mailto:hello@safariya.travel">Get in touch</a></div><div class="footer-col footer-contact"><p class="eyebrow">SAY JAMBO</p><a href="mailto:hello@safariya.travel">hello@safariya.travel</a><a href="tel:+255762000000">+255 762 000 000</a><span>Arusha, Tanzania</span><div class="socials"><span title="Instagram profile coming soon" aria-label="Instagram profile coming soon">IG</span><span title="Facebook page coming soon" aria-label="Facebook page coming soon">FB</span><span title="YouTube channel coming soon" aria-label="YouTube channel coming soon">YT</span></div></div><form class="newsletter" novalidate><label class="eyebrow" for="newsletter-email">NOTES FROM TANZANIA</label><p>Occasional inspiration, delivered thoughtfully.</p><div class="newsletter-input"><input id="newsletter-email" type="email" placeholder="Your email address" required><button aria-label="Subscribe">â†—</button></div><small class="form-message" aria-live="polite"></small></form></div><div class="footer-bottom"><span>Â© 2026 SAFARIYA. All rights reserved.</span><span>Made with care in Tanzania </span><a href="#top" class="back-top">BACK TO TOP â†‘</a></div></div></footer>`;

// Reference copy used to build each destination guide.
const destinationGuides = {
  serengeti: {name:'Serengeti',eyebrow:'SERENGETI NATIONAL PARK',headline:'Where the wild moves with the seasons.',lead:'One of Tanzaniaâ€™s celebrated wildlife landscapes: immense savannah, remarkable wildlife and the annual movement of great herbivore herds.',image:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Serengeti_National_Park_11_-_landscape.jpg/1280px-Serengeti_National_Park_11_-_landscape.jpg',alt:'Aerial view of a river and hippos in Serengeti National Park',facts:['Established 1951','About 1.5 million hectares','UNESCO World Heritage Site, 1981'],sections:[['The Landscape','Open plains give way to grasslands, river corridors and patches of woodland. The wider Serengeti ecosystem extends beyond the national park, and its habitats shift with rainfall and water.'],['Wildlife','The Serengeti supports lions, leopards, elephants, buffalo, rhinos, cheetahs, wildebeest and zebras. Wildlife encounters are always shaped by nature; sightings cannot be promised.'],['The Great Migration','Wildebeest, gazelles and zebras move through the Serengeti ecosystem in search of pasture and water, with predators following. Their routes and timing vary with rainfall, grazing and water availability; there is no single fixed date or location.'],['Experiences','Game drives and wildlife viewing offer time in the landscape. Balloon safaris and guided activities may be available where permitted and operational; confirm current options when planning.'],['When to Visit','Seasonal conditions change both the landscape and animal movements. Plan around the kind of experience you value, and check current local guidance rather than relying on a guaranteed migration location.']],source:'Factual references: <a href="https://whc.unesco.org/en/list/156/" target="_blank" rel="noopener">UNESCO World Heritage Centre</a> and <a href="https://www.tanzaniaparks.go.tz/" target="_blank" rel="noopener">TANAPA</a>.'},
  ngorongoro: {name:'Ngorongoro',eyebrow:'NGORONGORO CONSERVATION AREA',headline:'Where wildlife, landscape and human history meet.',lead:'An extraordinary highland landscape centred on the Ngorongoro Crater, shaped by wildlife, conservation and a long human story.',image:'https://upload.wikimedia.org/wikipedia/commons/d/dd/Ngorongoro_crater.jpg',alt:'Highland crater landscape in northern Tanzania',facts:['Established 1959','Multiple-use conservation area','UNESCO World Heritage property'],sections:[['The Crater','Ngorongoro Crater is a vast volcanic caldera, described by UNESCO as the worldâ€™s largest. Its enclosed floor and steep rim create a distinctive landscape within the wider highlands.'],['Wildlife','The conservation area supports diverse wildlife, including threatened species. Animals range freely; no particular sighting is assured.'],['People & Conservation','Ngorongoro is a multiple-use conservation area where wildlife coexists with Maasai pastoral communities and traditional livestock grazing. Visitors should approach community encounters respectfully and use officially permitted experiences.'],['Human History','Archaeological research at places including Olduvai Gorge and Laetoli has contributed important evidence about human evolution and changing relationships between people and their environment.'],['Experiences','Visitors can explore crater landscapes and wildlife, take in highland viewpoints, and seek officially permitted cultural, nature and conservation experiences.']],source:'Factual reference: <a href="https://whc.unesco.org/en/list/39/" target="_blank" rel="noopener">UNESCO World Heritage Centre</a>.'},
  zanzibar: {name:'Zanzibar',eyebrow:'ZANZIBAR Â· TANZANIA',headline:'An island shaped by ocean, culture and history.',lead:'Discover Indian Ocean shores, historic Stone Town and a distinctive island culture shaped by centuries of exchange.',image:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/ZanzibarBeach.jpg/1280px-ZanzibarBeach.jpg',alt:'Indian Ocean water meeting a tropical island coastline',facts:['An archipelago in the Indian Ocean','Unguja is the largest main island','Stone Town is a UNESCO World Heritage Site'],sections:[['Stone Town','Stone Townâ€™s historic urban fabric is known for narrow streets and architecture reflecting its long Indian Ocean trading history. It is a UNESCO World Heritage Site.'],['Coast & Beaches','Zanzibarâ€™s coastline meets a rich marine environment. Conditions vary around the islands; choose responsible local operators for ocean activities.'],['Culture','African, Arab, Persian, Indian and European influences have all contributed to Zanzibarâ€™s layered cultural heritage and history of exchange.'],['Spice & Island Life','The islands are associated with spice cultivation as well as fishing, trade and everyday coastal life. Locally led experiences offer a thoughtful way to learn more.'],['Experiences','Explore Stone Town, enjoy the coast, and consider snorkelling or diving with qualified operators, spice-related visits and respectful cultural experiences.']],source:'Factual reference: <a href="https://whc.unesco.org/en/list/173/" target="_blank" rel="noopener">UNESCO World Heritage Centre</a>.'},
  kilimanjaro: {name:'Kilimanjaro',eyebrow:'MOUNT KILIMANJARO',headline:'Stand above the African plains.',lead:'A journey toward the summit of Africaâ€™s highest mountain, rising in striking isolation above the surrounding landscape.',image:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mount_Kilimanjaro.jpg/1280px-Mount_Kilimanjaro.jpg',alt:'Mount Kilimanjaro rising above the surrounding plains',facts:['5,895 metres at Kibo','Africaâ€™s highest mountain','National park established 1973 Â· UNESCO inscription 1987'],sections:[['The Mountain','Kilimanjaro is a volcanic massif with three principal volcanic features: Kibo, Mawenzi and Shira. The mountainâ€™s height and isolation shape its distinctive presence above the plains.'],['The Summit','Uhuru Peak is the highest point on Kibo, at 5,895 metres. Reaching the summit is not assured; conditions and individual responses to altitude vary.'],['Routes','Several established routes approach the mountain through different landscapes. Route choice, itinerary and conditions should be discussed with qualified guides and current park guidance; timing is not guaranteed.'],['Mountain Environment','Climbers pass through changing vegetation zones, from cultivated lower slopes and montane forest toward heath, moorland, alpine desert and the summit zone.'],['Preparation','Plan carefully, use qualified guides, carry suitable equipment, allow for acclimatization and follow park regulations and professional advice throughout.']],source:'Factual references: <a href="https://whc.unesco.org/en/list/403/" target="_blank" rel="noopener">UNESCO World Heritage Centre</a> and <a href="https://www.tanzaniaparks.go.tz/" target="_blank" rel="noopener">TANAPA</a>.'},
  tarangire: {name:'Tarangire',eyebrow:'TARANGIRE NATIONAL PARK',headline:'Wild landscapes beneath ancient baobabs.',lead:'A northern Tanzanian landscape known for elephants, sculptural baobabs and wildlife movements shaped by seasonal water.',image:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Elephants_in_Tarangire_National_Park_%282015%29.jpg/1280px-Elephants_in_Tarangire_National_Park_%282015%29.jpg',alt:'Elephants and savannah vegetation in northern Tanzania',facts:['Northern Tanzania','About 2,600 kmÂ²','Established 1970'],sections:[['The Landscape','Savannah and woodland meet in a landscape punctuated by baobabs. The Tarangire River is an important water source, particularly during dry periods.'],['Elephants & Wildlife','Tarangire is known for elephants and supports many other wildlife species. The character of each visit depends on season and natural conditions; sightings are never guaranteed.'],['Seasonal Wildlife','As water availability changes, wildlife distribution across the area can shift. The river and other water sources influence seasonal patterns without making animal locations predictable.'],['Experiences','Game drives, wildlife photography, birdwatching and unhurried scenic exploration are ways to experience the park with care.'],['Why Visit','Tarangire has a distinctive feel within northern Tanzania: baobab-dotted scenery and a river shaped by seasonal importance create a different rhythm from open plains and highland crater country.']],source:'Factual reference: <a href="https://www.tanzaniaparks.go.tz/" target="_blank" rel="noopener">Tanzania National Parks (TANAPA)</a>.'}
};

// Map locations and source links for destination pages.
const destinationMapData = {
  serengeti:{name:'Serengeti National Park',country:'Tanzania',location:'Northern Tanzania',summary:'Representative UNESCO-listed park reference point. The marker identifies the park location; it does not show the park boundary.',coordinates:'2.74000Â° S, 34.85900Â° E',lat:-2.74000,lng:34.85900,zoom:8,source:'https://whc.unesco.org/en/list/156/maps'},
  ngorongoro:{name:'Ngorongoro Conservation Area',country:'Tanzania',location:'Arusha Region, Northern Tanzania',summary:'Representative UNESCO property reference point in the Ngorongoro Crater area. The marker identifies a point, not the full conservation-area boundary.',coordinates:'3.18722Â° S, 35.54083Â° E',lat:-3.18722,lng:35.54083,zoom:9,source:'https://whc.unesco.org/en/list/39/maps'},
  zanzibar:{name:'Zanzibar Â· Stone Town, Unguja',country:'Tanzania',location:'Zanzibar Archipelago, Indian Ocean',summary:'Zanzibar is an archipelago. This representative point marks the UNESCO-listed Stone Town visitor area on Unguja (Zanzibar Island), not the whole archipelago.',coordinates:'6.16306Â° S, 39.18917Â° E',lat:-6.16306,lng:39.18917,zoom:12,source:'https://whc.unesco.org/document/218167'},
  kilimanjaro:{name:'Mount Kilimanjaro',country:'Tanzania',location:'Kilimanjaro Region, Northern Tanzania',summary:'UNESCO-listed Kilimanjaro National Park reference point on the mountain massif. The marker is a point and does not trace the park boundary.',coordinates:'3.06667Â° S, 37.36667Â° E',lat:-3.06667,lng:37.36667,zoom:9,source:'https://whc.unesco.org/en/list/403/'},
  tarangire:{name:'Tarangire National Park',country:'Tanzania',location:'Manyara Region, Northern Tanzania',summary:'Central reference point for the park. The marker indicates the park area and does not show its full boundary.',coordinates:'3.83330Â° S, 36.00000Â° E',lat:-3.83330,lng:36.00000,zoom:9,source:'https://www.keybiodiversityareas.org/en/site/factsheet/6973'}
};

// Load the map library only when a destination map needs it.
function loadLeaflet(){
  if(window.L)return Promise.resolve(window.L);
  if(window.safariyaLeafletPromise)return window.safariyaLeafletPromise;
  window.safariyaLeafletPromise=new Promise((resolve,reject)=>{
    if(!document.querySelector('link[data-leaflet-style]')){const link=document.createElement('link');link.rel='stylesheet';link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';link.dataset.leafletStyle='true';document.head.append(link)}
    const script=document.createElement('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';script.async=true;script.onload=()=>resolve(window.L);script.onerror=()=>reject(new Error('Leaflet could not be loaded'));document.head.append(script);
  });
  return window.safariyaLeafletPromise;
}

function initializeDestinationMap(page){
  const mapRoot=document.querySelector('#destination-map');
  if(!mapRoot)return;
  const data=destinationMapData[page];
  const status=document.querySelector('#destination-map-status');
  let leafletMap;
  const fallback=()=>{leafletMap?.remove();leafletMap=null;mapRoot.innerHTML='';mapRoot.classList.add('map-unavailable');status.textContent='The interactive map could not load. Use the location link below to open this map in OpenStreetMap.'};
  const start=()=>loadLeaflet().then(L=>{
    const map=leafletMap=L.map(mapRoot,{scrollWheelZoom:false,zoomControl:false,keyboard:true}).setView([data.lat,data.lng],data.zoom);
    L.control.zoom({position:'topright'}).addTo(map);
    const cartoKey=document.querySelector('meta[name="carto-basemap-api-key"]')?.content.trim();
    const isSerengeti=page==='serengeti';
    let hasTiles=false;
    if(isSerengeti&&cartoKey){
      const tileUrl=`https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${encodeURIComponent(cartoKey)}`;
      const tiles=L.tileLayer(tileUrl,{maxZoom:20,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>'}).addTo(map);
      tiles.on('tileerror',()=>{status.textContent='Map tiles could not be loaded. Check the CARTO API key and its allowed website domains.'});
      tiles.once('load',()=>{status.textContent=`Interactive map showing ${data.name}. Drag to pan, use the plus and minus buttons to zoom, or activate the marker for its name.`});
      hasTiles=true;
    }else if(isSerengeti){
      status.textContent='The map location and controls are ready. Add a domain-restricted CARTO Basemaps API key to enable map tiles.';
    }else{
      const tiles=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>'}).addTo(map);
      tiles.once('tileerror',fallback);
      hasTiles=true;
    }
    const icon=L.divIcon({className:'safariya-map-pin-wrap',html:'<span class="safariya-map-pin" aria-hidden="true"></span>',iconSize:[26,34],iconAnchor:[13,31],popupAnchor:[0,-29]});
    L.marker([data.lat,data.lng],{icon,title:data.name,alt:data.name}).addTo(map).bindPopup(`<strong>${data.name}</strong>`).openPopup();
    const fullscreen=L.Control.extend({options:{position:'topright'},onAdd(){const button=L.DomUtil.create('button','leaflet-bar safariya-map-fullscreen');button.type='button';button.title='View map full screen';button.setAttribute('aria-label','View map full screen');button.textContent='â›¶';L.DomEvent.disableClickPropagation(button);L.DomEvent.on(button,'click',()=>{if(document.fullscreenElement)document.exitFullscreen?.();else mapRoot.requestFullscreen?.()});return button}});map.addControl(new fullscreen());
    if(hasTiles)status.textContent=`Interactive map showing ${data.name}. Drag to pan, use the plus and minus buttons to zoom, or activate the marker for its name.`;
    mapRoot.dataset.mapLoaded='true';
    document.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement===mapRoot||!document.fullscreenElement)setTimeout(()=>map.invalidateSize(),100)});
  }).catch(fallback);
  // Lazy-load the map when it approaches the viewport.
  if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();start()}},{rootMargin:'250px'});observer.observe(mapRoot)}else start();
}

const data = {

 destinations:{title:'The extraordinary, <em>up close.</em>',label:'FIVE WORLDS, ONE REMARKABLE COUNTRY',desc:'From the theatre of the plains to the stillness of the coast, every corner of Tanzania has its own way of staying with you.',cards:[['Serengeti','The Great Migration moves through a living landscape of big skies, golden grasslands and extraordinary wildlife.','https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Serengeti_National_Park_11_-_landscape.jpg/1280px-Serengeti_National_Park_11_-_landscape.jpg'],['Zanzibar','Drift between quiet coves, spice-scented lanes and the slow rhythm of island life.','https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/ZanzibarBeach.jpg/1280px-ZanzibarBeach.jpg'],['Ngorongoro','Descend into a remarkable volcanic caldera, alive with wildlife and rich in stories.','https://upload.wikimedia.org/wikipedia/commons/d/dd/Ngorongoro_crater.jpg'],['Kilimanjaro','Find your own pace on the paths that climb to the roof of Africa.','https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mount_Kilimanjaro.jpg/1280px-Mount_Kilimanjaro.jpg'],['Tarangire','Baobabs, river valleys and the quiet drama of wild northern Tanzania.','https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Elephants_in_Tarangire_National_Park_%282015%29.jpg/1280px-Elephants_in_Tarangire_National_Park_%282015%29.jpg']]},
 experiences:{title:'Find what moves <em>you.</em>',label:'EXPERIENCE TANZANIA YOUR WAY',desc:'A dawn game drive. A long lunch by the sea. A trail winding above the clouds. Choose the feeling; weâ€™ll take care of the details.',cards:[['Wildlife','Unhurried time in some of the worldâ€™s most extraordinary wildlife country.','https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Elephants_in_Tarangire_National_Park_%282015%29.jpg/1280px-Elephants_in_Tarangire_National_Park_%282015%29.jpg'],['Coast & islands','Warm water, quiet beaches and the unmistakable character of Zanzibar.','https://upload.wikimedia.org/wikipedia/commons/e/ef/Beach-Zanzibar.jpg'],['Mountain','A considered climb, expert mountain guides and a summit to remember.','https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mount_Kilimanjaro.jpg/1280px-Mount_Kilimanjaro.jpg'],['Culture','Meet Tanzania through its makers, storytellers, food and everyday life.','https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Maasai_People_Tanzania.jpg/960px-Maasai_People_Tanzania.jpg'],['Private journeys','A journey shaped around your pace, your people and your particular curiosities.','https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Elephants%2C_Tarangire_National_Park%2C_Tanzania.jpg/1280px-Elephants%2C_Tarangire_National_Park%2C_Tanzania.jpg']]},
 journeys:{title:'Journeys with room<br>for <em>wonder.</em>',label:'THOUGHTFULLY MADE, PERSONALLY YOURS',desc:'Our sample itineraries are a starting point, not a set path. Weâ€™ll shape every detail around the way you want to travel.',cards:[['Serengeti to the Indian Ocean','10 days Â· Wildlife & coast. A private safari followed by the soft, unhurried beauty of Zanzibar.','https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Serengeti_National_Park_11_-_landscape.jpg/1280px-Serengeti_National_Park_11_-_landscape.jpg'],['The northern wild','7 days Â· Safari. Tarangire, Ngorongoro and Serengeti, connected by thoughtful stays and expert guiding.','https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Serengeti_National_Park_11_-_landscape.jpg/1280px-Serengeti_National_Park_11_-_landscape.jpg'],['Above the clouds','9 days Â· Mountain. A carefully paced Kilimanjaro climb with a restorative Arusha stay.','https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mount_Kilimanjaro.jpg/1280px-Mount_Kilimanjaro.jpg']]},
 about:{title:'Rooted here.<br>Made for <em>you.</em>',label:'MORE THAN A DESTINATION',desc:'SAFARIYA began with a simple belief: the best journeys come from paying attention. To a place. To its people. To what you came here hoping to find.',cards:[['Local knowledge','Our team is based in Tanzania. Our relationships, recommendations and sense of place are built here.','https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Maasai_People_Tanzania.jpg/960px-Maasai_People_Tanzania.jpg'],['Thoughtful travel','We work with care and consideration, making room for meaningful encounters and lighter footprints.','https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Serengeti_National_Park_11_-_landscape.jpg/1280px-Serengeti_National_Park_11_-_landscape.jpg'],['Your own story','No two travellers arrive with the same curiosity. We listen first, then create around you.','https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Elephants%2C_Tarangire_National_Park%2C_Tanzania.jpg/1280px-Elephants%2C_Tarangire_National_Park%2C_Tanzania.jpg']]},
 journal:{title:'Stories from<br><em>Tanzania.</em>',label:'THE SAFARIYA JOURNAL',desc:'Field notes, favourite places and small details worth travelling for. A little inspiration for the road ahead.',cards:[['A day shaped by the Serengeti','WILDLIFE Â· 6 MIN READ. From first light to the last amber glow, a day here unfolds on its own terms.','https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Serengeti_National_Park_11_-_landscape.jpg/1280px-Serengeti_National_Park_11_-_landscape.jpg'],['The quiet side of Zanzibar','ISLAND LIFE Â· 4 MIN READ. Beyond the familiar, find the islandâ€™s softer side in its small coastal villages.','https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/ZanzibarBeach.jpg/1280px-ZanzibarBeach.jpg'],['Beyond the summit','ADVENTURE Â· 8 MIN READ. On Kilimanjaro, the climb is only part of what stays with you.','https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mount_Kilimanjaro.jpg/1280px-Mount_Kilimanjaro.jpg']]}
};

// Render the selected supporting page from its page key.
function renderPage(){const page=document.body.dataset.page;
if(!page)return;
const root=document.querySelector('main');
const d=data[page];
document.body.insertAdjacentHTML('afterbegin',navMarkup);
if(destinationGuides[page]){
  const guide=destinationGuides[page];
  const map=destinationMapData[page];
  const slugList=Object.keys(destinationGuides);
  const ctaLabel={serengeti:'Plan a Serengeti journey',ngorongoro:'Explore Ngorongoro',zanzibar:'Discover Zanzibar',kilimanjaro:'Explore Kilimanjaro',tarangire:'Explore Tarangire'}[page];
  root.innerHTML=`<section class="page-hero destination-hero destination-${page}" style="--destination-image:url('${guide.image}')"><div class="wrap"><p class="eyebrow light">${guide.eyebrow}</p><h1>${guide.headline}</h1><p>${guide.lead}</p></div></section><section class="destination-facts wrap" aria-label="${guide.name} at a glance">${guide.facts.map(x=>`<span>${x}</span>`).join('')}</section><section class="section wrap destination-editorial"><div class="destination-intro"><p class="eyebrow">A CLOSER LOOK</p><h2>${guide.name}, in its own <em>rhythm.</em></h2><p>Explore the character of this place through its landscapes, wildlife, culture and the experiences it offers.</p><img src="${guide.image}" width="1200" height="900" loading="lazy" decoding="async" alt="${guide.alt}"></div><div class="destination-sections">${guide.sections.map(([title,copy],i)=>`<article class="destination-story reveal"><span class="destination-index">0${i+1}</span><div><h2>${title}</h2><p>${copy}</p></div></article>`).join('')}<p class="destination-source">${guide.source}</p></div></section><section class="section destination-location" aria-labelledby="destination-location-title"><div class="wrap"><div class="destination-location-heading"><p class="eyebrow">LOCATION</p><h2 id="destination-location-title">Find ${map.name.split(' Â· ')[0]}</h2><p>Explore exactly where this destination is located in Tanzania.</p></div><div class="destination-map-layout"><div class="destination-map-details"><h3>${map.name}</h3><dl><div><dt>Country</dt><dd>${map.country}</dd></div><div><dt>Region / location</dt><dd>${map.location}</dd></div><div><dt>Coordinates</dt><dd>${map.coordinates}</dd></div></dl><p>${map.summary}</p><a class="button button-dark" href="https://www.google.com/maps/dir/?api=1&amp;destination=${map.lat}%2C${map.lng}" target="_blank" rel="noopener noreferrer">Get directions <span>â†—</span></a><p class="map-source">Position reference: <a href="${map.source}" target="_blank" rel="noopener noreferrer">authoritative geographic source</a>.</p></div><div class="destination-map-frame"><div id="destination-map" class="destination-map" role="region" aria-label="Interactive map showing ${map.name}" aria-describedby="destination-map-status" tabindex="0"></div><p id="destination-map-status" class="map-status" role="status" aria-live="polite">The interactive map will load as you reach this section.</p><a class="map-fallback-link" href="https://www.openstreetmap.org/?mlat=${map.lat}&amp;mlon=${map.lng}#map=${map.zoom}/${map.lat}/${map.lng}" target="_blank" rel="noopener noreferrer">View location on OpenStreetMap â†—</a></div></div></div></section><section class="destination-explore section"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">KEEP EXPLORING</p><h2>Explore another <em>destination.</em></h2></div></div><div class="destination-links">${slugList.filter(slug=>slug!==page).map(slug=>{const other=destinationGuides[slug];return `<a href="${slug}.html">${other.name}<span aria-hidden="true">â†—</span></a>`}).join('')}</div></div></section><section class="cta-band"><div class="cta-inner wrap"><p class="eyebrow light">YOUR TANZANIA STORY STARTS HERE</p><h2>Plan a ${guide.name}<br><em>journey.</em></h2><p>Tell us what draws you here. Weâ€™ll help shape a thoughtful itinerary.</p><a class="button button-light" href="mailto:hello@safariya.travel?subject=Plan%20a%20Tanzania%20journey">${ctaLabel} <span>â†—</span></a></div></section>`;
  initializeDestinationMap(page);
  document.title=`${guide.name} | SAFARIYA`;
  document.querySelector('meta[name="description"]')?.setAttribute('content',guide.lead);
  const base='../';
  document.querySelectorAll('.site-header a[href],.footer a[href],.footer form').forEach(el=>{const href=el.getAttribute('href');if(href&&!/^(#|mailto:|tel:|https?:)/.test(href))el.setAttribute('href',base+href);if(el.matches('form')){el.querySelector('label')?.setAttribute('for','newsletter-email');el.querySelector('input')?.setAttribute('id','newsletter-email')}});
  document.querySelectorAll('.site-header .brand-logo img').forEach(img=>img.setAttribute('src',base+img.getAttribute('src')));
  const canonical=document.querySelector('link[rel="canonical"]'); if(canonical)canonical.href=`https://safariya.travel/destinations/${page}.html`;
  const ogTitle=document.querySelector('meta[property="og:title"]'); if(ogTitle)ogTitle.content=document.title;
  const ogDescription=document.querySelector('meta[property="og:description"]'); if(ogDescription)ogDescription.content=guide.lead;
  const ogImage=document.querySelector('meta[property="og:image"]'); if(ogImage)ogImage.content=`${guide.image}`;
  document.body.insertAdjacentHTML('beforeend',footerMarkup);
  document.querySelectorAll('.footer a[href]').forEach(a=>{const href=a.getAttribute('href');if(href&&!/^(#|mailto:|tel:|https?:)/.test(href))a.href='../'+href});
  document.querySelectorAll('.footer .brand-logo img').forEach(img=>img.setAttribute('src',base+img.getAttribute('src')));
  return;
}
{const cards=d.cards.map(([name,desc,img])=>{const slug=page==='destinations'?name.toLowerCase():'';const guide=destinationGuides[slug];const journeyId=page==='journeys'?({'Serengeti to the Indian Ocean':'serengeti-coast','The northern wild':'northern-wild','Above the clouds':'above-clouds'}[name]||''):'';const summary=guide?guide.headline:desc;const href=guide?'destinations/'+slug+'.html':journeyId?'package.html?id='+journeyId:'mailto:hello@safariya.travel?subject=Ask%20about%20a%20journey';const linkText=guide?'Explore '+name:journeyId?'View sample journey':page==='journal'?'Plan a journey':'Email us';return `<article class="detail-card reveal"><img src="${img}" alt="${name}, Tanzania" width="1200" height="900" loading="lazy" decoding="async"><div><p class="eyebrow">SAFARIYA ${page==='journal'?'FIELD NOTES':page.toUpperCase()}</p><h2>${name}</h2><p>${summary}</p><a class="under-link" href="${href}">${linkText} <span>â†—</span></a></div></article>`}).join('');
root.innerHTML=`<section class="page-hero"><div class="wrap"><p class="eyebrow light">${d.label}</p><h1>${d.title}</h1><p>${d.desc}</p></div></section><section class="section wrap content-page"><div class="section-heading"><div><p class="eyebrow">MADE FOR THE WAY YOU TRAVEL</p><h2>${page==='destinations'?'A country of <em>contrasts.</em>':page==='experiences'?'Choose your <em>own rhythm.</em>':page==='journeys'?'A few ways to <em>begin.</em>':page==='about'?'Travel with <em>intention.</em>':'Notes for the <em>curious.</em>'}</h2></div><a class="under-link" href="mailto:hello@safariya.travel">Email our team <span>â†—</span></a></div><div class="detail-grid">${cards}</div></section><section class="cta-band"><div class="cta-inner wrap"><p class="eyebrow light">YOUR TANZANIA STORY STARTS HERE</p><h2>Make it <em>yours.</em></h2><p>Tell us what inspires you. Weâ€™ll help shape a journey around it.</p><a class="button button-light" href="mailto:hello@safariya.travel?subject=Plan%20a%20Tanzania%20journey">Email our team <span>â†—</span></a></div></section>`;
}document.body.insertAdjacentHTML('beforeend',footerMarkup);
}
renderPage();

// Remote wildlife photographs can be blocked by the visitor's network. Keep
// page imagery present with an appropriate local fallback.
document.addEventListener('error', event => {
  const img = event.target;
  if (!(img instanceof HTMLImageElement) || img.dataset.imageFallback) return;
  if (!/^https?:$/.test(new URL(img.src, location.href).protocol)) return;
  const label = `${img.alt} ${img.src}`.toLowerCase();
  const root = location.pathname.includes('/destinations/') ? '../' : '';
  let fallback = `${root}hero-safari.png`;
  let fallbackAlt = 'Tanzanian wildlife gathered at a waterhole';
  if (/zanzibar|island|coast|beach|ocean/.test(label)) {
    fallback = `${root}zanzibar.jfif`;
    fallbackAlt = 'Boats on the turquoise coast of Zanzibar';
  } else if (/kilimanjaro|mountain|summit/.test(label)) {
    fallback = `${root}kilimanjaro.jfif`;
    fallbackAlt = 'Mount Kilimanjaro rising above the plains';
  }
  img.dataset.imageFallback = 'true';
  img.src = fallback;
  img.alt = fallbackAlt;
}, true);

// Shared navigation behavior: mobile menu, scroll state, and keyboard handling.
const header=document.querySelector('.site-header');
const toggle=document.querySelector('.menu-toggle');
if(toggle){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';
toggle.setAttribute('aria-expanded',String(!open));
toggle.setAttribute('aria-label',open?'Open navigation':'Close navigation');
header.classList.toggle('menu-open',!open)});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');
toggle.setAttribute('aria-label','Open navigation');
header.classList.remove('menu-open')}));
}
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && header?.classList.contains('menu-open')) {
    header.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open navigation');
    toggle?.focus();
  }
});

document.addEventListener('click', (event) => {
  if (toggle && header?.classList.contains('menu-open') && !header.contains(event.target)) {
    header.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  }
});

const updateHeader=()=>header?.classList.toggle('scrolled',window.scrollY>24);
updateHeader();
window.addEventListener('scroll',updateHeader,{passive:true});

// Reveal content as it enters the viewport.
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');
observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Newsletter feedback.
document.querySelectorAll('.newsletter').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.querySelector('.form-message');
    status.classList.remove('is-success', 'is-error');

    if (!form.checkValidity()) {
      status.textContent = 'Please enter a valid email address.';
      status.classList.add('is-error');
      form.reportValidity();
      return;
    }

    status.textContent = 'Newsletter sign-up is not connected yet. Please email hello@safariya.travel to ask to join.';
    status.classList.add('is-error');
  });
});
