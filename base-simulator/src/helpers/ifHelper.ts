export class IfHelper {

    public static toIfFrameworkConfig(x: object) {
        const objectName = x.constructor.name;

         return {
            [objectName]: {
                ...x
            }
         }
    }
}