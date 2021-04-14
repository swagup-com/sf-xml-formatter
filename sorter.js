const types = {
    basic  : 'basic',
    object : 'object', 
    array  : 'array',
}

const getType = value => {
    if (Array.isArray(value)) {
        return types.array;
    } else if (typeof value !== 'object') {
        return types.basic;
    } else {
        return types.object;
    }
}

const mySortFunction = (a, b, key, relevantsKeys) => {
    const aIdentifier = getIdentifier(key, a, relevantsKeys);
    const bIdentifier = getIdentifier(key, b, relevantsKeys);

    if (aIdentifier < bIdentifier) {
        return -1;
    }
    
    if (aIdentifier > bIdentifier) {
        return 1;
    }

    return 0;
}

const getIdentifier = (key, value, relevantKeys) => {
    switch (getType(value)) {
        case types.basic:
            return key + ":" + getIdentifierFromBasicType(value);
    
        case types.array:
            return key + ":" + getIdentifierFromArray(key, value, relevantKeys);


        case types.object:
            relevantKeys = relevantKeys ? relevantKeys : Reflect.ownKeys(value);
            return key + ":" + getIdentifierFromObject(key, value, relevantKeys); 
    }
}

const getIdentifierFromBasicType = value => {
    return value.toString();
}

const getIdentifierFromArray = (key, value, relevantKeys)  => {
    return value
            .map(item => getIdentifier(key, item,  relevantKeys))
            .join();
}

const getIdentifierFromObject = (key, value, relevantKeys) => {
    const myRelevantKeys = relevantKeys.get(key) !== undefined ? 
                           relevantKeys.get(key) : 
                           Reflect.ownKeys(value)
    return myRelevantKeys
            .map(item => getIdentifier(item , value[item], relevantKeys))
            .join('|');
}

const sort = (object, options, key) => {
    const {relevantKeys = new Map(), nonSortKeys = []} = options;

    if (nonSortKeys.indexOf(key) !== -1) {
        return object;
    }

    switch (getType(object)) {
        case types.basic:
            return object 
    
        case types.array:
            return object.map(item => sort(item, options, key))
                .sort((a, b) => mySortFunction(a, b, key, relevantKeys));
        
        case types.object:
            let newObject = {};
            let sortedKeys = Reflect.ownKeys(object).sort();
            sortedKeys.forEach(innerKey => {
                newObject[innerKey] = sort(object[innerKey], options, innerKey);
            })
            return newObject;
    }
}

module.exports = {
    sort,
}