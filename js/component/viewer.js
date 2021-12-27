{// Block Scope
    const findGlobalVariable = () => {
        // [Caution] refarences global variables
        if(global){
            global.viewer.draw();
            clearInterval(set_interval_id);
        }
    }

    const set_interval_id = setInterval(findGlobalVariable);
}