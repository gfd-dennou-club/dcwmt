import { LayerTypes } from "@/dcmwtconfType";
import { LayerController } from "../../layerManager/LayerController";

export interface ViewerInterface {
    register(layerController: LayerController): void;
    set renderingCompleted(eventListener: () => void);
    updateLayers(layers: LayerTypes[]): void;
}