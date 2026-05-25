declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        Marker: any;
        Polyline: any;
        InfoWindow: any;
        SymbolPath: {
          CIRCLE: number;
          FORWARD_CLOSED_ARROW: number;
        };
      };
    };
  }
}

export {};
