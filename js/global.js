const global = {
    viewer: new Viewer({
        viewer_name: "OpenLayers", 
        diagram_name: "counter",
        url: "../tile/Ps/time=32112",
        urls: [
            "../tile/VelX/1.4002e+06/z=47200",
            "../tile/VelY/1.4002e+06/z=51000"
        ]
    }),
    modal: new Modal(),
};