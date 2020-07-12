export const updateObject = (oldObject, updatedObject) => {
    return {
        ...oldObject,
        ...updatedObject
    }
}

export const checkValidity = (value, rules) => {
    let isValid = true;
    if (!rules) return true

    if (rules.required) {
        isValid = value.trim() !== '' && isValid; //smart solution
    }
    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid;
    }
    if (rules.isEmail) {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        isValid = pattern.test(value) && isValid
    }
    return isValid;
}