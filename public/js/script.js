const socket = io()

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude })
    },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
            
    );
}
else{
    alert("Geolocation is not supported by your browser.");
}

const map = L.map("map").setView([0,0], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "Siddharth_In_Tech"
}).addTo(map);

const markers = {};

socket.on("receive-location", (data)=>{
   const {id, latitude, longitude} = data;
   map.setView([latitude, longitude], 16);
   if(markers[id]){
    markers[id].setLatLng([latitude, longitude ]);
   }
   else{
    markers[id] = L.marker([latitude, longitude ]).addTo(map);
   }
});

socket.on("user-disconnected", function (id){
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})