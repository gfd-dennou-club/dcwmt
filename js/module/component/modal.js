const Modal = class{
    constructor(){
        this.modal = document.getElementById("modal");
        // モーダルウィンドウの非表示
        this.modal.style.display = 'none';
        this.viewerkey = [];
    }

    create = (title, content, viewerkey) => {
        // モーダルウィンドウの表示
        this.modal.style.display = 'block';

        // タイトルの作成
        const h1 = this.modal.getElementsByClassName("title")[0];
        h1.textContent = '';
        h1.insertAdjacentHTML('afterbegin', title);

        // ボディの作成
        const body = this.modal.getElementsByClassName("body")[0];
        body.appendChild(content);

        // モーダルウィンドウが影響を与えるviewerのオプションを設定
        viewerkey.forEach(value => this.viewerkey.push(value));

        // イベントリスナの設定
        this.modal.addEventListener('click', this._eventOfModal);
    }

    _eventOfModal = (event) => {
        const cancelBtn = this.modal.getElementsByClassName("cancel")[0];
        const doneBtn = this.modal.getElementsByClassName("done")[0];
        switch(event.target){
            case doneBtn: 
                this._effectViewer();
            case cancelBtn:
            case this.modal:
                this._closeModal();
            default:
        }
    }

    _effectViewer = () => {
        const body = this.modal.getElementsByClassName("body")[0];
        const children = body.childNodes;

        const vieweroption = new Object({});
        for(let i = 0; i < children.length; i++){
            vieweroption[this.viewerkey[i]] = parseInt(children[i].value, 10);
        }

        // [Caution] refarences global variables
        global.viewer.redraw(vieweroption);
    }

    _closeModal = () => {
        const body = this.modal.getElementsByClassName("body")[0];

        // モーダルウィンドウの非表示
        this.modal.style.display = 'none';
        while(body.lastChild) body.removeChild(body.lastChild);
        this.modal.removeEventListener('click', this._eventOfModal);
    }
}