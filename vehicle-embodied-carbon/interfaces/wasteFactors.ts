interface WasteFactors {
    [material: string]: { // Index signature to allow flexibility in material names
      manufacturing: number; // Waste percentage during manufacturing
      endOfLife?: number; // Optional for end-of-life waste (if you'll track it)
    };
  }

  interface CriticalMaterialWasteOutput {
    [key: string]: number; // Key-value pairs where the key is the waste tracking identifier
  }