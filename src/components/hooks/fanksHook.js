
export const fieldsAreNotEmpty = obj => {
    return Object.values(obj).every(value => value !== '')
}

export const validEmail = email => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}