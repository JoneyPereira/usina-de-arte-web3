declare module "three/examples/jsm/loaders/GLTFLoader" {
  import { Loader, Group } from "three";

  export interface GLTF {
    scene: Group;
    scenes: Group[];
    animations: any[];
    cameras: any[];
    asset: any;
    parser: any;
    userData: any;
  }

  export class GLTFLoader extends Loader {
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent<EventTarget>) => void,
      onError?: (event: ErrorEvent) => void,
    ): void;
    loadAsync(url: string): Promise<GLTF>;
  }
}
