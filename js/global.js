// [TODO] 中間ファイルとのインターフェースの部分をよく考える必要がある!
//        今はめちゃくちゃテキトー

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

const _vector = [];
DEFINE.VECTOR.forEach((pq) => {
    let name_str = "";
    pq.NAME.forEach((name) => name_str = name_str.concat(name, "-"));
    name_str = name_str.slice(0, -1);

    const urls = pq.NAME.map((name) => {
        const imcomplete_path = DEFINE.ROOT.concat("/", name, "/");
        return imcomplete_path.concat(pq.FIXED[0]);
    });

    _vector.push({
        name: name_str,
        url: urls,
        size: pq.SIZE,
    });
});

const global = {
    viewer: new Viewer({
        display_name: "Cesium", 
        counter: _counter,
        vector: _vector,
        maximumLevel: DEFINE.MAXIMUMLEVEL,
    }),
    modal: new Modal(),
};
