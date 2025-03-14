// Based on definitions by Zach Posten for React-Filepond <https://github.com/zposten>
// Updated by FilePond Contributors

/* Disable no-redundant-jsdoc since @default statements are NOT redundant */
/* tslint:disable:no-redundant-jsdoc */

export {};

export enum FileStatus {
    INIT = 1,
    IDLE = 2,
    PROCESSING_QUEUED = 9,
    PROCESSING = 3,
    PROCESSING_COMPLETE = 5,
    PROCESSING_ERROR = 6,
    PROCESSING_REVERT_ERROR = 10,
    LOADING = 7,
    LOAD_ERROR = 8,
}

export enum Status {
    EMPTY = 0,
    IDLE = 1,
    ERROR = 2,
    BUSY = 3,
    READY = 4,
}

export enum FileOrigin {
    INPUT = 1,
    LIMBO = 2,
    LOCAL = 3,
}

// TODO replace all references to `ActualFileObject` with native `File`
/**
 * @deprecated Don't use this type explicitly within your code. It'll be replaced with the native `File` type in a future release.
 */
export type ActualFileObject = Blob & { readonly lastModified: number; readonly name: string };

/**
 * A custom FilePond File.
 */
export class FilePondFile {
    /** Returns the ID of the file. */
    id: string;
    /** Returns the server id of the file. */
    serverId: string;
    /** Returns the source of the file. */
    source: ActualFileObject | string;
    /** Returns the origin of the file. */
    origin: FileOrigin;
    /** Returns the current status of the file. */
    status: FileStatus;
    /** Returns the File object. */
    file: ActualFileObject;
    /** Returns the file extensions. */
    fileExtension: string;
    /** Returns the size of the file. */
    fileSize: number;
    /** Returns the type of the file. */
    fileType: string;
    /** Returns the full name of the file. */
    filename: string;
    /** Returns the name of the file without extension. */
    filenameWithoutExtension: string;

    /** Aborts loading of this file */
    abortLoad: () => void;
    /** Aborts processing of this file */
    abortProcessing: () => void;
    /**
     * Retrieve metadata saved to the file, pass a key to retrieve
     * a specific part of the metadata (e.g. 'crop' or 'resize').
     * If no key is passed, the entire metadata object is returned.
     */
    getMetadata: (key?: string) => any;
    /** Add additional metadata to the file */
    setMetadata: (key: string, value: any, silent?: boolean) => void;
}

// TODO delete
/**
 * A custom FilePond File. Don't confuse this with the native `File` type.
 *
 * @deprecated use `FilePondFile` instead. This type will be removed in a future release.
 */
export class File extends FilePondFile {}

export interface ServerUrl {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    withCredentials?: boolean;
    headers?: { [key: string]: string | boolean | number };
    timeout?: number;

    /**
     * Called when server response is received, useful for getting
     * the unique file id from the server response.
     */
    onload?: (response: any) => number | string;
    /**
     * Called when server error is received, receives the response
     * body, useful to select the relevant error data.
     */
    onerror?: (responseBody: any) => any;
    /**
     * Called with the formdata object right before it is sent,
     * return extended formdata object to make changes.
     */
    ondata?: (data: FormData) => FormData;
}

export type ProgressServerConfigFunction = (
    /**
     * Flag indicating if the resource has a length that can be calculated.
     * If not, the totalDataAmount has no significant value.  Setting this to
     * false switches the FilePond loading indicator to infinite mode.
     */
    isLengthComputable: boolean,
    /** The amount of data currently transferred. */
    loadedDataAmount: number,
    /** The total amount of data to be transferred. */
    totalDataAmount: number
) => void;

export interface ProcessServerChunkTransferOptions {
    chunkTransferId: string;
    chunkServer: ServerUrl;
    /**
     * Chunk uploads enabled
     */
    chunkUploads: boolean;
    /**
     * Forcing use of chunk uploads even for files smaller than chunk size
     */
    chunkForce: boolean;
    /**
     * Size of chunks
     */
    chunkSize: number;
    /**
     * Amount of times to retry upload of a chunk when it fails
     */
    chunkRetryDelays: number[];
}

export type ProcessServerConfigFunction = (
    /** The name of the input field. */
    fieldName: string,
    /** The actual file object to send. */
    file: ActualFileObject,
    metadata: { [key: string]: any },
    /**
     * Should call the load method when done and pass the returned server file id.
     * This server file id is then used later on when reverting or restoring a file
     * so that your server knows which file to return without exposing that info
     * to the client.
     */
    load: (p: string | { [key: string]: any }) => void,
    /** Call if something goes wrong, will exit after. */
    error: (errorText: string) => void,
    /**
     * Should call the progress method to update the progress to 100% before calling load().
     * Setting computable to false switches the loading indicator to infinite mode.
     */
    progress: ProgressServerConfigFunction,
    /** Let FilePond know the request has been cancelled. */
    abort: () => void,
    /**
     * Let Filepond know and store the current file chunk transfer id so it can track the
     * progress of the whole file upload
     */
    transfer: (transferId: string) => void,

    options: ProcessServerChunkTransferOptions
) => void;

export type RevertServerConfigFunction = (
    /** Server file id of the file to restore. */
    uniqueFieldId: any,
    /** Should call the load method when done. */
    load: () => void,
    /** Call if something goes wrong, will exit after. */
    error: (errorText: string) => void
) => void;

export type RestoreServerConfigFunction = (
    /** Server file id of the file to restore. */
    uniqueFileId: any,
    /** Should call the load method with a file object or blob when done. */
    load: (file: ActualFileObject) => void,
    /** Call if something goes wrong, will exit after. */
    error: (errorText: string) => void,
    /**
     * Should call the progress method to update the progress to 100% before calling load().
     * Setting computable to false switches the loading indicator to infinite mode.
     */
    progress: ProgressServerConfigFunction,
    /** Let FilePond know the request has been cancelled. */
    abort: () => void,
    /**
     * Can call the headers method to supply FilePond with early response header string.
     * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
     */
    headers: (headersString: string) => void
) => void;

export type LoadServerConfigFunction = (
    source: any,
    /** Should call the load method with a file object or blob when done. */
    load: (file: ActualFileObject | Blob) => void,
    /** Call if something goes wrong, will exit after. */
    error: (errorText: string) => void,
    /**
     * Should call the progress method to update the progress to 100% before calling load().
     * Setting computable to false switches the loading indicator to infinite mode.
     */
    progress: ProgressServerConfigFunction,
    /** Let FilePond know the request has been cancelled. */
    abort: () => void,
    /**
     * Can call the headers method to supply FilePond with early response header string.
     * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders>
     */
    headers: (headersString: string) => void
) => void;

export type FetchServerConfigFunction = (
    url: string,
    /** Should call the load method with a file object or blob when done. */
    load: (file: ActualFileObject | Blob) => void,
    /** Call if something goes wrong, will exit after. */
    error: (errorText: string) => void,
    /**
     * Should call the progress method to update the progress to 100% before calling load().
     * Setting computable to false switches the loading indicator to infinite mode.
     */
    progress: ProgressServerConfigFunction,
    /** Let FilePond know the request has been cancelled. */
    abort: () => void,
    /**
     * Can call the headers method to supply FilePond with early response header string.
     * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
     */
    headers: (headersString: string) => void
) => void;

export type RemoveServerConfigFunction = (
    /** Local file source */
    source: any,
    /** Call when done */
    load: () => void,
    /** Call if something goes wrong, will exit after. */
    error: (errorText: string) => void
) => void;

export interface FilePondInitialFile {
    /** The server file reference. */
    source: string;
    options: {
        /** Origin of file being added. */
        type: 'input' | 'limbo' | 'local';
        /** Mock file information. */
        file?: {
            name?: string;
            size?: number;
            type?: string;
        };
        /** File initial metadata. */
        metadata?: { [key: string]: any };
    };
}

export interface FilePondServerConfigProps {
    /**
     * Immediately upload new files to the server.
     * @default true
     */
    instantUpload?: boolean;
    /**
     * The maximum number of files that can be uploaded in parallel.
     * @default 2
     */
    maxParallelUploads?: number;

    /**
     * Server API Configuration.
     * See: https://pqina.nl/filepond/docs/patterns/api/server
     * @default null
     */
    server?:
        | string
        | {
              url?: string;
              timeout?: number;
              headers?: { [key: string]: string | boolean | number };
              process?: string | ServerUrl | ProcessServerConfigFunction | null;
              revert?: string | ServerUrl | RevertServerConfigFunction | null;
              restore?: string | ServerUrl | RestoreServerConfigFunction | null;
              load?: string | ServerUrl | LoadServerConfigFunction | null;
              fetch?: string | ServerUrl | FetchServerConfigFunction | null;
              patch?: string | ServerUrl | null;
              remove?: RemoveServerConfigFunction | null;
          }
        | null;

    /**
     * Enable chunk uploads
     * @default false
     */
    chunkUploads?: boolean;
    /**
     * Force use of chunk uploads even for files smaller than chunk size
     * @default false
     */
    chunkForce?: boolean;
    /**
     * Size of chunks (5MB default)
     * @default 5000000
     */
    chunkSize?: number;
    /**
     * Amount of times to retry upload of a chunk when it fails
     * @default [500, 1000, 3000]
     */
    chunkRetryDelays?: number[];

    /**
     * A list of file locations that should be loaded immediately.
     * See: https://pqina.nl/filepond/docs/patterns/api/filepond-object/#setting-initial-files
     * @default []
     */
    files?: Array<FilePondInitialFile | ActualFileObject | Blob | string>;
}

export interface FilePondDragDropProps {
    /**
     * FilePond will catch all files dropped on the webpage.
     * @default false
     */
    dropOnPage?: boolean;
    /**
     * Require drop on the FilePond element itself to catch the file.
     * @default true
     */
    dropOnElement?: boolean;
    /**
     * When enabled, files are validated before they are dropped.
     * A file is not added when it’s invalid.
     * @default false
     */
    dropValidation?: boolean;
    /**
     * Ignored file names when handling dropped directories.
     * Dropping directories is not supported on all browsers.
     * @default ['.ds_store', 'thumbs.db', 'desktop.ini']
     */
    ignoredFiles?: string[];
}

export interface FilePondLabelProps {
    /**
     * The decimal separator used to render numbers.
     * By default this is determined automatically.
     * @default 'auto'
     */
    labelDecimalSeparator?: string;
    /**
     * The thousands separator used to render numbers.
     * By default this is determined automatically.
     * @default 'auto'
     */
    labelThousandsSeparator?: string;
    /**
     * Default label shown to indicate this is a drop area.
     * FilePond will automatically bind browse file events to
     * the element with CSS class .filepond--label-action.
     * @default 'Drag & Drop your files or <span class="filepond--label-action"> Browse </span>'
     */
    labelIdle?: string;
    /**
     * Label shown when the field contains invalid files and is validated by the parent form.
     * @default 'Field contains invalid files'
     */
    labelInvalidField?: string;
    /**
     * Label used while waiting for file size information.
     * @default 'Waiting for size'
     */
    labelFileWaitingForSize?: string;
    /**
     * Label used when no file size information was received.
     * @default 'Size not available'
     */
    labelFileSizeNotAvailable?: string;

    /**
     * Label used to indicate bytes
     * @default 'Bytes'
     */
    labelFileSizeBytes?: string;

    /**
     * Label used to indicate kilobytes
     * @default 'KB'
     */
    labelFileSizeKilobytes?: string;

    /**
     * Label used to indicate megabytes
     * @default 'MB'
     */
    labelFileSizeMegabytes?: string;

    /**
     * Label used to indicate gigabytes
     * @default 'GB'
     */
    labelFileSizeGigabytes?: string;

    /**
     * Label used when showing the number of files and there is only one.
     * @default 'file in list'
     */
    labelFileCountSingular?: string;
    /**
     * Label used when showing the number of files and there is more than one.
     * @default 'files in list'
     */
    labelFileCountPlural?: string;
    /**
     * Label used while loading a file.
     * @default 'Loading'
     */
    labelFileLoading?: string;
    /**
     * Label used when file is added (assistive only).
     * @default 'Added'
     */
    labelFileAdded?: string;
    /**
     * Label used when file load failed.
     * @default 'Error during load'
     */
    labelFileLoadError?: ((error: any) => string) | string;
    /**
     * Label used when file is removed (assistive only).
     * @default 'Removed'
     */
    labelFileRemoved?: string;
    /**
     * Label used when something went during during removing the file upload.
     * @default 'Error during remove'
     */
    labelFileRemoveError?: ((error: any) => string) | string;
    /**
     * Label used when uploading a file.
     * @default 'Uploading'
     */
    labelFileProcessing?: string;
    /**
     * Label used when file upload has completed.
     * @default 'Upload complete'
     */
    labelFileProcessingComplete?: string;
    /**
     * Label used when upload was cancelled.
     * @default 'Upload cancelled'
     */
    labelFileProcessingAborted?: string;
    /**
     * Label used when something went wrong during file upload.
     * @default 'Error during upload'
     */
    labelFileProcessingError?: ((error: any) => string) | string;
    /**
     * Label used when something went wrong during reverting the file upload.
     * @default 'Error during revert'
     */
    labelFileProcessingRevertError?: ((error: any) => string) | string;
    /**
     * Label used to indicate to the user that an action can be cancelled.
     * @default 'tap to cancel'
     */
    labelTapToCancel?: string;
    /**
     * Label used to indicate to the user that an action can be retried.
     * @default 'tap to retry'
     */
    labelTapToRetry?: string;
    /**
     * Label used to indicate to the user that an action can be undone.
     * @default 'tap to undo'
     */
    labelTapToUndo?: string;
    /**
     * Label used for remove button.
     * @default 'Remove'
     */
    labelButtonRemoveItem?: string;
    /**
     * Label used for abort load button.
     * @default 'Abort'
     */
    labelButtonAbortItemLoad?: string;
    /**
     * Label used for retry load.
     * @default 'Retry'
     */
    labelButtonRetryItemLoad?: string;
    /**
     * Label used for abort upload button.
     * @default 'Cancel'
     */
    labelButtonAbortItemProcessing?: string;
    /**
     * Label used for undo upload button.
     * @default 'Undo'
     */
    labelButtonUndoItemProcessing?: string;
    /**
     * Label used for retry upload button.
     * @default 'Retry'
     */
    labelButtonRetryItemProcessing?: string;
    /**
     * Label used for upload button.
     * @default 'Upload'
     */
    labelButtonProcessItem?: string;
}

export interface FilePondSvgIconProps {
    /**
     * The icon used for remove actions.
     * @default '<svg></svg>'
     */
    iconRemove?: string;
    /**
     * The icon used for process actions.
     * @default '<svg></svg>'
     */
    iconProcess?: string;
    /**
     * The icon used for retry actions.
     * @default '<svg></svg>'
     */
    iconRetry?: string;
    /**
     * The icon used for undo actions.
     * @default '<svg></svg>'
     */
    iconUndo?: string;
    /**
     * The icon used for done.
     * @default '<svg></svg>'
     */
    iconDone?: string;
}

export interface FilePondErrorDescription {
    type: string;
    code: number;
    body: string;
}

export interface FilePondCallbackProps {
    /** FilePond instance has been created and is ready. */
    oninit?: () => void;
    /**
     * FilePond instance throws a warning. For instance
     * when the maximum amount of files has been reached.
     * Optionally receives file if error is related to a
     * file object.
     */
    onwarning?: (error: any, file?: FilePondFile, status?: any) => void;
    /**
     * FilePond instance throws an error. Optionally receives
     * file if error is related to a file object.
     */
    onerror?: (error: FilePondErrorDescription, file?: FilePondFile, status?: any) => void;
    /** Started file load. */
    onaddfilestart?: (file: FilePondFile) => void;
    /** Made progress loading a file. */
    onaddfileprogress?: (file: FilePondFile, progress: number) => void;
    /** If no error, file has been successfully loaded. */
    onaddfile?: (error: FilePondErrorDescription | null, file: FilePondFile) => void;
    /** Started processing a file. */
    onprocessfilestart?: (file: FilePondFile) => void;
    /** Made progress processing a file. */
    onprocessfileprogress?: (file: FilePondFile, progress: number) => void;
    /** Aborted processing of a file. */
    onprocessfileabort?: (file: FilePondFile) => void;
    /** Processing of a file has been reverted. */
    onprocessfilerevert?: (file: FilePondFile) => void;
    /** If no error, Processing of a file has been completed. */
    onprocessfile?: (error: FilePondErrorDescription | null, file: FilePondFile) => void;
    /** Called when all files in the list have been processed. */
    onprocessfiles?: () => void;
    /** File has been removed. */
    onremovefile?: (error: FilePondErrorDescription | null, file: FilePondFile) => void;
    /**
     * File has been transformed by the transform plugin or
     * another plugin subscribing to the prepare_output filter.
     * It receives the file item and the output data.
     */
    onpreparefile?: (file: FilePondFile, output: any) => void;
    /** A file has been added or removed, receives a list of file items. */
    onupdatefiles?: (files: FilePondFile[]) => void;
    /* Called when a file is clicked or tapped. **/
    onactivatefile?: (file: FilePondFile) => void;
    /** Called when the files have been reordered */
    onreorderfiles?: (files: FilePondFile[]) => void;
}

export interface FilePondHookProps {
    /**
     * FilePond is about to allow this item to be dropped, it can be a URL or a File object.
     *
     * Return `true` or `false` depending on if you want to allow the item to be dropped.
     */
    beforeDropFile?: (file: FilePondFile | string) => boolean;
    /**
     * FilePond is about to add this file.
     *
     * Return `false` to prevent adding it, or return a `Promise` and resolve with `true` or `false`.
     */
    beforeAddFile?: (item: FilePondFile) => boolean | Promise<boolean>;
    /**
     * FilePond is about to remove this file.
     *
     * Return `false` to prevent adding it, or return a `Promise` and resolve with `true` or `false`.
     */
    beforeRemoveFile?: (item: FilePondFile) => boolean | Promise<boolean>;
}

export interface FilePondStyleProps {
    /**
     * Set a different layout render mode.
     * @default null
     */
    stylePanelLayout?:
        | 'integrated'
        | 'compact'
        | 'circle'
        | 'integrated circle'
        | 'compact circle'
        | null;
    /**
     * Set a forced aspect ratio for the FilePond drop area.
     *
     * Accepts human readable aspect ratios like `1:1` or numeric aspect ratios like `0.75`.
     * @default null
     */
    stylePanelAspectRatio?: string | null;
    /**
     * Set a forced aspect ratio for the file items.
     *
     * Useful when rendering cropped or fixed aspect ratio images in grid view.
     * @default null
     */
    styleItemPanelAspectRatio?: string | null;
    /**
     * The position of the remove item button.
     * @default 'left'
     */
    styleButtonRemoveItemPosition?: string;
    /**
     * The position of the remove item button.
     * @default 'right'
     */
    styleButtonProcessItemPosition?: string;
    /**
     * The position of the load indicator.
     * @default 'right'
     */
    styleLoadIndicatorPosition?: string;
    /**
     * The position of the progress indicator.
     * @default 'right'
     */
    styleProgressIndicatorPosition?: string;
    /**
     * Enable to align the remove button to the left side of the file item.
     * @default false
     */
    styleButtonRemoveItemAlign?: boolean;
}

export type CaptureAttribute = 'camera' | 'microphone' | 'camcorder';

export interface FilePondBaseProps {
    /**
     * The ID to add to the root element.
     * @default null
     */
    id?: string | null;
    /**
     * The input field name to use.
     * @default 'filepond'
     */
    name?: string;
    /**
     * Class Name to put on wrapper.
     * @default null
     */
    className?: string | null;
    /**
     * Sets the required attribute to the output field.
     * @default false
     */
    required?: boolean;
    /**
     * Sets the disabled attribute to the output field.
     * @default false
     */
    disabled?: boolean;
    /**
     * Sets the given value to the capture attribute.
     * @default null
     */
    captureMethod?: CaptureAttribute | null;
    /**
     * Set to false to prevent FilePond from setting the file input field `accept` attribute to the value of the `acceptedFileTypes`.
     */
    allowSyncAcceptAttribute?: boolean;
    /**
     * Enable or disable drag n’ drop.
     * @default true
     */
    allowDrop?: boolean;
    /**
     * Enable or disable file browser.
     * @default true
     */
    allowBrowse?: boolean;
    /**
     * Enable or disable pasting of files. Pasting files is not
     * supported on all browsers.
     * @default true
     */
    allowPaste?: boolean;
    /**
     * Enable or disable adding multiple files.
     * @default false
     */
    allowMultiple?: boolean;
    /**
     * Allow drop to replace a file, only works when allowMultiple is false.
     * @default true
     */
    allowReplace?: boolean;
    /**
     * Allows the user to revert file upload.
     * @default true
     */
    allowRevert?: boolean;
    /**
     * When set to false the remove button is hidden and disabled.
     * @default true
     */
    allowRemove?: boolean;
    /**
     * Allows user to process a file. When set to false, this removes the file upload button.
     * @default true
     */
    allowProcess?: boolean;
    /**
     * Allows the user to reorder the file items
     * @default false
     */
    allowReorder?: boolean;
    /**
     * Allow only selecting directories with browse (no support for filtering dnd at this point)
     * @default false
     */
    allowDirectoriesOnly?: boolean;

    /**
     * Require the file to be successfully reverted before continuing.
     * @default false
     */
    forceRevert?: boolean;

    /**
     * The maximum number of files that filepond pond can handle.
     * @default null
     */
    maxFiles?: number | null;
    /**
     * Enables custom validity messages.
     * @default false
     */
    checkValidity?: boolean;

    /**
     * Set to false to always add items to beginning or end of list.
     * @default true
     */
    itemInsertLocationFreedom?: boolean;
    /**
     * Default index in list to add items that have been dropped at the top of the list.
     * @default 'before'
     */
    itemInsertLocation?: 'before' | 'after' | ((a: FilePondFile, b: FilePondFile) => number);
    /**
     * The interval to use before showing each item being added to the list.
     * @default 75
     */
    itemInsertInterval?: number;
    /**
     * The base value used to calculate file size
     * @default 1000
     */
    fileSizeBase?: number;

    /**
     * Tells FilePond to store files in hidden file input elements so they can be posted along with
     * normal form post. This only works if the browser supports the DataTransfer constructor,
     * this is the case on Firefox, Chrome, Chromium powered browsers and Safari version 14.1
     * and higher.
     * @default false
     */
    storeAsFile?: boolean;

    /**
     * Shows Powered by PQINA in footer. Can be disabled by setting to false, but please do
     * link to https://pqina.nl somewhere else on your website, or otherwise donate to help
     * keep the project alive.
     * @default "Powered by PQINA"
     */
    credits?: false;
}

// TODO delete
/**
 * @deprecated use `FilePondOptions`. This will be removed in a future release.
 */
export interface FilePondOptionProps
    extends FilePondDragDropProps,
        FilePondServerConfigProps,
        FilePondLabelProps,
        FilePondSvgIconProps,
        FilePondCallbackProps,
        FilePondHookProps,
        FilePondStyleProps,
        FilePondBaseProps {}

export interface FilePondOptions
    extends FilePondDragDropProps,
        FilePondServerConfigProps,
        FilePondLabelProps,
        FilePondSvgIconProps,
        FilePondCallbackProps,
        FilePondHookProps,
        FilePondStyleProps,
        FilePondBaseProps {}

export type FilePondEventPrefixed =
    | 'FilePond:init'
    | 'FilePond:warning'
    | 'FilePond:error'
    | 'FilePond:addfilestart'
    | 'FilePond:addfileprogress'
    | 'FilePond:addfile'
    | 'FilePond:processfilestart'
    | 'FilePond:processfileprogress'
    | 'FilePond:processfileabort'
    | 'FilePond:processfilerevert'
    | 'FilePond:processfile'
    | 'FilePond:processfiles'
    | 'FilePond:removefile'
    | 'FilePond:updatefiles'
    | 'FilePond:reorderfiles';

export type FilePondEvent =
    | 'init'
    | 'warning'
    | 'error'
    | 'addfilestart'
    | 'addfileprogress'
    | 'addfile'
    | 'processfilestart'
    | 'processfileprogress'
    | 'processfileabort'
    | 'processfilerevert'
    | 'processfile'
    | 'processfiles'
    | 'removefile'
    | 'updatefiles'
    | 'reorderfiles';

export interface RemoveFileOptions {
    remove?: boolean;
    revert?: boolean;
}

export interface FilePond extends Required<FilePondOptions> {}

export class FilePond {
    /**
     * The root element of the Filepond instance.
     */
    readonly element: Element | null;
    /**
     * Returns the current status of the FilePond instance.
     * @default Status.EMPTY
     */
    readonly status: Status;

    /** Override multiple options at once. */
    setOptions(options: FilePondOptions): void;
    /**
     * Adds a file.
     * @param options.index The index that the file should be added at.
     */
    addFile(
        source: ActualFileObject | Blob | string,
        options?: { index?: number } & Partial<FilePondInitialFile['options']>
    ): Promise<FilePondFile>;
    /**
     * Adds multiple files.
     * @param options.index The index that the files should be added at.
     */
    addFiles(
        source: ActualFileObject[] | Blob[] | string[],
        options?: { index: number }
    ): Promise<FilePondFile[]>;
    /**
     * Moves a file. Select file with query and supply target index.
     * @param query The file reference, id, or index.
     * @param index The index to move the file to.
     */
    moveFile(query: FilePondFile | string | number, index: number): void;
    /**
     * Removes a file.
     * @param query The file reference, id, or index. If no query is provided, removes the first file in the list.
     * @param options Options for removal
     */
    removeFile(query?: FilePondFile | string | number, options?: RemoveFileOptions): void;
    /**
     * Removes the first file in the list.
     * @param options Options for removal
     */
    removeFile(options: RemoveFileOptions): void;

    /**
     * Removes files matching the query.
     * @param query Array containing file references, ids, and/or indexes. If no array is provided, all files are removed
     * @param options Options for removal
     */
    removeFiles(query?: Array<FilePondFile | string | number>, options?: RemoveFileOptions): void;
    /**
     * Removes all files.
     * @param options Options for removal
     */
    removeFiles(options: RemoveFileOptions): void;

    /**
     * Processes a file. If no parameter is provided, processes the first file in the list.
     * @param query The file reference, id, or index
     */
    processFile(query?: FilePondFile | string | number): Promise<FilePondFile>;
    /**
     * Processes multiple files. If no parameter is provided, processes all files.
     * @param query The file reference(s), id(s), or index(es)
     */
    processFiles(query?: FilePondFile[] | string[] | number[]): Promise<FilePondFile[]>;

    /**
     * Starts preparing the file matching the given query, returns a Promise, the Promise is resolved with the file item and the output file { file, output }
     * @param query The file reference, id, or index
     */
    prepareFile(
        query?: FilePondFile | string | number
    ): Promise<{ file: FilePondFile; output: any }>;
    /**
     * Processes multiple files. If no parameter is provided, processes all files.
     * @param query Array containing file reference(s), id(s), or index(es)
     */
    prepareFiles(
        query?: FilePondFile[] | string[] | number[]
    ): Promise<Array<{ file: FilePondFile; output: any }>>;

    /**
     * Returns a file. If no parameter is provided, returns the first file in the list.
     * @param query The file id, or index
     */
    getFile(query?: string | number): FilePondFile;
    /** Returns all files. */
    getFiles(): FilePondFile[];
    /**
     * Manually trigger the browse files panel.
     *
     * Only works if the call originates from the user.
     */
    browse(): void;
    /**
     * Sort the items in the files list.
     * @param compare The comparison function
     */
    sort(compare: (a: FilePondFile, b: FilePondFile) => number): void;
    /** Destroys this FilePond instance. */
    destroy(): void;

    /** Inserts the FilePond instance after the supplied element. */
    insertAfter(element: Element): void;
    /** Inserts the FilePond instance before the supplied element. */
    insertBefore(element: Element): void;
    /** Appends FilePond to the given element.  */
    appendTo(element: Element): void;
    /** Returns true if the current instance is attached to the supplied element. */
    isAttachedTo(element: Element): void;
    /** Replaces the supplied element with FilePond. */
    replaceElement(element: Element): void;
    /** If FilePond replaced the original element, this restores the original element to its original glory. */
    restoreElement(element: Element): void;

    /**
     * Adds an event listener to the given event.
     * @param event Name of the event, prefixed with `Filepond:`
     * @param fn Event handler
     */
    addEventListener(event: FilePondEventPrefixed, fn: (e: any) => void): void;
    /**
     * Listen to an event.
     * @param event Name of the event
     * @param fn Event handler, signature is identical to the callback method
     */
    on(event: FilePondEvent, fn: (...args: any[]) => void): void;
    /**
     * Listen to an event once and remove the handler.
     * @param event Name of the event
     * @param fn Event handler, signature is identical to the callback method
     */
    onOnce(event: FilePondEvent, fn: (...args: any[]) => void): void;
    /**
     * Stop listening to an event.
     * @param event Name of the event
     * @param fn Event handler, signature is identical to the callback method
     */
    off(event: FilePondEvent, fn: (...args: any[]) => void): void;
}

/** Creates a new FilePond instance. */
export function create(element?: Element, options?: FilePondOptions): FilePond;
/** Destroys the FilePond instance attached to the supplied element. */
export function destroy(element: Element): void;
/** Returns the FilePond instance attached to the supplied element. */
export function find(element: Element): FilePond;
/**
 * Parses a given section of the DOM tree for elements with class
 * .filepond and turns them into FilePond elements.
 */
export function parse(context: Element): void;
/** Registers a FilePond plugin for later use. */
export function registerPlugin(...plugins: any[]): void;
/** Sets page level default options for all FilePond instances. */
export function setOptions(options: FilePondOptions): void;
/** Returns the current default options. */
export function getOptions(): FilePondOptions;
/** Determines whether or not the browser supports FilePond. */
export function supported(): boolean;
/** Returns an object describing all the available options and their types, useful for writing FilePond adapters. */
export const OptionTypes: object;
