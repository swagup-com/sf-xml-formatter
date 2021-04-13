
const mySortFunction = (a, b) => {
  const aIdentifier = getIdentifier(a);
  const bIdentifier = getIdentifier(b);
  
  if (aIdentifier < bIdentifier) {
    return -1
  }

  if (aIdentifier > bIdentifier) {
    return 1
  }

  return 0
}

const sort = object => {
  if (typeof object !== 'object') {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map(value => sort(value)).sort(mySortFunction);
  }

  Reflect.ownKeys(object).forEach(key => {
    object[key] = sort(object[key]);
  });

  let sortedKeys = Reflect.ownKeys(object).sort((a, b) => mySortFunction({[a] : object[a]}, {[b] : object[b]}));

  let newObject = {};
  
  sortedKeys.forEach(key => {
    newObject[key] = object[key];
  });

  return newObject;

}

const getIdentifier = (object) => {
    if (typeof object !== 'object') {
        return getIdentifierFromBasicType(object);
    } else if (Array.isArray(object)) {
        return getIdentifierFromArray(object);
    } else {
        return getIdentifierFromObject(object);
    }
}

const getIdentifierFromBasicType = object => object.toString()

const getIdentifierFromArray = object => {
    return object.map(value => getIdentifier(value)).join();
}

const getIdentifierFromObject = object => {
    return Reflect.ownKeys(object).map(key => {
      return key.toString() + ":" + getIdentifier(object[key]);
    }).join("|");
}

module.exports = {
    sort,
}