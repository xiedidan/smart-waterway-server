import _ from 'lodash';
import Promise from 'bluebird';
import { Entity, Record } from '../models';
import { logger } from '../lib/logger';
import * as CONSTS from '../consts';

let driverInterval = null;

export async function startDriver() {
    driverInterval = setInterval(async () => {
        try {
            // find out all entities
            const entities = await Entity.find();

            // remove records created too long ago
            const now = new Date();
            const limit = now.getTime() - CONSTS.DRIVER_RECORD_LIFE;
            const removeQuery = { createdAt: { $lt: limit } };
            await Record.remove(removeQuery);
            
            await Promise.mapSeries(entities, async (entity) => {
                let data = null;
                let shipIndex = 0;

                // create record for entity
                switch (entity.type) {
                case CONSTS.ENTITY_TYPES.WEATHER:
                    data = {
                        weather: getRandomNumber('int', 0, 10),
                        level: getRandomNumber('int', 1, 5),
                        temperature: getRandomNumber('float', 10.0, 20.0),
                        humidity: getRandomNumber('float', 40.0, 90.0),
                    };
                    break;

                case CONSTS.ENTITY_TYPES.HYDROLOGY:
                    data = {
                        level: getRandomNumber('int', 300, 400),
                        rate: getRandomNumber('float', 0.0, 10.0),
                    };
                    break;

                case CONSTS.ENTITY_TYPES.MARKER:
                    data = {
                        error: getRandomNumber('boolean', 0, 1),
                        shift: getRandomNumber('boolean', 0, 1),
                    };
                    break;

                case CONSTS.ENTITY_TYPES.SHIP:
                    data = {
                        speed: getRandomNumber('float', 0.1, 5.0),
                    };

                    // update ship's location
                    shipIndex = getShipLocationIndex(entity.location.coordinates);
                    shipIndex += getRandomNumber('int', 0, 2);
                    if (shipIndex >= CONSTS.DRIVER_CENTER_LINE_1.length) {
                        shipIndex = 0;
                    }

                    entity.location.coordinates = CONSTS
                        .DRIVER_CENTER_LINE_1
                        .coordinates[shipIndex];

                    await entity.save();
                    break;

                case CONSTS.ENTITY_TYPES.INFO:
                    // insert a dummy record
                    data = {
                        entity: entity._id,
                        data: 0
                    };
                    break;

                case CONSTS.ENTITY_TYPES.DOCUMENT:
                    // insert a dummpy record
                    data = {
                        entity: entity._id,
                        data: 0
                    };
                    break;

                default:
                    return Promise.resolve(null);
                }

                const record = await Record.create({
                    entity: entity._id,
                    data,
                });

                return record;
            });
        } catch (err) {
            logger.error(`driver.service::driverInterval error - ${err.stack}`);
        }
    }, CONSTS.DRIVER_INTERVAL);
}

export async function stopDriver() {
    if (driverInterval != null) {
        clearInterval(driverInterval);
    }
}

function getRandomNumber(type, lower, upper) {
    let lowerBound = lower;
    let upperBound = upper;

    if (lower > upper) {
        lowerBound = upper;
        upperBound = lower;
    }

    const result = ((upperBound - lowerBound) * Math.random()) + lowerBound;

    switch (type) {
    case 'float':
        return result;

    case 'int':
        return ((result + 0.5) | 0);

    case 'boolean':
        return (((result + 0.5) | 0) === 1);

    default:
        return result;
    }
}

function getShipLocationIndex(location) {
    let result = 0;

    try {
        result = CONSTS.DRIVER_CENTER_LINE_1.coordinates.reduce((prev, curr, index) => {
            if (curr[0] === location[0] && curr[1] === location[1]) {
                return index;
            }
    
            return prev;
        }, 0);
    } catch (err) {
        logger.error(`driver.service::getShipLocationIndex error - ${err.stack}`);
        result = 0;
    }

    return result;
}
