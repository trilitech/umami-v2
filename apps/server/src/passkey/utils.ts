export const uint8ArrayToBase64 = (uint8Array: Uint8Array<ArrayBufferLike> | undefined) => {
    if(!uint8Array) return;
    let binaryString = String.fromCharCode(...uint8Array);
    return btoa(binaryString);
}