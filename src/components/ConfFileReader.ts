import { DefinedOptions, DrawingOptions } from "@/dcmwtconfType";

export class ConfFileReader {
    constructor(
        private readonly path: string,
    ){}
    
    public read = async() => {
       const promise = new Promise<{
        definedOptions: DefinedOptions;
        drawingOptions: DrawingOptions;
      }>((resolve, reject) => {
        try {
          const request = new XMLHttpRequest();
          request.open('GET', this.path);
          request.responseType = 'json';
          request.send();
          request.onload = () => {
            resolve({
              definedOptions: request.response.definedOptions as DefinedOptions,
              drawingOptions: request.response.drawingOptions as DrawingOptions,
            });
          };
        } catch (err) {
          reject(new Error(err as string));
        }
      });

      return await promise; 
    }
}