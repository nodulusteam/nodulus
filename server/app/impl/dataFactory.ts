/*                 _       _
                 | |     | |
  _ __   ___   __| |_   _| |_   _ ___
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016 
 */
/// <reference path="../../typings/main.d.ts" />

 

 

import * as diskdb from "./diskdb";
import * as mongodb from "./mongodb";

export class DataFactory {
    public static createDal(type: string): nodulus.IDal {
        if (type === "diskdb") {
        return new diskdb.dal();
        } else if (type === "mongodb") {
            return new mongodb.dal();
        }

return null;
}
}