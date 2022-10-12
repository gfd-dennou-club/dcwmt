// [TODO] 中間ファイルとのインターフェースの部分をよく考える必要がある!
//        今はめちゃくちゃテキトー

const _tone = [];
for ( const pq of DEFINE.TONE ) { 
    const imcomplete_path = DEFINE.ROOT.concat("/", pq.NAME, "/");
    const path_ary = pq.FIXED.map(fixed => imcomplete_path.concat(fixed));
    _tone.push({
        name: pq.NAME,
        url: path_ary,
        size: pq.SIZE,
        maximumLevel: pq.MAXIMUMLEVEL,
    });
}

const _vector = [];
for ( const pq of DEFINE.VECTOR ) {
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
        maximumLevel: pq.MAXIMUMLEVEL,
    });
}

const global = {
    viewer: new Viewer({
        wmtsLibIdentifer: new wmtsLibIdentifer("OpenLayers"), 
        tone: _tone,
        vector: _vector,
    }),
    modal: new Modal(),
};
