export interface ProductImage {
    id: number;
    index: number;
    main: boolean;
    url: string;
    thumbnailUrl: string;
    lowResolutionUrl: string;
    standardUrl: string;
    originalImage: string;
    status: string;
    standardWidth: number;
    standardHeight: number;
    originalWidth: number;
    originalHeight: number;
    productId: number;
}