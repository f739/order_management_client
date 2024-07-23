
export const fieldsAreNotEmpty = input => {
    if (Array.isArray(input)) {
        return input.every(obj => Object.values(obj).every(value => value !== '' && value != null));
    } else if (typeof input === 'object' && input !== null) {
        return Object.values(input).every(value => value !== '' && value != undefined);
    }
    return false;
}

export const validEmail = email => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}