import * as fileSaver from 'node_modules/file-saver';

export function createFileForDownload(data, fileName: string) {
    const blob = new Blob([data], {type: 'text/plain;charset=utf-8'});
    fileSaver.saveAs(blob, fileName);
}

export function savePNG(canvas: HTMLCanvasElement, fileName: string) {
    canvas.toBlob(blob => {
        fileSaver.saveAs(blob, fileName);
    });
}
