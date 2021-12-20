const _counter = [];
DEFINE.COUNTER.forEach((pq) => {
    const imcomplete_path = DEFINE.ROOT.concat("/", pq.NAME, "/");
    const path_ary = pq.FIXED.map(fixed => imcomplete_path.concat(fixed));
    _counter.push({
        name: pq.NAME,
        url: path_ary,
        size: pq.SIZE,
    });
});

const global = {
    viewer: new Viewer({
        viewer_name: "Leaflet", 
        counter: _counter,
        vector_url: [
            "../tile/VelX/1.4002e+06/z=47200",
            "../tile/VelY/1.4002e+06/z=51000"
        ]
    }),
    modal: new Modal(),
};