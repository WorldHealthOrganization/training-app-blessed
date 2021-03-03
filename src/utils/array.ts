import _ from "lodash";
import { Ref } from "../domain/entities/Ref";

export const arrayFill = (size: number) => [...Array(size).keys()];

export const swapById = <T extends Ref>(array: T[], id1: string, id2: string) => {
    const result = _.clone(array);

    const index1 = _.findIndex(array, ({ id }) => id === id1);
    const index2 = _.findIndex(array, ({ id }) => id === id2);

    const item1 = array[_.findIndex(array, ({ id }) => id === id1)];
    const item2 = array[_.findIndex(array, ({ id }) => id === id2)];
    if (!item1 || !item2) return result;

    result[index1] = item2;
    result[index2] = item1;

    return result;
};
