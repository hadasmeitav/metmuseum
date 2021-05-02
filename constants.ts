export const URLS = {
    path: 'https://collectionapi.metmuseum.org/public/collection/v1/',
    departments: 'departments',
    objects: 'objects/',
    objectsDepartmentIds: 'objects?departmentIds=',
}

export const EUROPEAN_PAINTINGS = 'European Paintings';
export const MAX_OBJECTS = 100;

export interface IImage {
    objectId: string,
    imageUrl: string,
    primaryDominantColor: string,
}

export enum colors {
    red = 'red',
    green = 'green',
    blue = 'blue',
    error = 'error',
}