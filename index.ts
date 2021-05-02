import axios from 'axios';
import fs from 'fs';
import { getAverageColor } from 'fast-average-color-node';
import { URLS, EUROPEAN_PAINTINGS, MAX_OBJECTS, IImage, colors } from './constants';

const execute = async () => {
    const departmentId = await getEuropeanDepartmentId();
    const objectsIds = await getObjects(departmentId);
    const objectsData = await getObjectsData(objectsIds);

    console.info(`Received results for ${objectsData.length} images, writing to results.json file`);
    await fs.writeFileSync('results.json', JSON.stringify(objectsData));
}

const getEuropeanDepartmentId = async (): Promise<string> => {
    const departments = await axios.get(`${URLS.path}${URLS.departments}`);
    if (departments.status >= 200 && departments.status < 300) {
        const europeanDepartment = departments.data.departments.find(
            department => department.displayName === EUROPEAN_PAINTINGS);
        if (!europeanDepartment || !europeanDepartment.departmentId) {
            throw new Error(`Error retrieving ${EUROPEAN_PAINTINGS} id`);
        }

        return europeanDepartment.departmentId;
    } else {
        throw new Error(`Error retrieving departments ${departments.status} : ${departments.statusText}`)
    }
};

const getObjects = async (departmentId: string): Promise<string[]> => {
    const objects = await axios.get(`${URLS.path}${URLS.objectsDepartmentIds}${departmentId}`);
    if ((objects.status >= 200 && objects.status < 300) || !objects.data.objectIDs) {
        return objects.data.objectIDs.slice(0, MAX_OBJECTS);
    } else {
        throw new Error(`Error retrieving objects of department ${departmentId}`)
    }
}

const getObjectsData = async (objectsIds: string[]): Promise<IImage[]> => {
    const images: IImage[] = [];

    const objectData = await Promise.all(objectsIds.map(async id => {
        const objectData = await axios.get(`${URLS.path}${URLS.objects}${id}`);
        return objectData.data;
    }));

    await Promise.all(objectData.map(async data => {
        try {
            if (data.primaryImageSmall !== '') {
                const { value } = await getAverageColor(data.primaryImageSmall);
                const maxIndex = value.slice(0, 3).reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
                const primaryDominantColor = maxIndex === 0 ? colors.red : (maxIndex === 1 ? colors.green : colors.blue);

                images.push({ objectId: data.objectID, imageUrl: data.primaryImage, primaryDominantColor })
            }
        } catch (ex) {
            //fast-average-color-node has an error on large images to parse, we'll set color to be 'error' in this case.
            images.push({ objectId: data.objectID, imageUrl: data.primaryImage, primaryDominantColor: colors.error })
        }
    }));

    return images;
}

execute();
