export const handleFormHook = (target, set) => {
    const { name, value } = target;
    console.log(value);
    set( old => {
        return {
            ...old,
            [name]: value
        }
    })
};