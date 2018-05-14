export const USER_ROLES = {
    NORMAL: 0,
    ADMIN: 1
};

export const DEFAULT_USER = {
    username: 'admin',
    password: 'swAdmin12',
    role: USER_ROLES.ADMIN
};

export const DOCUMENT_ACCESS = {
    PUBLIC: 0,
    PRIVATE: 1
};

export const ENTITY_TYPES = {
    UNKNOWN: 0,
    MARKER: 1,
    HYDROLOGY: 2,
    WEATHER: 3,
    SHIP: 4,
    DOCUMENT: 5,
    INFO: 6,
};

export const DEFAULT_PAGE_SIZE = 20;
export const MIN_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const WEATHER = {
    SUNNY: 0,
    CLOUDY: 1,
    OVERCAST: 2,
    MIST: 3,
    FOG: 4,
    RAIN: 5,
    SHOWER: 6,
    STORM: 7,
    SNOW: 8,
    SLEET: 9,
    HAIL: 10,
};
